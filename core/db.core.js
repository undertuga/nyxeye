/*
 * Declaring require holders
 * ----------------------------
 * All external requires are
 * placed on this section
 */

var dbcfg = require('./cnf.core.js').dbdata;

var mongodb = require('mongodb'),
	Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').BSON;

var errorlog = require('./logs.core.js').ErrorLog;
var eventlog = require('./logs.core.js').EventLog;


module.exports.init = function (callback){

	var url = 'mongodb://mrs1:27017,mrs2:27017/NYXEYE?replicaSet=madnetMRS';
	MongoClient.connect(url, function(err, db) {

		// keep looking for process killing signs
		process.on('SIGINT', function(){

			// perform clean db shutdown...
			eventlog.warn("# Shutting down MongoDB instances...");
			db.close();
			process.exit();
		});



		// fail safe bail out
		if(err){errorlog.error(err); callback(err);}
		else{

			// log db connect event
			eventlog.warn("Connected with main MongoDB server");

			// exporting required cosllections
			module.exports.traffic 	= db.collection('traffic');
			module.exports.botnet 	= db.collection('botnet');
			module.exports.ipv4 	= db.collection('ipv4');
			module.exports.admin 	= db.collection('admin');
			module.exports.stats 	= db.collection('stats');
			callback(err);
		}

	});
};
