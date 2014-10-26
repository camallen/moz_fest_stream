//https://github.com/phoboslab/jsmpeg/blob/master/stream-server.js
var fs = require('fs'),
    lineByLine = require('./lib/line-by-line');

if ( process.argv.length < 2 ) {
	console.log(
		'Usage: \n' +
		'node stream-server.js [ <secret> <stream-port> <websocket-port>]'
	);
	process.exit();
}


//var file_path = 'test/test_json_stream_data.json'
//var file_path = 'test/test_data.csv';
var file_path = 'data/zoo2MainSpecz.csv',
    headers = "",
		counter = 0;

var WEBSOCKET_PORT = process.argv[4] || 8084,
    WEBSOCKET_HEADER_PORT = WEBSOCKET_PORT + 1,
    width = 320,
	  height = 240;

// Websocket Data Server
var socketServer = new(require('ws').Server)({port: WEBSOCKET_PORT});
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

function send_data(message) {
	if (headers != "") {
		formatted_message = '{'
		var data = message.split(',');
		if (data.length != headers.length) {
			console.log("data and headers length disagree!");
		}
		for (var i = 0; i < headers.length; i++) {
			formatted_message += '\'' + headers[i] + '\':\'' + data[i] + '\',';
		}
		socketServer.broadcast(formatted_message + '}');
	}
}

console.log('Awaiting WebSocket connections on ws://0.0.0.1:'+WEBSOCKET_PORT+'/');


lineByLine(file_path, 500, function(line) {
  console.log('Source input file line number: '+ counter)
  if (counter == 0) {
    counter +=1
    headers = line.split(',');
    //console.log(headers);
  }
  else {
    counter +=1
    send_data(line)
  }
});
