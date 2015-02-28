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
var mongo = require('./db.core.js'),
	url = require('url'),
	iptools = require('ipv4-tools').IPv4Tools;



// declaring prototypes holder
ReqCore = function(){};




ReqCore.prototype.setIPv4 = function(ipv4, callback){
	
	// validating gathered data
	if((typeof(ipv4) === 'undefined') || (ipv4 === null)){callback(null, false);}
	else{
		
		// checking for ipv4
		mongo.ipv4.count({ipv4: ipv4}, function(err, count){
			
			// fail safe bail out
			if(err){errorlog.error(err); callback(null, false);}
			if(count <= 0){
				
				var iptools = new IPv4Tools();
				iptools.getNetworkData(ipv4, function(err, netdata){
							
					// fail safe bail out
					if(err){errorlog.error(err); callback(null, false);}
					if(!netdata){callback(null, false);}
					else{
						
						// add netdata to db
						mongo.ipv4.insert({
							
							ipv4: ipv4, 
							netdata: netdata,
							tstamp: new Date()
						}, 
							
						function(err, upres){
					
							// fail safe bail out
							if(err){errorlog.error(err); callback(null, false);}
							if(!upres){callback(null, false);}else{callback(null, true);}
							
						});
					}
				});
				
			}else{callback(null, true);}
		});
	}
};




ReqCore.prototype.parseRequest = function(req, callback){
	
	// validating gathered request
	if((typeof(req) === 'undefined') || (req === null)){callback(null, 1);}
	else{
		
		// parsing request data / gather goodies
		var url_parts = url.parse(req.url, true);
		var reqdata = {
			
			method: req.method,
			headers: req.headers,
			url: req.url,
			params: url_parts.query,
			cookie: req.headers.cookie,
			tstamp: new Date()
		};
		
		// adding data to db
		mongo.traffic.insert({
			
			ipv4: req.connection.remoteAddress,
			reqdata: reqdata,
			tstamp: new Date()
			
		},
			
		function(err, res){
			
			// fail safe bail out
			if(err){errorlog.error(err); callback(null, false);}
			if(!res){callback(null, false);}else{callback(null, true);}
		
		});
	}
};




// exporting prototypes
exports.ReqCore = ReqCore;
