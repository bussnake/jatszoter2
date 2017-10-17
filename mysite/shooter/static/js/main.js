var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('cazok', 'static/images/cazok.png');
    game.load.image('bullet', 'static/images/projectile.png');
    game.load.image('vomiting', 'static/images/vomiting.png');
}

var sprite;
var bullets;

var fireRate = 100;
var nextFire = 0;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#ffffff';

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    
    sprite = game.add.sprite(400, 300, 'cazok');
    sprite.anchor.set(0.5);

    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    sprite.body.allowRotation = false;

    game.input.onDown.add(vomitingTexture, this);
    game.input.onUp.add(cazokTexture, this);
}

function cazokTexture(){
    sprite.loadTexture('cazok', 0, false);

}
function vomitingTexture(){
    sprite.loadTexture('vomiting', 0, false);
}

function update() {

    sprite.rotation = game.physics.arcade.angleToPointer(sprite) - 1.2;

    if (game.input.activePointer.isDown)
    {
        fire();
    }

}

function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();
        bullet.rotation = game.physics.arcade.angleToPointer(sprite) - 1.2;

        bullet.reset(sprite.x + 10, sprite.y +30);

        game.physics.arcade.moveToPointer(bullet, 300);
    }

}

function render() {

    game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
    game.debug.spriteInfo(sprite, 32, 450);

}