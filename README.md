moz_fest_stream
===============

Classifications stream server to stream zooniverse classification events over a websocket connection.

Installation
------------
1. Clone this repo
  + git clone https://github.com/camallen/moz_fest_stream
2. Install node
  + see node documentation
3. Install websocket for node
  + npm install ws
4. Install the static content server
  + npm install connect serve-static

Getting Started
----------------
1. start the server
  + node stream_server.js
2. start the client
  + node static_server.js
3. connect to the client in your web browser
  + http://localhost:8080
