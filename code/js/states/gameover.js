//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		gameover.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Gameover = function(game) {};
Gameover.prototype = {

    create: function() {
        console.log("Gameover");
        game.stage.backgroundColor = "#deface";
        game.add.text(115, 200, "Thank You For Playing", {
                    fontSize: "42px", 
                    fill: "#fff",
                    font: "Impact", 
                    stroke: "#000",
                    strokeThickness: 8,
                    }
        );
    },

    update: function() {
        //restart game on spacebar
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
            
            resetGlobals();
            game.state.start("Boot", true, true);
        }
	},
}
//---------------------------------------------------------------------//