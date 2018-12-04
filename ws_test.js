const WebSocket = require('ws');

// const ws = new WebSocket('wss://echo.websocket.org/', {
//     origin: 'https://websocket.org'
// });

const ws = new WebSocket.Server({port: 8080});

// ws.on('open', function open() {
//     console.log('connected');
//     ws.send(Date.now());
// });

ws.on('close', function close() {
    console.log('disconnected');
});

// ws.on('message', function incoming(data) {
//     console.log(`message: ${data}`);
//     // setTimeout(function timeout() {
//     //     ws.send(Date.now());
//     // }, 500);
//
// });

ws.on('connection', function connection(conn) {
    console.log("connection come")
    conn.on('message', function incoming(data) {
        console.log("Broadcast:")
        // Broadcast to everyone else.
        ws.clients.forEach(function each(client) {
            // if (client !== ws && client.readyState === WebSocket.OPEN) {
            //     client.send(data);
            //     console.log("send:", data)
            // }
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
                console.log("send:", data)
            }
        });
    });
});


/**

 ws = new WebSocket("ws://127.0.0.1:8080/")

 ws.onopen = function(event) {
    console.log("WebSocket is open now.");
    // timeout = function(){
    //     data = Date.now()
    //     ws.send(data);
    //     console.log(`send message: ${data}`);
    // }
    // setInterval(timeout, 2000);
 };

 ws.onclose = function(event) {
  console.log("WebSocket is closed now.");
 };

 ws.onmessage = function(event) {
  console.log("WebSocket message received:", event.data);
 };



 **/