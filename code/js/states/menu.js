//---------------------------------------------------------------------//
//Squid Mommie - Final												   //
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
		this.theme2 = game.add.audio('theme2');
		this.theme2.loopFull();
		this.theme2.volume = 0;
		this.theme.volume = 1;
		
		game.stage.backgroundColor = "#0";
		this.ts = game.add.sprite(0,0, "title");
		
		this.text = game.add.text(170, 500, "Press Space", {
			fontSize: "64px", 
			fill: "#fff",
			font: "Black And White Picture", 
			stroke: "#000",
			strokeThickness: 7,
		});
		
		this.flash = game.add.tween(this.text).to( { 
			alpha: 0
		}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.POSITIVE_INFINITY, true );

		this.xpos = 416;
		this.ypos = 384;
		this.count = 00;
		this.lightRadius = 150;
	},
	
	update: function() {

		//start game on spacebar
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			this.flash.stop();
			game.add.tween(this.ts).to( {
				alpha: 0, 
			}, 2000, "Linear", true);
			
			game.add.tween(this.text).to( {
				alpha: 0, 
			}, 2000, "Linear", true);
		}
		
		if (this.text.alpha < 0.1 && this.ts.alpha < 0.1)
			game.state.start("Level00", true, false, this.xpos, this.ypos, this.count, this.theme, this.theme2, this.lightRadius);
	},
}
//---------------------------------------------------------------------//