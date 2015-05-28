console.log("Will I print?");

var player;
//var facing = 'left';
var myID=0;
var alien;
var cursors;
var jumpButton;
var bg;
var gamesFServ = {};

var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
    //create an instance of eureca.io client
    var eurecaClient = new Eureca.Client();
    
    gamesFServ.push(eurecaServer.getGames());

    eurecaClient.ready(function (proxy) {       
        eurecaServer = proxy;
    });

    eurecaClient.exports.setID = function(id){
        myID = id;
        //create();
        eurecaServer.findGame();
        eurecaServer.handshake();
        ready = true;
    }

    eurecaClient.exports.createG = function(player, gameID){
        var gameCreated = {
            id : gameID,
            hostingClient:player,
            secondClient:null,
            playerCount:1
        };
        this.gamesFServ[gameCreated.id] = gameCreated;

        this.gameCount ++;

        create();
    }

    eurecaClient.exports.joinGame = function(player){
        if(eurecaServer.games){
            eurecaServer.games[secondClient] = player;
        }
    }

    eurecaClient.exports.createPlayer = function(i){
        if(i == myID) return;

        var playa = new Player(i, game, alien, createID);
        playerList[i] = playa;
    }

    eurecaClient.exports.destroyPlayer = function(id){
        if(playerList[id]){
            playerList[id].kill();
            console.log("Killing player ", id, playerList[id]);
        }
    }

    eurecaClient.exports.updateState = function(id, state){
        if(playerList[id]) {
            playerList[id].cursor = state;
            playerList[id].alien.x = state.x;
            playerList[id].alien.y = state.y;
            playerList[id].update();
        }
    }
}

Player = function(index, game, player, pSide){
    this.cursor = {
        left:false,
        right:false,
        up:false,
        fire:false      
    }

    this.input = {
        left:false,
        right:false,
        up:false,
        fire:false
    }
    //this.alien = game.add.sprite(0, 600, 'dude');
    if(pSide == 1){
        this.alien = game.add.sprite(0, 600, 'dude');
    }
    else if(pSide == 2){
        this.alien = game.add.sprite(0, 600, 'bro');
    }
    var jumping = false;
    var x = 0;
    var y = 0;
    game.physics.enable(this.alien, Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 250;
    this.alien.body.collideWorldBounds = true;
};

Player.prototype.update = function(){
    var inputChanged = (this.cursor.left != this.input.left ||
                        this.cursor.right!= this.input.right ||
                        this.cursor.up != this.input.up);
    if(inputChanged){
        if(this.alien.id = myID) {
            this.input.x = this.alien.x;
            this.input.y = this.alien.y;

            eurecaServer.handleKeys(this.input);
        }
    }

    this.alien.body.velocity.x = 0;
    if(this.cursor.left){
        this.alien.body.velocity.x = -250;
    }
    else if(this.cursor.right){
        this.alien.body.velocity.x = 250;
    }
    if(this.cursor.up && this.alien.body.onFloor()){
        this.alien.body.velocity.y = -250;
    }
}
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: eurecaClientSetup, update: update, render: render });

function preload() {

    game.load.image('dude', 'assets/player_1_front.png', 32, 48);
    game.load.image('bro', 'assets/player_1_side.png', 32, 48);
    game.load.image('earth', 'assets/background.png');
    console.log("Loaded the assets.");
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    bg = game.add.tileSprite(0, 0, 800, 600, 'earth');

    //game.physics.arcade.gravity.y = 250;

    playerList = {};
    //player = game.add.sprite(32, 32, 'dude');
    player = new Player(myID, game, alien,createID);
    playerList[myID] = player;
    pImage = player.alien;

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    if(!ready) return;

    // game.physics.arcade.collide(player, layer);
    player.input.left = cursors.left.isDown;
    player.input.right = cursors.right.isDown;
    player.input.up = jumpButton.isDown;
    //player.body.velocity.x = 0;
    if(cursors.left.isDown){
        console.log("tried to handled input.");
    }
    if(jumpButton.isDown){
        console.log("jumpiiiiiiiiiiiing.");
    }
    for(var i in playerList){
        if(!playerList[i]) continue;
        playerList[i].update();
    }
}

function render () {

    game.debug.text(game.time.suggestedFps, 32, 32);

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);
}
