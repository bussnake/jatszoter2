//var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'canvasholder', { preload: preload, create: create, update: update, render: render });



function preload() {

    game.load.image('cazok', 'static/images/cazok.png');
    game.load.image('bullet', 'static/images/projectile.png');
    game.load.image('vomiting', 'static/images/vomiting.png');

    game.load.image('rou', 'static/images/rou.png');
    game.load.image('kaboom', 'static/images/kaboom.png');
    game.load.image("background", 'static/images/background.png' );
}

var cazok;
var bullets;
var rous;

var score = 0;

var fireRate = 100;
var nextFire = 0;

var canvas_width_max = 1920;
var canvas_height_max = 1080;

var canvas_width = window.innerWidth * window.devicePixelRatio;
var canvas_height = window.innerHeight * window.devicePixelRatio;
var aspect_ratio = canvas_width / canvas_height;
if (aspect_ratio > 1) scaleRatio = canvas_height / canvas_height_max;
else scaleRatio = canvas_width / canvas_width_max;

scaleRatio = scaleRatio * 2;

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //game.stage.backgroundColor = '#ffffff';
    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    //bullets.scale.setTo(scaleRatio, scaleRatio);

    rous = game.add.group();
    rous.enableBody = true;
    rous.physicsBodyType = Phaser.Physics.ARCADE;

    rous.createMultiple(50, 'rou');
    rous.setAll('checkWorldBounds', true);
    rous.setAll('outOfBoundsKill', true);

    explosions = game.add.group();
    explosions.createMultiple(50, 'kaboom');
    //explosions.forEach(addAnimation, this);


    cazok = game.add.sprite(game.world.centerX, game.world.centerY, 'cazok');
    cazok.anchor.set(0.5);

    game.physics.enable(cazok, Phaser.Physics.ARCADE);
    cazok.body.setSize(cazok.width*0.5, cazok.height*0.5, 0, 0);

    cazok.body.allowRotation = false;

    cazok.scale.setTo(scaleRatio, scaleRatio);
    


    game.input.onDown.add(vomitingTexture, this);
    game.input.onUp.add(cazokTexture, this);

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    // Spawning enemies
    //window.spawnRous = game.time.events.loop(Phaser.Timer.SECOND, spawnEnemy, this);
    addspawner()
    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    

}

function addAnimation (rou) {
    rou.animations.add('kaboom');
}

function spawnEnemy(){
    if(rous.countDead() > 0){
        var rou = rous.getFirstDead();
        rou.rotation = game.physics.arcade.angleBetween(rou, cazok);
        rou.body.setSize(rou.width*0.8, rou.height*0.8, 0, 0);

        [x,y] = calcRandomPosition()
        rou.reset(x, y);
        rou.scale.setTo(scaleRatio, scaleRatio);

        var randomSpeed = game.rnd.integerInRange(2,4);

        rou.body.enable = true;
        rou.body.velocity.x = (cazok.x - rou.x) / randomSpeed ;
        rou.body.velocity.y = (cazok.y - rou.y) / randomSpeed ;
    }

}

function calcRandomPosition(){
    var side = game.rnd.integerInRange(1, 4);

    switch(side){
        case 1:
            var x = game.rnd.integerInRange(20, game.world.width-20);
            var y = game.rnd.integerInRange(1, 20);
            break;
        case 2:
            var x = game.rnd.integerInRange(20, game.world.width-20);
            var y = game.rnd.integerInRange(game.world.height-20, game.world.height-1);       
            break;
        case 3:
            var x = game.rnd.integerInRange(1, 20);
            var y = game.rnd.integerInRange(1, game.world.height-1);
            break;
        case 4:
            var x = game.rnd.integerInRange(game.world.width-20, game.world.width-1);
            var y = game.rnd.integerInRange(1, game.world.height-1);
            break;
    }
    return [x,y];
}

function cazokTexture(){
    cazok.loadTexture('cazok', 0, false);
}

function vomitingTexture(){
    cazok.loadTexture('vomiting', 0, false);
}

function update() {

    cazok.rotation = game.physics.arcade.angleToPointer(cazok) - 1.2;

    if (game.input.activePointer.isDown)
    {
        fire();
    }

    //  Run collision
    game.physics.arcade.overlap(bullets, rous, collisionHandler, null, this);
    game.physics.arcade.overlap(rous, cazok, enemyHitsPlayer, null, this);
}

function collisionHandler (bullet, rou) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    rou.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    //var explosion = explosions.getFirstExists(false);
    //explosion.reset(rou.body.x, rou.body.y);
    //explosion.play('kaboom', 30, false, true);
}

function enemyHitsPlayer (cazok,bullet) {
    
    bullet.kill();

    //  And create an explosion :)
    //var explosion = explosions.getFirstExists(false);
    //explosion.reset(cazok.body.x, cazok.body.y);
    //explosion.play('kaboom', 30, false, true);

    // When the player dies
    cazok.kill();
    bullets.callAll('kill');
    game.time.events.remove(spawnRous);

    stateText.text=" GAME OVER \n Click to restart";
    stateText.visible = true;

    //the "click to restart" handler
    game.input.onTap.addOnce(restart,this);
    

}
function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();
        bullet.scale.setTo(scaleRatio, scaleRatio);
        bullet.rotation = game.physics.arcade.angleToPointer(cazok) - 1.2;
        bullet.body.setSize(bullet.width*0.8, bullet.height*0.8, 0, 0);

        bullet.reset(cazok.x, cazok.y);

        game.physics.arcade.moveToPointer(bullet, 300);
    }

}
function addspawner(){
    spawnRous = game.time.events.loop(Phaser.Timer.SECOND, spawnEnemy, this);
}
function restart () {

    //  A new level starts

    rous.removeAll();

    //revives the player
    cazok.revive();
    //hides the text
    stateText.visible = false;
    addspawner()

}

function render() {

   // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
    //game.debug.spriteInfo(cazok, 32, 450);
    //game.debug.text('devicepixelratio: ' + window.devicePixelRatio + 'innerwidth: ' + window.innerWidth, 32, 250);
    //game.debug.text(game.input.activePointer.position, 32, 250);
}