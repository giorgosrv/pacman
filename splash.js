var splash= {
	preload: function(){
		game.load.image('loading',  'menu/blue.png');
		game.load.image('logo', 'menu/button.png');
		
	},
	create:function(){	
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		var background=game.add.sprite(0,0,'bg');
		//background.anchor.set(0.5,0.5);

		var menu = game.add.sprite(100,70, 'logo');
		menu.anchor.set(0.5,0.5);

		var button1 = game.add.button(100 , 150, "button", function(){
			game.state.start('state1');
		});
		button1.anchor.set(0.5, 0.5);

	}
}
