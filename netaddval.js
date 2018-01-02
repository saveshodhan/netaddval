/**
* validates IP address (without mask)
*
* @param {String} ip - ip (only) address to validate, e.g.: 192.168.1.2
* @return {bool}
**/
function validateIPAddWithoutMask(ip){
    var r = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (ip.match(r)){
        return true;
    }
    else {
        return false;
    }
}


/**
* validates IP address (with mask)
* if array of allowed values for masks is passed, matches if the mask is aprt of allowed masks
*
* @param {String} ip   - ip address (in CIDR notation) to validate, e.g.: 192.168.1.2/30
* @param {Array} masks - (optional) array of allowed masks, e.g.: ['29', '30']
* @return {bool}
**/
function validateIPAddWithMask(ip, allowedMasks){
    var r = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/)(3[0-2]|2[0-9]|[01]?[0-9])$/;
    var result = ip.match(r);
    
    if (result){
        if (allowedMasks == undefined){    // masks are not passed, but result evaluated to true
            return true;
        }
        
        try{
            var inputMask = result[result.length-1];
        }
        catch(err){
            return false;
        }

        if (allowedMasks.split(',').indexOf(inputMask) == -1){ // mask is not part of the allowedMasks array
            return false;
        }
        return true;
    }
    else {
        return false;
    }
}


/**
* pad the binary number to eight bits
*
* @param {Number} num - binary number
* @return {Array} - array of eight elements
**/
function padToEight(num){
    return Array(8-num.length+1).join('0')+num;
}


/**
* checks if the IP address is the network address (the very first address) of its subnet:
*
* convert the IP address to binary, then gets the host bits out of it.
* the IP address is a network address if its host bits are all zero.
* and host bits are bits that remain after we have got rid of the network bits (which are the first <mask> number of bits)
* so, if the host bits are all zero, it means that this is the very first address
*
* @param {String} ip - ip address in CIDR notation, e.g.: 192.168.1.0/30
* @return {bool}
**/
function isNetworkAddress(ip){
    var ipOnly = ip.split('/')[0];
    var mask = ip.split('/')[1];
    var ipInBinary = "";

    if (parseInt(mask) == 32){  // if mask is 32, the address is a network address
        return true;
    }

    ipOnly.split('.').forEach(function(e,i,a){
        ipInBinary += padToEight(parseInt(e).toString(2));    // pad the binary number to eight bits
    });

    hostId = ipInBinary.substring(mask);    // take out the last <mask> number of bits - that's the hostid
    // console.log(ipOnly, mask, hostId);

    if (parseInt(hostId,2) == 0){   // the host bits should be all 0s in case of network address
        return true;
    }
    else{
        return false;
    }
}
