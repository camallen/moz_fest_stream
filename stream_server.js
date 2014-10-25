//https://github.com/phoboslab/jsmpeg/blob/master/stream-server.js
var fs = require('fs'),
    byline = require('byline');;

if ( process.argv.length < 2 ) {
	console.log(
		'Usage: \n' +
		'node stream-server.js [ <secret> <stream-port> <websocket-port>]'
	);
	process.exit();
}


//var file_path = 'test/test_json_stream_data.json'
var file_path = 'test/test_data.csv';
var file_line_stream = byline(fs.createReadStream(file_path, { encoding: 'utf8' }));

var WEBSOCKET_PORT = process.argv[4] || 8084,
    width = 320,
	  height = 240;

// Websocket Server
var socketServer = new(require('ws').Server)({port: WEBSOCKET_PORT});
socketServer.on('connection', function(socket) {
	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );

	file_line_stream.on('data', function(file_line) {
		console.log("line:" + file_line);
		setTimeout(function () { send_data(file_line) }, 10000)
	});
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

function send_data(message) {
  socketServer.broadcast(message);
}

console.log('Awaiting WebSocket connections on ws://0.0.0.1:'+WEBSOCKET_PORT+'/');
