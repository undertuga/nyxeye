/*
 * 
 * NIXEYE Crypt Core
 * ========= (alpha) 
 * 
 */
 
 
/* including external dependencies */ 
var crypto = require('crypto');
 
 
 
 
/* declaring prototypes holder */
CryptCore = function(){};





/* Random Password Generation Prototype */
CryptCore.prototype.genRand = function(size, callback){
	
	// validating gathered data
	if((size < 0) || (size > 128)){callback(null, false);}
	else{
		
		// checking for free size pwd
		if(size === 0){
			
			// generating free key
			callback(null, crypto.createHash('sha512').update(new Date().toString()).digest('hex').toString());
		}
		else{
			
			// generating sized pwd
			var raw = crypto.createHash('sha512').update(new Date().toString()).digest('hex');
			callback(null, raw.toString().substr(raw.length-size));
		}
	}
};







/* Data Encryption Prototype */
CryptCore.prototype.cryptData = function(key, data, callback){
	
	// validating gathered data
	if(
		((typeof(key) === 'undefined') || (key === null) || (key.length <= 0)) ||
		((typeof(data) === 'undefined') || (data === null) || (data.length <= 0))
		
	){callback(null, false);}
	else{
		
		// encrypting data
		var cph = crypto.createCipher('aes-256-ctr', key);
		var crp = cph.update(data, 'utf8', 'hex');
		crp += cph.final('hex');
		
		// return encrypted data
		callback(null, crp);
	}
};







/* Data Decryption Prototype */
CryptCore.prototype.decryptData = function(key, data, callback){
	
	// validating gathered data
	if(
		((typeof(key) === 'undefined') || (key === null) || (key.length <= 0)) ||
		((typeof(data) === 'undefined') || (data === null) || (data.length <= 0))
		
	){callback(null, false);}
	else{
		
		// decrypting data
		var dph = crypto.createDecipher('aes-256-ctr', key);
		var dcp = dph.update(data,'hex','utf8');
		dcp += dph.final('utf8');
		
		// return decrypted data
		callback(null, dcp);
	}
};





/* Exporting prototypes */
exports.CryptCore = CryptCore;
