var music;
var time;
var time_text;
var atm_time;
var after_8_time;

var score = 0;
var score_text;

var lives = 3;
var lives_text;

var soldier_text;

var end_text;
var finish_text;

var counter = 0;
var knife_eaten = false;
var soldier_eaten = false;

var direction = 0;
var previous_direction = 0;

var direction2 = 0;
var previous_direction2 = 0;

var direction3 = 0;
var previous_direction3 = 0;


var Pacman_level2  = function (game) {
    this.map = null;
    this.layer = null;
    this.pacman = null;
    this.safetile = 14;
    this.gridsize = 16;
    this.speed = 150;
    this.threshold = 3;
    this.marker = new Phaser.Point();
    this.turnPoint = new Phaser.Point();
    this.directions = [null, null, null, null, null];
    this.opposites = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];
    this.current = Phaser.NONE;
    this.turning = Phaser.NONE;
};

Pacman_level2 .prototype = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function () {
	    this.load.tilemap('map', 'assets/pacman-level2.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function () {
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('pacman-tiles', 'tiles');
        

        this.layer = this.map.createLayer('Pacman');

        this.dots = this.add.physicsGroup();
        this.banana = this.add.physicsGroup();
        

        this.map.createFromTiles(7, this.safetile, 'dot', this.layer, this.dots);
        this.map.createFromTiles(13, this.safetile, 'banana', this.layer, this.banana);
       
        //  The dots will need to be offset by 6px to put them back in the middle of the grid
        this.dots.setAll('x', 6, false, false, 1);
        this.dots.setAll('y', 6, false, false, 1);
            
         
	    
	    
        //  Pacman should collide with everything except the safe tile
        this.map.setCollisionByExclusion([this.safetile], true, this.layer);

        //  Position Pacman at grid location 13x11 (the +8 accounts for his anchor)
        this.pacman = this.add.sprite((13 * 16) + 8, (11 * 16) + 8, 'pacman', 0);
     
        this.pacman.anchor.set(0.5);
        this.pacman.animations.add('munch', [0, 1, 2, 1], 15, true);
        this.physics.arcade.enable(this.pacman);
        this.pacman.body.setSize(16, 16, 0, 0);

      
        this.soldier = this.add.sprite((13 * 16) + 8, (16 * 16) + 8, 'soldier', 0);
        this.soldier.anchor.set(0.5);
        this.physics.arcade.enable(this.soldier);
        this.soldier.body.setSize(16, 16, 0, 0);
        this.soldier.body.velocity.x = -(this.speed - 50);
        this.soldier.body.velocity.y = 0;
	    
	     this.soldier2 = this.add.sprite((13 * 16) + 8, (16 * 16) + 8, 'soldier', 0);
        this.soldier2.anchor.set(0.5);
        this.physics.arcade.enable(this.soldier2);
        this.soldier2.body.setSize(16, 16, 0, 0);
        this.soldier2.body.velocity.x = -(this.speed - 30);
        this.soldier2.body.velocity.y = 0;
	    
	    
        this.soldier3 = this.add.sprite((12 * 16) + 8, (29 * 16) + 8, 'soldier', 0);
        this.soldier3.anchor.set(0.5);
        this.physics.arcade.enable(this.soldier3);
        this.soldier3.body.setSize(16, 16, 0, 0);
        this.soldier3.body.velocity.x = -(this.speed);
        this.soldier3.body.velocity.y = 0;


        this.cursors = this.input.keyboard.createCursorKeys();

        this.pacman.play('munch');

        music = this.add.audio('chopping');

        time_text = this.add.text(10, 460, 'Time: 0 seconds', { font: '14px Arial', fill: '#000000' });
        score_text = this.add.text(180, 460, 'Score: 0 points', { font: '14px Arial', fill: '#000000' });
        lives_text = this.add.text(360, 460, 'Lives: 3', { font: '14px Arial', fill: '#000000' });
        end_text = this.add.text(180, 330, 'Game Over!', { font: '14px Arial', fill: '#FFFFFF' });
        finish_text = this.add.text(185, 210, 'YOU WIN!!!!', { font: '30px Arial', fill: '#FFFFFF' });

        end_text.visible = false;
        finish_text.visible = false;
        this.game.time.reset();
	    
              //--------------TELEPORT1-----------------------------------------------
            this.teleport1 = this.add.sprite((1 * 16) + 8, (14 * 16) + 8, 'teleport', 0);
            this.teleport1.anchor.set(0.5);
            this.teleport1.animations.add('munch', [0, 1, 2, 1], 20, true);
            this.teleport1.play('munch');
            this.physics.arcade.enable(this.teleport1);
            this.teleport1.body.setSize(16, 16, 0, 0);
            //---------------------------------------------------------------------
            //--------------TELEPORT2-----------------------------------------------
            this.teleport2 = this.add.sprite((26* 16) + 8, (14 * 16) + 8, 'teleport', 0);
            this.teleport2.anchor.set(0.5);
            this.teleport2.animations.add('munch', [0, 1, 2, 1], 20, true);
            this.teleport2.play('munch');
            this.physics.arcade.enable(this.teleport2);
            this.teleport2.body.setSize(16, 16, 0, 0);
            //---------------------------------------------------------------------
              
    },

    checkKeys: function () {
        if (this.cursors.left.isDown && this.current !== Phaser.LEFT) {
            this.checkDirection(Phaser.LEFT);
        }
        else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT) {
            this.checkDirection(Phaser.RIGHT);
        }
        else if (this.cursors.up.isDown && this.current !== Phaser.UP) {
            this.checkDirection(Phaser.UP);
        }
        else if (this.cursors.down.isDown && this.current !== Phaser.DOWN) {
            this.checkDirection(Phaser.DOWN);
        }
        else {
            //  This forces them to hold the key down to turn the corner
            this.turning = Phaser.NONE;
        }
    },

    checkDirection: function (turnTo) {
        if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile) {
            //  Invalid direction if they're already set to turn that way
            //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
            return;
        }

        //  Check if they want to turn around and can
        if (this.current === this.opposites[turnTo]) {
            this.move(turnTo);
        }
        else {
            this.turning = turnTo;
            this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
            this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
        }
    },

    turn: function () {
        var cx = Math.floor(this.pacman.x);
        var cy = Math.floor(this.pacman.y);

        //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
        if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold)) {
            return false;
        }

        //  Grid align before turning
        this.pacman.x = this.turnPoint.x;
        this.pacman.y = this.turnPoint.y;

        this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);

        this.move(this.turning);

        this.turning = Phaser.NONE;

        return true;
    },

    move: function (direction) {
        var speed = this.speed;

        if (direction === Phaser.LEFT || direction === Phaser.UP) {
            speed = -speed;
        }
        if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
            this.pacman.body.velocity.x = speed;
        }
        else {
            this.pacman.body.velocity.y = speed;
        }
        //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
        this.pacman.scale.x = 1;
        this.pacman.angle = 0;

        if (direction === Phaser.LEFT) {
            this.pacman.scale.x = -1;
        }
        else if (direction === Phaser.UP) {
            this.pacman.angle = 270;
        }
        else if (direction === Phaser.DOWN) {
            this.pacman.angle = 90;
        }
        this.current = direction;
    },

    eatDot: function (pacman, dot) {
        dot.kill();
        music.play();
        score++;
        score_text.text = 'Score: ' + score + ' points';
       if (this.dots.total === 0 ) {
             this.game.paused = true;
             finish_text.visible = true;
        }
	    this.teleport1.body.velocity.x = 0;
                this.teleport1.position.x = (1 * 16) + 8;
                this.teleport1.position.y = (14 * 16) + 8;
                this.teleport2.body.velocity.x = 0;
                this.teleport2.position.x = (26 * 16) + 8;
                this.teleport2.position.y = (14 * 16) + 8;
    },

   eatbanana: function (pacman, banana) {
            score = score + 5;
            text.setText("Score: " + score);
            banana.kill();
            if (this.switch.isPlaying != true && this.switch2.isPlaying != true) {
                this.switch.play();
                this.counter = 1;
            }
            else {
                if (this.counter % 6 == 0) {
                    this.switch.play();
                }
                if (this.counter % 6 == 3) {
                    this.switch2.play();
                }
                this.counter++;
		   
            }
		   
   },
    endLevel: function () {
        if (lives == 0) {
            this.game.paused = true;
            end_text.visible = true;
        }
    },

   
  

   
    enemySoldierMove: function () {
        var enemySoldierSpeed = this.speed - 50;

        while (direction == previous_direction) {
            direction = this.game.rnd.between(0, 3);
        }

        this.soldier.scale.x = -1;
        this.soldier.angle = 0;

        if (direction == 0) {//goes right
            this.soldier.body.velocity.x = enemySoldierSpeed;
            this.soldier.body.velocity.y = 0;
        }
        else if (direction == 1) {//goes left
            this.soldier.body.velocity.x = -enemySoldierSpeed;
            this.soldier.body.velocity.y = 0;

            this.soldier.scale.x = 1;
        }
        else if (direction == 2) {//goes down
            this.soldier.body.velocity.x = 0;
            this.soldier.body.velocity.y = enemySoldierSpeed;

            this.soldier.scale.x = -1;
            this.soldier.angle = 90;
        }
        else {//goes up
            this.soldier.body.velocity.x = 0;
            this.soldier.body.velocity.y = -enemySoldierSpeed;

            this.soldier.angle = 270;
        }

        previous_direction = direction;
    },
	
	enemySoldierMove2: function () {
        var enemySoldierSpeed = this.speed - 60;

        while (direction2 == previous_direction2) {
            direction2 = this.game.rnd.between(0, 3);
        }

        this.soldier2.scale.x = -1;
        this.soldier2.angle = 0;

        if (direction2 == 0) {//goes right
            this.soldier2.body.velocity.x = enemySoldierSpeed;
            this.soldier2.body.velocity.y = 1;
        }
        else if (direction2 == 1) {//goes left
            this.soldier2.body.velocity.x = -enemySoldierSpeed;
            this.soldier2.body.velocity.y = 1;

            this.soldier2.scale.x = 1;
        }
        else if (direction2 == 2) {//goes down
            this.soldier2.body.velocity.x = 0;
            this.soldier2.body.velocity.y = enemySoldierSpeed;

            this.soldier2.scale.x = -1;
            this.soldier2.angle = 90;
        }
        else {//goes up
            this.soldier2.body.velocity.x = 0;
            this.soldier2.body.velocity.y = -enemySoldierSpeed;

            this.soldier2.angle = 270;
        }

        previous_direction2 = direction2;
    },

    enemySoldierMove3: function () {
        var enemySoldierSpeed = this.speed - 70;

        while (direction3 == previous_direction3) {
            direction3 = this.game.rnd.between(0, 3);
        }

        this.soldier3.scale.x = -1;
        this.soldier3.angle = 0;

        if (direction3 == 0) {//goes right
            this.soldier3.body.velocity.x = enemySoldierSpeed;
            this.soldier3.body.velocity.y = 0;
        }
        else if (direction3 == 1) {//goes left
            this.soldier3.body.velocity.x = -enemySoldierSpeed;
            this.soldier3.body.velocity.y = 0;

            this.soldier3.scale.x = 1;
        }
        else if (direction3 == 2) {//goes down
            this.soldier3.body.velocity.x = 0;
            this.soldier3.body.velocity.y = enemySoldierSpeed;

            this.soldier3.scale.x = -1;
            this.soldier3.angle = 90;
        }
        else {//goes up
            this.soldier3.body.velocity.x = 0;
            this.soldier3.body.velocity.y = -enemySoldierSpeed;

            this.soldier3.angle = 270;
        }

        previous_direction3 = direction3;
    },

	
	 enemySoldierKill: function () {
        if (this.pacman.overlap(this.soldier)) {
            this.pacman.reset((13 * 16) + 8, (11 * 16) + 8);
            this.move(Phaser.LEFT);
            lives--;
            lives_text.text = 'Lives: ' + lives;
        }
        else if (this.pacman.overlap(this.soldier2)) {
            this.pacman.reset((13 * 16) + 8, (11 * 16) + 8);
            this.move(Phaser.LEFT);
            lives--;
            lives_text.text = 'Lives: ' + lives;
        }
        else if (this.pacman.overlap(this.soldier3)) {
            this.pacman.reset((13 * 16) + 8, (11 * 16) + 8);
            this.move(Phaser.LEFT);
            lives--;
            lives_text.text = 'Lives: ' + lives;
        }
    },

    manageTime: function () {
        time = this.game.time.totalElapsedSeconds()|0;
        time_text.text = 'Time: ' + time + ' seconds';
    },


    update: function () {
	     if(this.physics.arcade.collide(this.pacman, this.teleport1))
            {
                this.pacman.position.x = (20 * 16) + 8;
                this.pacman.position.y = (14 * 16) + 8;
            }
            if(this.physics.arcade.collide(this.pacman, this.teleport2))
            {
                this.pacman.position.x = (7 * 16) + 8;
                this.pacman.position.y = (14 * 16) + 8;
            }
        this.physics.arcade.collide(this.pacman, this.layer);
        this.physics.arcade.collide(this.soldier, this.layer, this.enemySoldierMove, null, this);
	  this.physics.arcade.collide(this.soldier2, this.layer, this.enemySoldierMove2, null, this);
        this.physics.arcade.collide(this.pacman, this.knife, this.enemySoldier, null, this);
	    this.physics.arcade.collide(this.soldier3, this.layer, this.enemySoldierMove3, null, this);
        this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);
       
            this.physics.arcade.overlap(this.pacman, this.bananas, this.eatbanana, null, this);
        this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
        this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;

        //  Update our grid sensors
        this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
        this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
        this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
        this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);

        this.checkKeys();

        if (this.turning !== Phaser.NONE) {
            this.turn();
        }

        this.endLevel();
        
        
        this.manageTime();
        
        
    }
};
