/**
 * Created by 国正 on 2014/12/5 0005.
 */
var clients = [];

var net = require('net');

net.createServer(function (socket) {
    socket.setEncoding('utf8');
    console.log('Conntected ' + socket.remoteAddress + ':' + socket.remotePort);
    socket.on('data', function (data) {
        console.log(data);
        var obj;
        try {
            obj = JSON.parse(data);
        }
        catch (e) {
            return;
        }
        if (obj.Operation === 'login') {

            var socketInfo = {User: obj.User, Socket: null};

            if (obj.From == 1) {
                socketInfo.From = 1;
                socketInfo.Socket = socket;
                console.log("Desktop User: " + obj.User + " Login.");
            }
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
            socket.write('No desktop online!');
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