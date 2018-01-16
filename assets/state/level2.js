 var text;
    var text2;
    var text3;
    var text4;
    var score = 0;
    var lives = 3;
    var timer;
    var total = 0;
    var disable = 0;
    var enemy;
    var enemy2;
   
     var movingX = true;
    var movingY = false;
    var totalDirection = 0;
    var randomVar = 0;
    var themesound;
	    
	    
	   
              
        
    var Pacman_level2  = function (game) {
        this.counter=0;
        this.map = null;
        this.layer = null;
        this.pacman = null;
        this.safetile = 14;
        this.gridsize = 16;
        this.speed = 140;
        this.threshold = 10;
        this.marker = new Phaser.Point();
        this.turnPoint = new Phaser.Point();
        this.directions = [ null, null, null, null, null ];
        this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];
        this.current = Phaser.NONE;
        this.turning = Phaser.NONE;
        this.enemy = null;
         
    };
	    
	  
    Pacman_level2 .prototype = {
        init: function () {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
            this.physics.startSystem(Phaser.Physics.ARCADE);
        },
        
        
        
        create: function () {
            var themesound;
            this.theme=this.add.audio('themesound');
            this.theme.play();
            
            this.map = this.add.tilemap('map');
            this.map.addTilesetImage('pacman-tiles', 'tiles');
            
            this.layer = this.map.createLayer('Pacman');
            
            this.dots = this.add.physicsGroup();
            
            
            this.bananas = this.add.physicsGroup();
            
            this.bonuses = this.add.physicsGroup();
            //this.map.createFromTiles(25, this.safetile, 'kk', this.layer, this.kk);
            this.bonuses.visible = false;
            
            this.map.createFromTiles(7, this.safetile, 'dot', this.layer, this.dots);
            
            this.map.createFromTiles(13, this.safetile, 'banana', this.layer, this.bananas);
            
          enemy = new Enemy(game, 0, 0, 1, 100);
            game.add.existing(enemy);
            enemy2 = new Enemy(game, 0, 0, 1, 70);
            game.add.existing(enemy2);
             
          
            this.switch = game.add.audio('switch');
            this.switch2 = game.add.audio('switch');
            this.win = game.add.audio('win');
            
            //  The dots will need to be offset by 6px to put them back in the middle of the grid
            this.dots.setAll('x', 6, false, false, 1);
            this.dots.setAll('y', 6, false, false, 1);
            
            this.bananas.setAll('x', 15, false, false, 2);
            this.bananas.setAll('y', 10, false, false, 2);
            //  Pacman should collide with everything except the safe tile
            this.map.setCollisionByExclusion([this.safetile], true, this.layer);
            //  Position Pacman at grid lo
              
            // new map coords
            this.pacman = this.add.sprite((13 * 16) + 8, (20 * 16) + 8, 'pacman', 0);
            // old map coords
            //this.pacman = this.add.sprite((11 * 16) + 8, (11 * 16) + 8, 'pacman', 0);
            this.pacman.anchor.set(0.5);
            this.pacman.animations.add('munch', [0,1], 5, true);
            this.physics.arcade.enable(this.pacman);
            this.pacman.body.setSize(16, 16, 0, 0);
            this.cursors = this.input.keyboard.createCursorKeys();
            this.pacman.play('munch');
            this.move(Phaser.LEFT);
            text = game.add.text(game.world.x, game.world.y, "Score: " + score, {
                font: "15px Arial",
                fill: "#ffffff"
            });
            text.anchor.set(0, -20.4);
            text2 = game.add.text(game.world.x, game.world.y, "Timer: " + timer + " seconds", {
                font: "15px Arial",
                fill: "#ffffff",
            });
            text2.anchor.set(-1, -20.4);
            text3 = game.add.text(game.world.x, game.world.y, "Lives: " + lives, {
                font: "15px Arial",
                fill: "#ffffff",
            });
            text3.anchor.set(-6, -20.4);
            
            timer = game.time.create(false);
            
            timer.loop(1000, updateCounter, this);
            
            timer.start();
        
            
            
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
            if (this.cursors.left.isDown && this.current !== Phaser.LEFT)
            {
                this.checkDirection(Phaser.LEFT);
            }
            else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT)
            {
                this.checkDirection(Phaser.RIGHT);
            }
            else if (this.cursors.up.isDown && this.current !== Phaser.UP)
            {
                this.checkDirection(Phaser.UP);
            }
            else if (this.cursors.down.isDown && this.current !== Phaser.DOWN)
            {
                this.checkDirection(Phaser.DOWN);
            }
            else
            {
                //  This forces them to hold the key down to turn the corner
                this.turning = Phaser.NONE;
            }
           
            
        },
        
        
        
        checkDirection: function (turnTo) {
            if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)
            {
                //  Invalid direction if they're already set to turn that way
                //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
                return;
            }
            //  Check if they want to turn around and can
            if (this.current === this.opposites[turnTo])
            {
                this.move(turnTo);
            }
            else
            {
                this.turning = turnTo;
                this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
                this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
            }
          
        },
        
        
        turn: function () {
            var cx = Math.floor(this.pacman.x);
            var cy = Math.floor(this.pacman.y);
            //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
            if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
            {
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
            if (direction === Phaser.LEFT || direction === Phaser.UP)
            {
                speed = -speed;
            }
            if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
            {
                this.pacman.body.velocity.x = speed;
            }
            else
            {
                this.pacman.body.velocity.y = speed;
            }
            //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
            this.pacman.scale.x = 1;
            this.pacman.angle = 0;
            if (direction === Phaser.LEFT)
            {
                this.pacman.scale.x = -1;
            }
            else if (direction === Phaser.UP)
            {
                this.pacman.angle = 270;
            }
            else if (direction === Phaser.DOWN)
            {
                this.pacman.angle = 90;
            }
            this.current = direction;
           
        },
        
        
        eatBonus: function (pacman, bonus) {
            bonus.kill();
            score = score + 10;
            text.setText("Score: " + score);
		
        },
        
       
        
        eatDot: function (pacman, dot) {
            
             score++;
            
            text.setText("Score: " + score);
            lives--;
            if (lives >= 0) {
                text3.setText("Lives: " + lives);
            }
            else {
                // display loss message and nullify text3
                text3.setText("");
            }
            
            this.eat=this.add.audio('eatsound');
            this.eat.play();
            
            dot.kill();
            
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
            if (this.dots.total === 0) {
                
                game.time.events.add(Phaser.Timer.SECOND / 10, playWin, this);
            }
            
            function playWin() {
                this.win.play()
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
         kill_pacman: function (pacman) {
            pacman.kill();
            
            lives--;
            
            if(lives > 1)
                {
                    lives = lives - 1;
                    score = 0;
                    game.state.star(game.state.current);
                    alert("Caution, you have lost 1 live!");
                    pacman.kill();
			
                     this.pacman.position.x = (14 * 16) + 8;
                    this.pacman.position.y = (17 * 16) + 8;
                    this.move(Phaser.LEFT);
                    this.enemy.position.x = (14 * 16) + 8;
                    this.enemy.position.y = (23 * 16) + 8;
                     }
                else
                {        
                    lives = 3;
                    score = 0;
			
                    
                    alert("You lost the game!");
                  
                    location.reload();
                    time = 0;
                    this.dots.callAll('revive');
                     this.pacman.position.x = (14 * 16) + 8;
                    this.pacman.position.y = (17 * 16) + 8;
                    this.move(Phaser.LEFT);
                    this.enemy.position.x = (14 * 16) + 8;
                    this.enemy.position.y = (23 * 16) + 8;
                }
		
            
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
            this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);
             
            // bonus
             if (total > 10) {
                this.physics.arcade.overlap(this.pacman, this.bonuses, this.eatBonus, null, this);
            }
            
              this.physics.arcade.collide(enemy, this.layer, moveEnemy);
            this.physics.arcade.collide(this.pacman, enemy, this.kill_pacman);
            this.physics.arcade.collide(enemy2, this.layer, moveEnemy);
            this.physics.arcade.collide(this.pacman, enemy2, this.kill_pacman);
           
            this.physics.arcade.overlap(this.pacman, this.bananas, this.eatbanana, null, this);
            this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
            this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;
            //  Update our grid sensors
            this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
            this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
            this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
            this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);
            this.checkKeys();
            if (this.turning !== Phaser.NONE)
            {
                this.turn();
            }
            text2.setText("Timer: " + total + " seconds");
            if (total == 10 && disable == 0) {
                this.bonuses.visible = true;
                disable = 1;
            }
            if (total % 15 == 0) {
                this.bonuses.callAll('kill');
            }
            if (total % 25 == 0) {
                this.bonuses.callAll('revive');
            }
		
        },
    };
    
    
    function updateCounter() {
        total++;
	   
    };
    Enemy = function (game, x, y, direction, speed) {
        Phaser.Sprite.call(this, game, x+16, y+16, "enemy");
        //this.anchor.setTo(.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.xSpeed = direction*speed;
        this.ySpeed = 30;
	   
    };
    Enemy.prototype = Object.create(Phaser.Sprite.prototype);
    Enemy.prototype.constructor = Enemy;
    Enemy.prototype.update = function() {
        //game.physics.arcade.collide(Enemy, game.layer, moveEnemy);
        this.body.velocity.x = this.xSpeed;
        this.body.velocity.y = this.ySpeed;
	  
    };
    function moveEnemy(enemy,platform){
        var rand = Math.floor((Math.random() * 10) + 1)%2;
        if (enemy.xSpeed == 0) {
            if (rand == 0) {
                enemy.xSpeed = enemy.ySpeed;
            }
            else {
                enemy.xSpeed = enemy.ySpeed*-1;
            }
            enemy.ySpeed = 0;
        }
        else {
            if (rand == 0) {
                enemy.ySpeed = enemy.xSpeed;
            }
            else {
                enemy.ySpeed = enemy.xSpeed*-1;
            }
            enemy.xSpeed = 0;
		
        }
	    
    }
    function moveEnemy2(enemy2,platform){
        var rand = Math.floor((Math.random() * 10) + 1)%2;
        if (enemy.xSpeed == 0) {
            if (rand == 0) {
                enemy2.xSpeed = enemy2.ySpeed;
            }
            else {
                enemy2.xSpeed = enemy2.ySpeed*-1;
            }
            enemy2.ySpeed = 0;
        }
        else {
            if (rand == 0) {
                enemy2.ySpeed = enemy2.xSpeed;
            }
            else {
                enemy2.ySpeed = enemy2.xSpeed*-1;
            }
            enemy2.xSpeed = 0;
		
        }
	   
    }

