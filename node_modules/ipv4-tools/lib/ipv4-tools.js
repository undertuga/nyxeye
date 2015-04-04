/*
 * ==============================================================
 * 						IPv4-Tools (v0.2.0)
 * ==============================================================
 * 	
 * 	IPv4 utility toolkit developed for use on Node.JS / IO.JS
 * 	network related projects 
 * 
 * ==============================================================
 * 
 * 	License: MIT (check attached file)
 * 	Author: undertuga[at]tutanota[dot]de
 * 	GitHub: https://github.com/undertuga/ipv4-tools
 * 
 * ==============================================================
 */






/* 
 * IPv4 Tools - Prototypes Holder 
 * ------------------------------
 */

IPv4Tools = function(){
	
	
};





/* PROTOTYPE ZONE */

/*
 * Generate IPv4
 * -------------------------------------------
 * Generates random IPv4 address according
 * to given class (A to E)! Random class
 * generation is possible passing R as class.
 * -------------------------------------------
 * 
 * @param {String} ipclass 
 * @param {Function} callback
 * @error {Boolean} false
 * @return {String} ipv4
 * 
 * -------------------------------------------
 */
 
IPv4Tools.prototype.generateIPv4 = function(ipclass, callback){
	
	// validating gathered ip class
	if(
		(typeof(ipclass) === 'undefined') ||
		(ipclass === null) ||
		(ipclass === '') ||
		(ipclass.length <= 0) ||
		(ipclass.length > 1)
	)
	{callback(null, false);}
	else{
		
		// declaring octet's (-1st) holder
		var octets = '.' + (Math.floor(Math.random() * 255) + 0) + '.' + (Math.floor(Math.random() * 255) + 0) + '.' + (Math.floor(Math.random() * 255) + 0);
		
		// matching ipv4 class
		switch(ipclass.toUpperCase()){
		
			// class A IPv4
			case 'A':
				var oc1 = Math.floor(Math.random() * 127) + 0;
				callback(null, oc1 + octets);
				break;
				
			// class B IPv4
			case 'B':
				var oc1 = Math.floor(Math.random() * 191) + 128;
				callback(null, oc1 + octets);
				break;
				
			// class C IPv4
			case 'C':
				var oc1 = Math.floor(Math.random() * 223) + 192;
				callback(null, oc1 + octets);
				break;
				
			// class D IPv4
			case 'D':
				var oc1 = Math.floor(Math.random() * 239) + 224;
				callback(null, oc1 + octets);
				break;
				
			// class E IPv4
			case 'E':
				var oc1 = Math.floor(Math.random() * 247) + 240;
				callback(null, oc1 + octets);
				break;
				
			// Random IPv4 class selection (fail safe bail out)
			case 'R':
			default:
				var oc1 = Math.floor(Math.random() * 247) + 0;
				callback(null, oc1 + octets);
				break;
		}
	}
};






/*
 * Validate IPv4
 * -----------------------------------------
 * Validates given Ipv4 Address
 * -----------------------------------------
 * 
 * @param {String} ipv4 
 * @param {Function} callback
 * @error {Boolean} false
 * @return {Boolean} state
 * 
 * -----------------------------------------
 */
 
IPv4Tools.prototype.validateIPv4 = function(ipv4, callback){
	
	// validating gathered data
	if(
		(typeof(ipv4) === 'undefined') ||
		(ipv4 === null) || (ipv4 === '') ||
		(ipv4.length <= 0) ||
		(ipv4.length > 16)
		
	){callback(null, false);}
	else{
		
		// check for valid ipv4 address
		ipv4.split('.').forEach(function(octect){
			
			if(
				(typeof(octect) === 'undefined') ||
				(octect === null) ||
				(octect === '') ||
				((octect < 0) ||
				(octect > 255))
				
			){callback(null, false);}
		});
		
		// return validation state
		callback(null, true);
	}
};





/*
 * Get IPv4 Class
 * -----------------------------------------
 * Get IPv4 address correpondent class
 * -----------------------------------------
 * 
 * @param {String} ipv4 
 * @param {Function} callback
 * @error {Boolean} false
 * @return {String} class
 * 
 * ------------------------------------------
 */
 
IPv4Tools.prototype.getNetworkClass = function(ipv4, callback){
	
	// validating gathered data
	if(
		(typeof(ipv4) === 'undefined') ||
		(ipv4 === null) ||
		(ipv4 === '') ||
		(ipv4.length <= 0) ||
		(ipv4.length > 16)
		
	){callback(null, false);}
	else{
		
		// explode gathered ipv4 address
		ipv4 = ipv4.split('.');
		
		/* ipv4 class match */
		if((ipv4 !== null) && (parseInt(ipv4[0].trim()) > 0) && (parseInt(ipv4[0].trim()) <= 127)){callback(null, {IPv4: ipv4, Class: 'A'}); return;} // class A ipv4
		if((ipv4 !== null) && (parseInt(ipv4[0].trim()) > 127) && (parseInt(ipv4[0].trim()) <= 191)){callback(null, {IPv4: ipv4, Class: 'B'}); return;} // class B ipv4
		if((ipv4 !== null) && (parseInt(ipv4[0].trim()) > 191) && (parseInt(ipv4[0].trim()) <=  223)){callback(null, {IPv4: ipv4, Class: 'C'}); return;} // class C ipv4
		if((ipv4 !== null) && (parseInt(ipv4[0].trim()) > 223) && (parseInt(ipv4[0].trim()) <= 239)){callback(null, {IPv4: ipv4, Class: 'D'}); return;} // class D ipv4
		if((ipv4 !== null) && (parseInt(ipv4[0].trim()) > 239) && (parseInt(ipv4[0].trim()) <= 247)){callback(null, {IPv4: ipv4, Class: 'E'}); return;} // class E ipv4
		if(ipv4 !== null){callback(null, false);} // fail safe bail out
	}
};









/*
 * Get IPv4 Network Data
 * -----------------------------------------
 * Get IPv4 network data:
 * - CIDR
 * - ASN
 * - ASN Peers
 * - ASN Label / Info
 * - Country
 * 
 * Currently using TeamCymru Service:
 * http://www.team-cymru.org/
 * -----------------------------------------
 * 
 * @param {String} ipv4 
 * @param {Function} callback
 * @error {Boolean} false
 * @return {Object} netdata
 * 
 * -----------------------------------------
 */
 
IPv4Tools.prototype.getNetworkData = function(ipv4, callback){
	
	// validating gathered data
	if((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4.length <= 0) || (ipv4.length > 16)){callback(null, false);}
	else{
		
		// requiring external libs
		var async = require('async'),
			dns = require('dns');
		
		// declaring required holders and references!
		var buffer = {ip: ipv4}, ip = ipv4.split(".");
	    var origin = ip[3] + '.' + ip[2] + '.' + ip[1] + '.' + ip[0] + '.origin.asn.cymru.com';
	    var peers = ip[3] + '.' + ip[2] + '.' + ip[1] + '.' + ip[0] + '.peer.asn.cymru.com';
	    var provider = buffer['asn'] + '.asn.cymru.com';
	    
	    
	    /*
	     * ASYNC WATERFALL SEQUENCE
	     * Sweeping Ipv4 data, step by step...
	     */
	    async.waterfall([
  
  
         /*	=============================
          * 	Gather main network data
          * =============================
          */
          
	        function(callback){
	            
	            // gather ip data...
	            dns.resolveTxt(origin, function(err, dnsresult){
	                
	                // fail safe bail out
	                if(err){return false;}
	       
	                // sweeping dns result
	                dnsresult.forEach(function(dnsres){
	                    
	                    // split & gather data
	                    var data = dnsres[0].split('|');
	                    buffer['cidr'] = data[1].trim();
	                    buffer['asn'] = data[0].trim();
	                    buffer['country'] = data[2].trim();
	                    
	                    // return asn to next step
	                    callback(null, buffer['asn']);
	                });
	            });
	        },
	        
	        
	        
	        
         /*	==========================
          * 	Gather asn peers
          * ==========================
          */
          
	        
	        function(asn, callback){
	        
	            // gather asn peers data
	            dns.resolveTxt(peers, function(err, dnsresult){
	                if(err){return;}
	                
	                // sweeping result
	                dnsresult.forEach(function(dnsres){
	                    
	                    // extracting data from dns result
	                    var data = dnsres[0].split('|');
	                    data = data[0].split(' ');
	                    data.pop();
	                    buffer['asnpeers'] = data;
	                    
	                    // return asn to next step
	                    callback(null, asn);
	                });
	            });  
	        },
	        
	        
	        
	        
	        
         /*	==========================
          * 	Gather provider data
          * ==========================
          */
          
	        
	        function(asn, callback){
	            
	            // gather asn / provider details
	            dns.resolveTxt('AS'+ asn + '.asn.cymru.com', function(err, dnsresult){
	                if(err){return;}
	                
	                // sweeping result
	                dnsresult.forEach(function(dnsres){
	                    
	                    // extracting data from dns result
	                    var data = dnsres[0].split('|');
	                    buffer['provider'] = data[4].trim();
	                    buffer['tstamp'] = new Date();
	                    
	                    // return async ops state
	                    callback(null, true);
	                });
	            });
	        }
	        
	        
	        
	    ], function(error, results){
	    	
	    		// fail safe bail out
	            if(error){return;}
	            
	            // validating result
	            if(!results){callback(null, false);}
	            else{callback(null, buffer);}
	        }
	    );
	}
};



/* 
 * Get IPv4 DNS related data
 * -----------------------------------------------------
 * Returns object with dns related data about given ipv4
 * -----------------------------------------------------
 * 
 * @param {String} ipv4 
 * @param {Function} callback
 * @error {Boolean} false
 * @return {Object} dnsdata
 * 
 * ------------------------------------------------------
 */
 
IPv4Tools.prototype.getDnsData = function(ipv4, callback){
	
	// validating gathered data
	if(((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === "") || (ipv4.length <= 0) || (ipv4.length > 16))){callback(null, false);}
	else{
		
		// declaring data holder and links to upper scope stuff
		var dnsdata = {}, 
			dcnt = 0, 
			async = require('async'), 
			dns = require('dns');;
		
		// reverse DNS querying about desired ipv4
		dns.reverse(ipv4, function(error, dnsrev){
			
			// fail safe bail out
			if(error){callback(null, false);}
			else{
				
				// checking gathered array size
				if(dnsrev.length <= 0){callback(null, false);}
				else{
					
					// sweeping gathered array
					async.eachSeries(dnsrev, function(domain, callback){
						
						dns.lookup(domain, function(error, address, family){
							
							// fail safe bail out
							if(error){callback(null, false);}
							else{
								
								// adding data to holder
								dnsdata[dcnt] = {'domain': domain, 'address': address};
								dcnt++;
								callback(null, true);
							}
						});
					}, function(error, endres){
						
						// fail safe bail out || return reverse dns data
						if(error){callback(null, false);}
						else{callback(null, dnsdata);}
					});
				}
			}
		});
	}
};







/*
 * IPv4 To Integer
 * ---------------------------------------------
 * Converts given ipv4 address to integer value 
 * ---------------------------------------------
 * 
 * @param {String} ipv4 
 * @param {Function} callback
 * @error {Boolean} false
 * @return {Integer} integerIPv4
 * 
 * ---------------------------------------------
 */


IPv4Tools.prototype.ipv4ToInteger = function(ipv4, callback){
	
	// validating gathered data
	if(
		(typeof(ipv4) === 'undefined') ||
		(ipv4 === null) ||
		(ipv4 === '') ||
		(ipv4.length <= 0) ||
		(ipv4.length > 16)
		
	){callback(null, false);}
	else{

		// spliting gathered ipv4
		var ipv4 = ipv4.toString().split('.');
		callback(null, ((((((+ipv4[0])*256)+(+ipv4[1]))*256)+(+ipv4[2]))*256)+(+ipv4[3])); // return merged octets calculation
	}
};






/*
 * Integer to IPv4
 * ---------------------------------------------
 * Converts given integer value to IPv4 address 
 * ---------------------------------------------
 * 
 * @param {Integer} integerIPv4
 * @param {Function} callback
 * @error {Boolean} false
 * @return {String} IPv4 address
 * 
 * ---------------------------------------------
 */
 
IPv4Tools.prototype.integerToIPv4 = function(number, callback){
	
	// validating gathered data (min & max ipv4 integer representations)
	if(
		(typeof(number) === 'undefined') ||
		(number === null) ||
		(number === '') ||
		(number <= 0) ||
		(number > 4294967295)
		
	){callback(null, false);}
	else{
		
		// reconstructing IPv4 from integer
		var base = number%256; // 1st split
		for(var x = 3; x > 0; x--){number = Math.floor(number/256); base = number%256 + '.' + base;} // sweeping remaining octets
		callback(null, base);
	}
};





// exporting IPv4 Tools prototypes
exports.IPv4Tools = IPv4Tools;
