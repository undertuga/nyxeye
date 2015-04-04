/*
 * 
 * NIXEYE DBI Core
 * ======== (alpha) 
 * 
 */


/*
 * Declaring require holders
 * ----------------------------
 * All external requires are
 * placed on this section
 * 
 */

var dbcfg = require('./cnf.core.js').dbdata;
var mongodb = require('mongodb');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var errorlog = require('./logs.core.js').ErrorLog;
var eventlog = require('./logs.core.js').EventLog;



module.exports.init = function (callback){
	
	
	// make mongo db adapter connection to server
	var db = new Db(dbcfg.dbname, new Server(dbcfg.host, dbcfg.port, {}), {safe: false});
	db.open(function(error, client){
		
		// keep looking for process killing signs
		process.on('SIGINT', function(){
			
			// perform clean db shutdown...
			eventlog.warn("# Shutting down MongoDB instances...");
			db.close();
			process.exit();
		});
		
		
		
		// fail safe bail out
		if(error){errorlog.error(error); callback(error);}
		else{
		
			// log db connect event
			eventlog.warn("Connected with main MongoDB server");
		
			// exporting required collections
			module.exports.client = client;
			module.exports.traffic = new mongodb.Collection(client, 'traffic');
			module.exports.botnet = new mongodb.Collection(client, 'botnet');
			module.exports.ipv4 = new mongodb.Collection(client, 'ipv4');
			module.exports.admin = new mongodb.Collection(client, 'admin');
			module.exports.stats = new mongodb.Collection(client, 'stats');
			callback(error);
		}
	});
};
