
//var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, render: render });
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'canvas', { preload: preload, create: create, update: update});//, update: update, render: render });

function preload() {

    game.load.image('bme', 'static/images/bme.jpg');
    game.load.image('cazok', 'static/images/cazok.png');

    game.load.image('dick1', 'static/images/happy.png');
    game.load.image('dick2', 'static/images/white_long.png');
    game.load.image('dick3', 'static/images/black1.png');
    game.load.image('dick4', 'static/images/black_long.png');

    //sounds
    game.load.audio('gameover', 'static/sounds/gameover.wav');
    game.load.audio('eat', 'static/sounds/eat.wav');
    game.load.audio('bonus', 'static/sounds/bonus.wav');
    game.load.audio('shrink', 'static/sounds/shrink.wav');
    game.load.audio('shrink', 'static/sounds/shrink.wav');
    game.load.audio('bgmusic', 'static/sounds/bgmusic.mp3');
}

var canvas_width_max = 1920;
var canvas_height_max = 1080;

var canvas_width = window.innerWidth * window.devicePixelRatio;
var canvas_height = window.innerHeight * window.devicePixelRatio;
var aspect_ratio = canvas_width / canvas_height;
if (aspect_ratio > 1) scaleRatio = canvas_height / canvas_height_max;
else scaleRatio = canvas_width / canvas_width_max;
//scaling options

var gamePaused = false;
var bigZac = false;

var random_time = 1;
var score = 0;

function create() {
    //Sound effects
    gameover = game.add.audio('gameover');
    eat = game.add.audio('eat');
    bonus = game.add.audio('bonus');
    shrink = game.add.audio('shrink');
    bgmusic = game.add.audio('bgmusic');

    bgmusic.loopFull();
    
    //Scale options
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    //screen size will be set automatically
    game.scale.setScreenSize = true;

    game.stage.backgroundColor = '#fff';

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.setBoundsToWorld();

    dicks1 = game.add.group();
    dicks1.enableBody = true;
    dicks1.physicsBodyType = Phaser.Physics.ARCADE;

    dicks1.createMultiple(20, 'dick1');


    dicks2 = game.add.group();
    dicks2.enableBody = true;
    dicks2.physicsBodyType = Phaser.Physics.ARCADE;

    dicks2.createMultiple(20, 'dick2');


    dicks3 = game.add.group();
    dicks3.enableBody = true;
    dicks3.physicsBodyType = Phaser.Physics.ARCADE;

    dicks3.createMultiple(20, 'dick3');


    dicks4 = game.add.group();
    dicks4.enableBody = true;
    dicks4.physicsBodyType = Phaser.Physics.ARCADE;

    dicks4.createMultiple(20, 'dick4');


    bme = game.add.sprite(game.world.centerX, game.world.centerY, 'bme');
    bme.scale.setTo(scaleRatio/2, scaleRatio/2);
    bme.reset(game.width/2, bme.height/2);
    bme.anchor.set(0.5);


    cazok = game.add.sprite(game.world.centerX, game.world.centerY, 'cazok');
    cazok.scale.setTo(scaleRatio*2, scaleRatio*2);
    cazok.reset(game.width/2 - cazok.width/2, game.height - cazok.height);

    game.physics.enable(cazok, Phaser.Physics.ARCADE);
    cazok.body.allowRotation = false;
    cazok.scale.setTo(scaleRatio*2, scaleRatio*2);
    cazok.body.allowGravity = false;

    //  Set the world (global) gravity
    game.physics.arcade.gravity.y = 10;

    
    cazok.inputEnabled = true;
    cazok.input.enableDrag(true);
    cazok.input.setDragLock(true, false);

    //Spawn enemies
    spawner = game.time.events.loop(Phaser.Timer.SECOND * random_time, spawnEnemy, this);


    //  The score
    scoreString = 'Zh-k : ';
    scoreText = game.add.text(10, game.world.centerY, scoreString + score, { font: '34px Arial', fill: '#000' });

    //Status text in the middle
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '64px Arial', fill: '#000' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;


}
function update() {

    //  Run collision

    game.physics.arcade.overlap(dicks1, cazok, cazokDicksCollide, null, this);
    game.physics.arcade.overlap(dicks2, cazok, cazokDicksCollide, null, this);
    game.physics.arcade.overlap(dicks3, cazok, cazokDicksCollide, null, this);
    game.physics.arcade.overlap(dicks4, cazok, cazokDicksCollide, null, this);
}


function spawnEnemy(){
   var dick_num = game.rnd.integerInRange(1, 4);
   random_time = game.rnd.integerInRange(0, 2) + game.rnd.frac();
    switch(dick_num){
        case 1:
            if(dicks1.countDead() > 0){
                var rou = dicks1.getFirstDead();}
        break;
        case 2:
            if(dicks2.countDead() > 0){
                var rou = dicks2.getFirstDead();}
        break;
        case 3:
            if(dicks3.countDead() > 0){
                var rou = dicks3.getFirstDead();}
        break;
        case 4:
            if(dicks4.countDead() > 0){
                var rou = dicks4.getFirstDead();}
        break;
    }
        rou.rotation = game.physics.arcade.angleBetween(rou, cazok);
        rou.body.setSize(rou.width*0.8, rou.height*0.8, 0, 0);

        [x,y] = calcRandomPosition()
        rou.reset(x, y);
        rou.scale.setTo(scaleRatio, scaleRatio);

        //var randomSpeed = game.rnd.integerInRange(2,4);

        rou.body.enable = true;
        rou.body.allowRotation = false;
        rou.rotation = 1.5;
        rou.body.collideWorldBounds = false;
        rou.body.bounce.y = 0;
        rou.body.gravity.y = 200;

        rou.checkWorldBounds = true;
        rou.events.onOutOfBounds.add(dickNotCaught, this);

        if(gamePaused){rou.visible = false;}

}

function calcRandomPosition(){
    var x = game.rnd.integerInRange(game.world.centerX - bme.width/2, game.world.centerX + bme.width/2);
    var y = game.rnd.integerInRange(1, bme.height/2);
    return [x,y];
}


function dickNotCaught (dick) {
    if(bigZac)
    {
        shrink.play();
        bigZac = false;

        //Growing cazok
        cazok.scale.setTo(scaleRatio*2, scaleRatio*2);
        // cazok.body.scale.setTo(scaleRatio*2, scaleRatio*2);
        cazok.reset(cazok.position.x, game.height - cazok.height);
    }
    else
    {
        gamePaused = true;
        bgmusic.stop();
        gameover.play();

        cazok.kill();
        dicks1.callAll('kill');
        dicks2.callAll('kill');
        dicks3.callAll('kill');
        dicks4.callAll('kill');

        stateText.text="          GAME OVER \n Nem szoptál még eleget!";
        stateText.visible = true;
        scoreText.visible = false;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }
}

function restart () {

    //revives the player
    cazok.revive();
    //hides the text
    stateText.visible = false;
    score = 0;
    scoreText.text = scoreString + score;

    scoreText.visible = true;

    gamePaused = false;

    bgmusic.loopFull();
    
 }

function cazokDicksCollide (cazok, dick) {
    console.log(dick.key);
    if (dick.key == 'dick3' && !bigZac){
        bonus.play();
        bigZac = true;

        //Growing cazok
        cazok.scale.setTo(scaleRatio*3, scaleRatio*3);
        // cazok.body.scale.setTo(scaleRatio*3, scaleRatio*3);
        cazok.reset(cazok.position.x, game.height - cazok.height);
    }

    dick.kill();
    eat.play();

    //  Increase the score
    score += 1;
    scoreText.text = scoreString + score;
}