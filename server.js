var express = require("express"),
	app = express(app),
	server = require("http").createServer(app);


app.use(express.static(__dirname));

var Eureca = require("eureca.io");

var eurecaServer = new Eureca.Server({allow:["setID", "createPlayer","destroyPlayer", "updateState"]});
var clients = {};

eurecaServer.attach(server);

eurecaServer.onConnect(function(player){
	console.log("New client id=%s ", player.id, player.remoteAddress);

	var remote = eurecaServer.getClient(player.id);

	clients[player.id] = {id: player.id, remote:remote};

	remote.setID(player.id);
});

eurecaServer.onDisconnect(function(player){
	console.log("Client disconnected ", player.id);

	var removeID = clients[player.id].id;

	delete clients[player.id];

	for (var c in clients) {
		var remote = clients[c].remote;

		remote.destroyPlayer(player.id);
	}
});

eurecaServer.exports.handleKeys = function(keys) {
	var con = this.connection;
	var clientToUpdate = clients[con.id];

	for(var c in clients){
		var remote = clients[c].remote;
		remote.updateState(clientToUpdate.id, keys);

		clients[c].lastState = keys;
	}
}

eurecaServer.exports.handshake = function() {
	for(var c in clients){
		var remote = clients[c].remote;
		for(var cc in clients){
			var x = clients[cc].lastState ? clients[cc].lastState.x: 0;
			var y = clients[cc].lastState ? clients[cc].lastState.y: 0;
			remote.createPlayer(clients[cc].id);
		}
	}
}

server.listen(9090);

