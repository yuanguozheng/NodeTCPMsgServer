/**
 * Created by 国正 on 2014/12/5 0005.
 */
var clients = [];

var net = require('net');

net.createServer(function (socket) {
    socket.setEncoding('utf8');
    console.log('Conntected ' + socket.remoteAddress + ':' + socket.remotePort);
    socket.on('data', function (data) {
        var obj = JSON.parse(data);
        if (obj.Operation === 'login') {
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].From == 0 && clients[i].User == obj.User) {
                    socket.write('onlined');
                    return;
                }
            }
            var socketInfo = {User: obj.User, From: null, Socket: null};
            if (obj.From == 0) {
                socketInfo.From = 0;
                console.log("Phone User: " + obj.User + " Login.");
            }
            if (obj.From == 1) {
                socketInfo.From = 1;
                console.log("Desktop User: " + obj.User + " Login.");
            }
            socketInfo.Socket = socket;
            clients.push(socketInfo);
            socket.write('ok');
            return;
        }
        else if (obj.Operation === 'do') {
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].User === obj.User && clients[i].From == 1) {
                    clients[i].Socket.write(obj.Msg);
                    console.log("User: " + obj.User + " Send: " + obj.Msg + " To Desktop.");
                    return;
                }
            }
        }
    });

    socket.on('error', function (err) {
        console.log("Error:", err.message);
    });

    socket.on('close', function () {
        console.log('Connection is closed.');
        var index = clients.indexOf(socket);
        clients.splice(index, 1);
    });
}).listen(9001);