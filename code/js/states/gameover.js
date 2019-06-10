//---------------------------------------------------------------------//
//Squid Mommie - Final												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		gameover.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Gameover = function(game) {};
Gameover.prototype = {

    create: function() {
       // console.log("Gameover");
        game.stage.backgroundColor = "#000";
        var lastLullaby = game.add.text(100, 100, "Last Lullaby", {
            fontSize: "96px", 
            fill: "#fff",
            font: "Black And White Picture", 
            stroke: "#000",
            strokeThickness: 8,
            }
        );
        lastLullaby.alpha = 0;

        var me = game.add.text(75, 300, "Bradley Gallardo....................Programming", {
            fontSize: "32px", 
            fill: "#fff",
            font: "Black And White Picture", 
            stroke: "#000",
            strokeThickness: 8,
            }   
        );
        me.alpha = 0;


        var matt = game.add.text(75, 350, "Matthew Reed.......Sound & Level Design", {
            fontSize: "32px", 
            fill: "#fff",
            font: "Black And White Picture", 
            stroke: "#000",
            strokeThickness: 8,
            }   
        );
        matt.alpha = 0;

        var cathy = game.add.text(75, 400, "Cathy Tram...................................................Art", {
            fontSize: "32px", 
            fill: "#fff",
            font: "Black And White Picture", 
            stroke: "#000",
            strokeThickness: 8,
            }   
        );
        cathy.alpha = 0;

        var space = game.add.text(170, 500, "Press Space", {
			fontSize: "64px", 
			fill: "#fff",
			font: "Black And White Picture", 
			stroke: "#000",
			strokeThickness: 7,
        });
        space.alpha = 0;

        game.add.tween(lastLullaby).to( {
            alpha: 1, 
        }, 2000, "Linear", true);
        
        game.add.tween(me).to( {
            alpha: 1, 
        }, 2000, "Linear", true, 2000);

        game.add.tween(matt).to( {
            alpha: 1, 
        }, 2000, "Linear", true, 3000);
        
        game.add.tween(cathy).to( {
            alpha: 1, 
        }, 2000, "Linear", true, 4000);

        game.add.tween(space).to( {
            alpha: 1, 
        }, 2000, "Linear", true, 5000);
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