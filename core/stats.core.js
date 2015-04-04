/*
 * 
 * NIXEYE Bot Management Core
 * =================== (alpha) 
 * 
 */
 
 
 
// logger requires
var errorlog = require('./logs.core.js').ErrorLog,
	eventlog = require('./logs.core.js').EventLog;



// external libs
var mongo = require('./db.core.js');



/* BOT CORE MAIN PROTOTYPE HOLDER */
StatsCore = function(){};






/* 
 * 
 * STATS COUNTERS 
 *
 */

StatsCore.prototype.countTraffic = function(callback){
	
	// gathering traffic count
	mongo.traffic.count({}, function(err, count){
		
		// fail safe bail out
		if(err){errorlog.error(err); callback(null, false);}
		else{callback(null, count);} // return traffic count
	});
};






StatsCore.prototype.countBots = function(callback){
	
	// gathering bot count
	mongo.botnet.count({}, function(err, count){
		
		// fail safe bail out
		if(err){errorlog.error(err); callback(null, false);}
		else{callback(null, count);} // return bot count
	});
};






StatsCore.prototype.countIPv4 = function(callback){
	
	// gathering ipv4 count
	mongo.ipv4.count({}, function(err, count){
		
		// fail safe bail out
		if(err){errorlog.error(err); callback(null, false);}
		else{callback(null, count);} // return ipv4 count
	});
};



/* ============================================================ */






/* 
 * 
 * IPv4 DATA 
 *
 */
 
 
StatsCore.prototype.getIPv4Data = function(ipv4, callback){
	
	// validating gathered data
	if((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4.length <= 0)){callback(null, false);}
	else{
		
		// gathering ipv4 data
		mongo.ipv4.findOne({ipv4: ipv4}, {}, function(err, ipdata){
			
			// fail safe bail out
			if(err){errorlog.error(err); callback(null, false);}
			if(!ipdata){callback(null, false);}else{callback(null, ipdata);}
		});
	}
};






StatsCore.prototype.getIPv4Traffic = function(ipv4, callback){
	
	// validating gathered data
	if((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4.length <= 0)){callback(null, false);}
	else{
		
		// gathering traffic data
		mongo.traffic.find({ipv4: ipv4}, {}).toArray(function(err, iptraffic){
			
			// fail safe bail out
			if(err){errorlog.error(err); callback(null, false);}
			if(!iptraffic){callback(null, false);}else{callback(null, true);}
		});
	}
};






/* ============================================================ */









// exporting prototypes
exports.StatsCore = StatsCore;
