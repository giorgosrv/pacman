var MainMenu = {
	create: function(){
		this.stage.backgroundColor = '#000020';

		//Creating Super Mario
		var pacman = game.add.image(256, 40, 'Title');
		pacman.anchor.set(0.5, 0.5);
		
		//Creating level 1 button
		var buttonLVL1 = game.add.button(256 , 104, "lvl1", function(){

			//Updating current map
			localStorage.setItem("currentLevel", 1);
			currentMap = parseInt(localStorage.getItem("currentLevel"));

			map = game.add.tilemap('level1');
			game.state.start('GamePlay');
		});
		buttonLVL1.anchor.set(0.5, 0.5);

		

		
	}
}
