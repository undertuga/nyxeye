/*
 *
 * NIXEYE CNF Core
 * ======== (alpha)
 *
 */



 /*
  * ===================================================
  * LOAD MONITORING ADVISE
  * ===================================================
  *
  * Do proper tunning on the toobusy-js load values,
  * if you are not in the need of a melted server!
  *
  * ====================================================
  */





/* SYSTEM USED PATHS */
exports.syspaths = {

	tmp: __dirname + '/../tmp/',				// NYXEYE temp files folder path
	payload: __dirname + '/../payloads/',		// NYXEYE payloads folder path
	traffic: __dirname + '/../traffic/'			// NYXEYE traffic logging folder path
};



/* DB CONNECTION SETTINGS */
exports.dbdata = {

    dbname: 'HERA',
    hosts: ['mrs00, mrs01'],
    port: 27017
};



/* SYSTEM SETTINGS */
exports.settings = {

	screenClean: '\u001B[2J\u001B[0;0f', 		// screen clean command
	message: '(*) NIXEYE (*)',					// main sys message / welcome message
	errorMsg: 'boom...',						// general error message
	dbErrorMsg: 'Main database is absent or disconnected...',	// database error message
	tbMsg: '（◎ ｡ ◎）',							// toobusy message (displayed when server is under load)
	tbMaxLag1: 10,								// toobusy max lag limit flag (feel free to tune it)
	tbMaxLag2: 5,								// toobusy max lag limit flag (feel free to tune it)
	tbInterval1: 100,							// toobusy #1 interval
	tbInterval2: 100,							// toobusy #2 interval
	payload: 'nxtrk',							// payload to be delivered
	port1: 80,									// defining CPL tcp port
	port2: 8080,								// defining PXR tcp port
	port3: 3128,								// extra port, just in case (leave blank if not used...)
	lookHost: '0.0.0.0',						// LOOK host
	lookPort: 5959								// LOOK port
};
