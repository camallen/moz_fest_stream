//https://github.com/phoboslab/jsmpeg/blob/master/stream-server.js
if( process.argv.length < 3 ) {
	console.log(
		'Usage: \n' +
		'node stream-server.js <secret> [<stream-port> <websocket-port>]'
	);
	process.exit();
}

var WEBSOCKET_PORT = process.argv[4] || 8084,
    width = 320,
	  height = 240;

// Websocket Server
var socketServer = new (require('ws').Server)({port: WEBSOCKET_PORT});
socketServer.on('connection', function(socket) {
	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );
	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
	});
});

socketServer.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		if (this.clients[i].readyState == 1) {
			this.clients[i].send(data, opts);
		}
		else {
			console.log( 'Error: Client ('+i+') not connected.' );
		}
	}
};

console.log('Awaiting WebSocket connections on ws://0.0.0.1:'+WEBSOCKET_PORT+'/');

function send_data(message) {
	socketServer.broadcast(message);
}

//TODO: iterate over the JSON file and stream the classifications 1 at a time..
var test_message = "test data"

setInterval(function () { send_data(test_message) }, 1000);
