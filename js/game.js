var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('dude', 'assets/player_1_front.png', 32, 48);
    game.load.image('earth', 'assets/scorched_earth.png');

}

var player;
//var facing = 'left';
var myID=0;
var avatar;
var cursors;
var jumpButton;
var bg;

Player = function(index, game, player){
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

    this.avatar = game.add.sprite(0, 600, 'dude');
    var jumping = false;
    game.physics.enable(this.avatar, Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 250;
    this.avatar.body.collideWorldBounds = true;
};

Player.prototype.update = function(){
    for(var i in this.input) this.cursor[i] = this.input[i];

    this.avatar.body.velocity.x = 0;
    this.avatar.body.velocity.y = 0;
    this.avatar.body.bounce.y = 0.2;
    if(this.cursor.left){
        this.avatar.body.velocity.x = -250;
    }
    else if(this.cursor.right){
        this.avatar.body.velocity.x = 250;
    }
    if(this.cursor.up && this.avatar.body.onFloor()){
        this.avatar.body.velocity.y = -250;
    }
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    bg = game.add.tileSprite(0, 0, 800, 600, 'earth');

    //game.physics.arcade.gravity.y = 250;

    playerList = {};
    //player = game.add.sprite(32, 32, 'dude');
    player = new Player(myID, game, avatar);
    playerList[myID] = player;
    pImage = player.avatar;
    //game.physics.enable(player, Phaser.Physics.ARCADE);

    //player.body.bounce.y = 0.2;
    //player.body.collideWorldBounds = true;
    //player.body.setSize(20, 32, 5, 16);

    //player.animations.add('left', [0, 1, 2, 3], 10, true);
    //player.animations.add('turn', [4], 20, true);
    //player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

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
    /*if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        /*if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        /*if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }*/

}

function render () {

    game.debug.text(game.time.suggestedFps, 32, 32);

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}