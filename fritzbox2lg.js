console.log("Starting");

// Initialize LG 
var lgtv = require("lgtv2")({
    url: "ws://LGwebOSTV.fritz.box:3000",
    timeout: 1000
});

lgtv.on('error', function(err){
    console.log(err);
});

lgtv.on('connect', function () {
    console.log('connected');
    sendMessage2TV('fritzbox2lg: Verbindung hergestellt');
});

function sendMessage2TV(message){
    lgtv.request('ssap://system.notifications/createToast', {message: message});
}

function germanType(type){
    var retval = `Unknown type ${type}`
    switch(type){
        case 'inbound':
            retval = 'Eingehender';
            break;
        case 'outbound':
            retval = 'Ausgehender';
            break;     
    } 
    return retval;
}

// Initialize FritzBox
var CallMonitor = require('node-fritzbox-callmonitor');

var monitor = new CallMonitor('192.168.178.1', 1012);

monitor.on('inbound', function (data) {
    console.log('- inbound');
    console.log(data);
    sendMessage2TV(`Eingehender Anruf von ${data.caller}`);
  });
  
monitor.on('outbound', function (data) {
    console.log('- outbound');
    console.log(data);
    sendMessage2TV(`Ausgehender Anruf an ${data.called}`);
});

monitor.on('connected', function (data) {
    console.log('- connected');
    console.log(data);
    sendMessage2TV(`Anruf an ${data.called} von ${data.caller} angenommen`);
});

monitor.on('disconnected', function (data) {
    console.log('- disconnected');
    console.log(data);

    sendMessage2TV(`${germanType(data.type)} Anruf an ${data.called} von ${data.caller} beendet nach ${data.duration} Sekunden`);
});

monitor.on('error', function (error) {
    console.log(error);
});

