var express = require("express"),
	app = express(app),
	server = require("http").createServer(app);


app.use(express.static(__dirname));

/*var EurecaServer = require("eureca.io").EurecaServer;

var eurecaServer = new EurecaServer({allow:['setId', 'spawnEnemy', 'kill', 'updateState']});
var clients = {};

eurecaServer.attach(server);*/

server.listen(9090);

/*eurecaServer.onConnect(function (conn){
	console.log("New client id=%s ", conn.id, conn.remoteAddress);
	//the getClient method provide a proxy allowing us to call remote client functions
    var remote = eurecaServer.getClient(conn.id);    
	
	//register the client
	clients[conn.id] = {id:conn.id, remote:remote}
	
	//here we call setId (defined in the client side)
	remote.setId(conn.id);	
});

eurecaServer.onDisconnect(function(conn){
	console.log("Client DC ", conn.id);

	var removeId = clients[conn.id].id;
	
	delete clients[conn.id];
	
	for (var c in clients)
	{
		var remote = clients[c].remote;
		
		//here we call kill() method defined in the client side
		remote.kill(conn.id);
	}	
});

eurecaServer.exports.handshake = function()
{
	//var conn = this.connection;
	for (var c in clients)
	{
		var remote = clients[c].remote;
		for (var cc in clients)
		{		
			var x = clients[cc].laststate ? clients[cc].laststate.x:  0;
			var y = clients[cc].laststate ? clients[cc].laststate.y:  0;
			remote.spawnPlayer(clients[cc].id, 0, 0);		
		}
	}
}

eurecaServer.exports.handleKeys = function (keys) {
	var conn = this.connection;
	var updatedClient = clients[conn.id];
	
	for (var c in clients)
	{
		var remote = clients[c].remote;
		remote.updateState(updatedClient.id, keys);
		
		//keep last known state so we can send it to new connected clients
		clients[c].laststate = keys;
	}
}*/