//---------------------------------------------------------------------//
//Squid Mommie - Alpha												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		menu.js													       //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Menu = function(game) {};
Menu.prototype = {
	//Menu screen  
	create: function() {
		//console.log("Menu");

		//playing main theme
		this.theme = game.add.audio('theme');
		this.theme.loopFull();
		
		game.stage.backgroundColor = "#dabbed";
		game.add.text(115, 200, "Squid Mommie", {
			          fontSize: "64px", 
					  fill: "#fff",
					  font: "Impact", 
					  stroke: "#000",
					  strokeThickness: 8,
					  }
		);
		
		game.add.text(220, 280, "Space to Sing", {
			          fontSize: "32px", 
					  fill: "#fff",
					  font: "Impact", 
					  stroke: "#000",
					  strokeThickness: 6,
					  }
		);
		game.add.text(210, 320, "Mouse to move", {
			          fontSize: "32px", 
					  fill: "#fff",
					  font: "Impact", 
					  stroke: "#000",
					  strokeThickness: 6,
					  }
		);
		
		game.add.text(170, 500, "Sing to Continue", {
			          fontSize: "42px", 
					  fill: "#fff",
					  font: "Impact", 
					  stroke: "#000",
					  strokeThickness: 7,
					  }
		);
		game.add.text(170, 20, "Goal: Find all your babbies", {
			          fontSize: "24px", 
					  fill: "#fff",
					  font: "Impact", 
					  stroke: "#000",
					  strokeThickness: 4,
					  }
		);
		
		game.add.text(205, 50, "Hint: Sing when done", {
			          fontSize: "24px", 
					  fill: "#fff",
					  font: "Impact", 
					  stroke: "#000",
					  strokeThickness: 4,
					  }
		);
	},
	
	update: function() {
		this.xpos = 380;
		this.ypos = 280;
		this.count = 0;
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
			game.state.start("Play", true, false, this.xpos, this.ypos, this.count);
	},
}
//---------------------------------------------------------------------//