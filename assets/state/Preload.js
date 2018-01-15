preload: function () {
            this.load.audio('themesound','audio/new.mp3');
            this.load.audio('eatsound','audio/waka.mp3');
            
            //  We need this because the assets are on github pages
            //  Remove the next 2 lines if running locally
            this.load.baseURL = ' https://giorgosrv.github.io/pacman/';
            this.load.crossOrigin = 'anonymous';
            
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
