//https://github.com/phoboslab/jsmpeg/blob/master/stream-server.js
var fs = require('fs');

if ( process.argv.length < 2 ) {
	console.log(
		'Usage: \n' +
		'node stream-server.js [ <secret> <stream-port> <websocket-port>]'
	);
	process.exit();
}

//var file_path = 'test/test_json_stream_data.json'
var file_path = 'test/test_data.csv';
var file_stream = fs.createReadStream(file_path, {flags: 'r', encoding: 'utf-8'});
var buf = '';

function pump() {
		var pos;

		while ((pos = buf.indexOf('\n')) >= 0) { // keep going while there's a newline somewhere in the buffer
console.log(pos)
console.log(buf)
				if (pos == 0) { // if there's more than one newline in a row, the buffer will now start with a newline
						buf = buf.slice(1); // discard it
						continue; // so that the next iteration will start with data
				}
				process_line(buf.slice(0,pos)); // hand off the line
				buf = buf.slice(pos+1); // and slice the processed data off the buffer
		}
}

function process_line(line) { // here's where we do something with a line

		if (line[line.length-1] == '\r') line=line.substr(0,line.length-1); // discard CR (0x0D)

		if (line.length > 0) { // ignore empty lines
				//send_data(line)
				setInterval(function () { send_data(line) }, 2000);
				//var obj = JSON.parse(line); // parse the JSON
				console.log('Sent line data to client');
		}
}


var WEBSOCKET_PORT = process.argv[4] || 8084,
    width = 320,
	  height = 240;

// Websocket Server
var socketServer = new(require('ws').Server)({port: WEBSOCKET_PORT});
socketServer.on('connection', function(socket) {
	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );

	file_stream.on('data', function(d) {
			buf += d.toString(); // when data is read, stash it in a string buffer
			pump(); // then process the buffer
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
