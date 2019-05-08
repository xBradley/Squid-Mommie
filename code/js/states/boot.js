//---------------------------------------------------------------------//
//Squid Mommie														   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		boot.js														   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Boot = function(game) {};
Boot.prototype = {
	preload: function() {
		game.load.path = "assets/img/";
		game.load.image("bg", "background.png");
		game.load.image("squid", "squid.png");
		game.load.image("arrow", "arrow.png");
		game.load.physics("squidPhysics", "squid.json");
	},
	
	create: function() {
		console.log("Boot");
		
		game.stage.backgroundColor = "#deface";
		game.state.start("Menu", true, false);
	},
}
//---------------------------------------------------------------------//