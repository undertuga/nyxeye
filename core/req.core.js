/*
 * 
 * NIXEYE Request Parsing Core
 * =================== (alpha) 
 * 
 */
 
 
 
// logger requires
var errorlog = require('./logs.core.js').ErrorLog,
	eventlog = require('./logs.core.js').EventLog;



// external libs
var url = require('url'), 
	fs = require('graceful-fs'), 
	conf = require('./cnf.core.js').syspaths;


// declaring prototypes holder
ReqCore = function(){};





ReqCore.prototype.parseRequest = function(req, callback){
	
	// validating gathered request
	if((typeof(req) === 'undefined') || (req === null)){callback(null, 1);}
	else{
		
		// parsing request data / gather goodies
		var url_parts = url.parse(req.url, true), 
			ipv4 = req.connection.remoteAddress.replace('::ffff:', ''),
			reqdata = {
			
				method: req.method,
				headers: req.headers,
				url: req.url,
				params: url_parts.query,
				cookie: req.headers.cookie,
				tstamp: new Date()
		};
		
		
		
		// logging prx request
		fs.appendFileSync(conf.traffic + ipv4, reqdata);
		
		
		
		
		/*
		// adding data to db
		mongo.traffic.insert({
			
			ipv4: req.connection.remoteAddress.replace('::ffff:', ''),
			reqdata: reqdata,
			tstamp: new Date()
			
		},
			
		function(err, res){
			
			// fail safe bail out
			if(err){errorlog.error(err); callback(null, false);}
			if(!res){callback(null, false);}else{callback(null, true);}
		
		});
		*/
		
		 
	}
};




// exporting prototypes
exports.ReqCore = ReqCore;
