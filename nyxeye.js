/*
 * 
 * NIXEYE Boot File
 * ========= (alpha) 
 * 
 */




/* 
 * LOOK - Performance Profiler 
 * =================================
 * 
 * Tune it to fit your needs!
 * Comment it out if not using it!
 * 
 */
 
require('look').start(5959, '0.0.0.0'); // TODO -> Please do fit this into the config file !!!




/* Load external dependencies */
var express = require('express'),
	cors = require('cors'),
	http = require('http'),
	path = require('path'),
	cpl = express(),
	pxr = express(),
	stats = require(__dirname + '/core/stats.core.js').StatsCore,
	tb01 = require('toobusy-js'),	// toobusy CPL instance
	tb02 = require('toobusy-js'),	// toobusy PXR instance
	mongo = require(__dirname + '/core/db.core.js'),
	cnf = require(__dirname + '/core/cnf.core.js').settings;


/* Mapping routes holders*/
var afwRT = require('./routes/afw.route.js'),	// app firewall route
	apiRT = require('./routes/api.route.js'),	// app API route
	webRT = require('./routes/web.route.js'),	// app CPL route
	pxrRT = require('./routes/pxr.route.js');	// app PXR route


/* Loading loggers */
var errorlog = require(__dirname + '/core/logs.core.js').ErrorLog,
	eventlog = require(__dirname + '/core/logs.core.js').EventLog;



/* Implementing toobusy limits */
tb01.maxLag = cnf.tbMaxLag2;
tb02.maxLag = cnf.tbMaxLag1;


/* Declaring new stats instance */
var stats = new StatsCore();


/* 
 * Setup CPL  env 
 */

cpl.set('port', process.env.PORT || cnf.port1);
cpl.set('views', __dirname + '/views');
cpl.set('view engine', 'jade');
//cpl.use(express.logger('dev')); // EXPRESS HTTP REQUEST CONSOLE LOGGER
cpl.use(express.bodyParser());
cpl.use(express.methodOverride());
cpl.use(cpl.router);
cpl.use(require('stylus').middleware(__dirname + '/public'));
cpl.use(express.static(path.join(__dirname, 'public')));
cpl.use(cors());
cpl.options('*', cors());


/* CPL TOOBUSY MIDDLEWARE */
cpl.use(function(req, res, next){
  if(tb01()){res.send(503, cnf.tbMsg);}
  else{next();}
});

/* :::::::::::::::::::::::::::::::::: */






/* 
 * ::::::::::::::::::::::::::::::::::
 * SETUP PXR ENV
 * ::::::::::::::::::::::::::::::::::
 */
 
pxr.set('port', process.env.PORT || cnf.port2);

/* CPL TOOBUSY MIDDLEWARE */
pxr.use(function(req, res, next){
  if(tb02()){res.send(503, cnf.tbMsg);}
  else{next();}
});

//pxr.use(express.logger('dev'));
pxr.use(pxr.router);

/* :::::::::::::::::::::::::::::::::: */






/* 
 * ::::::::::::::::::::::::::::::::::
 * 		IMTAS ROUTING TABLE
 * :::::::::::::::::::::::::::::::::: 
 */

// CPL web root routing
cpl.get('/', afwRT.bailout);
cpl.post('/', afwRT.bailout);

// CPL api routing
cpl.get('/api', afwRT.bailout);
cpl.post('/api', apiRT.apihandler);

// CPL fail safe routing
cpl.get('*', afwRT.bailout);
cpl.post('*', afwRT.bailout);



// PXR routing
pxr.get('*', pxrRT.pxrHandler);
pxr.post('*', pxrRT.pxrHandler);


/* :::::::::::::::::::::::::::::::::: */





/*
 * ::::::::::::::::::::::::::::::::::
 * 	NIXEYE WEB SERVICE BOOT
 * ::::::::::::::::::::::::::::::::::
 */

// starting unique db driver instance
mongo.init(function(error){
	
	// fail safe bail out
	if(error){errorlog.error(error); throw new Error('Main database is absent or disconnected...'); }
	
	// reset console
	process.stdout.write('\u001B[2J\u001B[0;0f');
	
	
	
	
	/*
	 * ::::::::::::::::::::::::::::::::::
	 * 	NIXEYE CPL SERVICE BOOT SETUP
	 * ::::::::::::::::::::::::::::::::::
	 */
	var cplSRV = http.createServer(cpl).listen(cpl.get('port'), function(){
		
		// announce sys info
		eventlog.info(cnf.message);
		eventlog.info('-----|> CPL @ ' + cnf.port1 + '/tcp');
	
	});
	
	
	
	
	/*
	 * ::::::::::::::::::::::::::::::::::
	 * 	NIXEYE PXR SERVICE BOOT SETUP
	 * ::::::::::::::::::::::::::::::::::
	 */

	var pxrSRV = http.createServer(pxr).listen(pxr.get('port'), function(){
		
		// announce sys info
		eventlog.info(cnf.message);
		eventlog.info('-----|> Proxy @ ' + cnf.port2+ '/tcp');
	});
		
		
		
		
		
		
		
		
		
		
	/* AUTO UPDATING STATS BANNER */	
	setInterval(function(){
		
		
		// reset console
		//process.stdout.write('\u001B[2J\u001B[0;0f');
		
		
		// traffic count banner
		stats.countTraffic(function(err, count){
			
			// fail safe bail out
			if(err){errorlog.error(err);}
			eventlog.info('> Traffic Count: ' + count);
		});
		
		
		
		
		
		
		// bot count banner
		stats.countBots(function(err, count){
			
			// fail safe bai out
			if(err){errorlog.error(err);}
			eventlog.info('> Bot Count: ' + count);
		});
		
		
		
		
		 /*
		// IPv4 count banner
		stats.countIPv4(function(err, count){
			
			// fail safe bail out
			if(err){errorlog.error(err);}
			eventlog.info('> IPv4 Count: ' + count);
		});
		*/
		
	}, 60000);	
		
		
/* mongo init end */	
});









/* PROCESS SIGNALS MONITOR */

process.on('uncaughtException', function(err){errorlog.error(err);});

/* :::::::::::::::::::::::::::::::::: */
