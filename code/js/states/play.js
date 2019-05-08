//---------------------------------------------------------------------//
//Squid Mommie														   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		play.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Play = function(game) {};
Play.prototype = {
	create: function() {
		console.log("Play");
		game.add.sprite(0,0, "bg");
		
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.gravity.y = 0;
		
		this.mommie = new player(game, game.world.centerX, game.world.centerY - 100, "squid");
		game.add.existing(this.mommie);
		
		this.babbies = game.add.group();
		this.spawnBaby(40, 40);
		this.spawnBaby();
		
		this.arrow = game.add.sprite(200, 200, "arrow");
		this.arrow.scale.setTo(0.1);
		this.arrow.kill();
		
		this.arrowTimer = game.time.create(false);
		this.arrowTimer.loop(3000, function() {this.arrow.kill();}, this);
		this.arrowTimer.start();
		
	},
	
	update: function() {
		var nearest = this.findNearest();
		var player = this.mommie;
		var distance;
		
		(nearest != null) ? 
			distance = Phaser.Math.distance(player.position.x, 
											player.position.y,
										    nearest.position.x, 
											nearest.position.y)
			: distance = undefined;
										   
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			if (this.babbies.countLiving() == 0)
				game.state.start("Play", true, false);
			
			var angle;
			if (distance >= 200) {
				//console.log(distance);
				angle = Phaser.Math.angleBetweenPoints(player.position, 									  nearest.position);
				
				this.arrow.revive();
				this.arrow.angle = Phaser.Math.radToDeg(angle) + 90;	
			}
			else if(distance < 200) {
				//console.log(nearest);
				angle = Phaser.Math.angleBetweenPoints(nearest.position, 									   player.position);
				
				nearest.body.force.x = Math.cos(angle) * 10000;
				nearest.body.force.y = Math.sin(angle) * 10000;
			}
		}
		
		this.arrow.position.x = player.position.x + 20;
		this.arrow.position.y = player.position.y - 70;;
		
		if (distance != undefined && distance <= 50)
			this.collectBaby(nearest);
	},
	
	spawnBaby: function(_x = game.world.centerX, _y = game.world.centerY) {
		var babbie = new babySquid(game, _x, _y, "squid");
		game.add.existing(babbie);
		this.babbies.add(babbie);
	},
	
	findNearest: function() {
		return this.babbies.getClosestTo(this.mommie);
	},
	
	collectBaby: function(babbie) {
		babbie.destroy();
		this.mommie.incrementCount();
	},
	
}
//---------------------------------------------------------------------//