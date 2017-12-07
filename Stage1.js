preload: function () {
            this.load.audio('themesound','audio/new.mp3');
            this.load.audio('eatsound','audio/waka.mp3');
            
            //  We need this because the assets are on github pages
            //  Remove the next 2 lines if running locally
           // this.load.baseURL = ' https://giorgosrv.github.io/pacman/';
           // this.load.crossOrigin = 'anonymous';
            
            this.load.image('dot', 'assets/dot.png');
            //this.load.image('12', 'assets/kk.png');
            
           
            this.load.image('banana', 'assets/kk.png');
            
            //this.load.audio('win', 'assets/audio/switch.mp3');
            
            this.load.audio('switch', 'audio/switch.mp3');
            
            this.load.image('tiles', 'assets/pacman-tiles.png');
           // game.load.image("enemy2","assets/car.png")
            
               game.load.image("enemy","assets/black.png");
             this.load.spritesheet('teleport', 'assets/teleport.png', 32, 32);
            this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
            this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);
            //  Needless to say, graphics (C)opyright Namco
		
		
		
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
