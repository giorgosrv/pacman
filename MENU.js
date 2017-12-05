var MENU = {
	preload: function() {

		game.load.image('menu', 'assets/lvl.png');
		game.load.image('lvl1', 'assets/Level1.png');
		

		

	},
	
	create: function() {

		menus = game.add.audio('menus');
		menus.play('',0,1,true);

		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.physics.startSystem(Phaser.Physics.ARCADE);

		var s = game.add.sprite(350, 80, 'menu');
		

		var btn1 = game.add.button(490 , 320, "lvl1", function(){
			game.state.start('pacman-map');
		});
		btn1.anchor.set(0.5, 0.5);

		

	}
}
