/*
 * 
 * NIXEYE CNF Core
 * ======== (alpha) 
 * 
 */
 
 
 
/* SYSTEM USED PATHS */
exports.syspaths = {
	
	tmp: __dirname + '/../tmp/',				// NYXEYE temp files folder path
	payload: __dirname + '/../payloads/'		// NYXEYE payloads folder path
};



/* DB CONNECTION SETTINGS */
exports.dbdata = {
		
	dbname: 'nyxeye',							// MongoDB database name
	host: 'localhost',							// MongoDB hostname
	port: 27017									// MongoDB port
};



/* SYSTEM SETTINGS */
exports.settings = {
	
	message: '(*) NIXEYE (*)',					// main sys message / welcome message
	tbMsg: '（◎ ｡ ◎）',							// toobusy message (displayed when server is under load)
	tbMaxLag1: 50,								// toobusy max lag limit flag (feel free to tune it)
	tbMaxLag2: 50,								// toobusy max lag limit flag (feel free to tune it)
	payload: 'nxtrk',							// payload to be delivered
	port1: 8000,									// defining CPL tcp port
	port2: 8080,								// defining PXR tcp port
	port3: 3128									// extra port, just in case (leave blank if not used...)
};
