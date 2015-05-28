//Written by Romain Cerovic

var express = require("express"),
	app = express(app),
	server = require("http").createServer(app),
	gameServer = {games: {}, gameCount:0},
	UUID = require("node-uuid");

app.use(express.static(__dirname));

var Eureca = require("eureca.io");

var eurecaServer = new Eureca.Server({allow:["setID","createG", "createPlayer","destroyPlayer", "updateState"]});
var clients = {};

eurecaServer.attach(server);

eurecaServer.onConnect(function(player){
	console.log("New client id=%s ", player.id, player.remoteAddress);

	var remote = eurecaServer.getClient(player.id);

	clients[player.id] = {id: player.id, remote:remote};

	remote.setID(player.id);

	console.log(remote);
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

eurecaServer.exports.findGame = function(player) {
	if(this.gameCount){
		var joiningGame = false;
		for(var gameId in this.games){
			if(!this.games.hasOwnProperty(gameId)) continue;

			var gameInstance = this.games[gameId];
			if(gameInstance.playerCount < 2){
				joiningGame = true;
				this.joinGame(player);
			}
		}
		if(!joiningGame){
			this.createGame(player);
		}
	}
	else { 
		console.log("Attempt to create the first game.");
		this.createGame(player);
	}
}

eurecaServer.createGame = function(player){
	var gameCreated = {
		id : UUID(),
		hostingClient:player,
		secondClient:null,
		playerCount:1
	};
	this.games[gameCreated.id] = gameCreated;

	this.gameCount++;
	for(var c in clients){
		var remote = clients[c].remote;
		remote.createG(gameCreated);	
	}
	return gameCreated;
}

eurecaServer.joinGame = function(player){
	if(games){
		this.games[secondClient] = player;
	}
}

server.listen(9090);

