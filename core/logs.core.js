/*
 * 
 * NIXEYE LOG Core
 * ======== (alpha) 
 * 
 */


// requiring needed external libs
var log4js = require('log4js');



// setup log4js engine
log4js.configure({



appenders: [
	
	
	{ type: 'file', filename: __dirname+"/../logs/event.log", category: 'NIXEYE.EVENT' }, // Event log handler
	{ type: 'console', category: 'NIXEYE.EVENT' }, // Event log handler
	{ type: 'file', filename: __dirname+"/../logs/error.log", category: 'NIXEYE.ERROR' }, // Error log handler
	{ type: 'file', filename: __dirname+"/../logs/auth.log", category: 'NIXEYE.AUTH' } 	// Authentication log handler

]});



var errorlog  = log4js.getLogger('NIXEYE.ERROR');
errorlog.setLevel('DEBUG');
Object.defineProperty(exports, "ErrorLog", {
            value:errorlog,
});



var eventlog  = log4js.getLogger('NIXEYE.EVENT');
eventlog.setLevel('DEBUG');
Object.defineProperty(exports, "EventLog", {
            value:eventlog,
});



var authlog  = log4js.getLogger('NIXEYE.AUTH');
authlog.setLevel('DEBUG');
Object.defineProperty(exports, "AuthLog", {
            value:authlog,
});
