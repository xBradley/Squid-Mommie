//---------------------------------------------------------------------//
//Squid Mommie														   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		menu.js													       //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Menu = function(game) {};
Menu.prototype = {
	create: function() {
		console.log("Menu");
		
		game.stage.backgroundColor = "#dabbed";
		game.state.start("Play", true, false);
	},
}
//---------------------------------------------------------------------//