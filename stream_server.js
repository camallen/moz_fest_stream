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
//var file_path = 'test/test_data.csv';
var file_path = 'data/zoo2MainSpecz.csv';
var file_line_stream = byline(fs.createReadStream(file_path, { encoding: 'utf8' })),
    counter = 0,
		headers = "";

var WEBSOCKET_PORT = process.argv[4] || 8084,
    WEBSOCKET_HEADER_PORT = WEBSOCKET_PORT + 1,
    width = 320,
	  height = 240;

// Websocket Data Server
var socketServer = new(require('ws').Server)({port: WEBSOCKET_PORT});
socketServer.on('connection', function(socket) {
	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );

	file_line_stream.on('data', function(file_line) {
		if (counter == 0) {
			counter +=1
			headers = file_line;
			console.log(headers);
		}
		else {
			counter +=1
			//console.log("line:" + file_line);
			setTimeout(function () { send_data(file_line) }, counter * 1000)
		}
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
	//TODO: format the data as a json string with '{ 'header' : 'data' } '
	//message_to_array_of_values
	//headers to array of values
	
  socketServer.broadcast(message);
}

console.log('Awaiting WebSocket connections on ws://0.0.0.1:'+WEBSOCKET_PORT+'/');
