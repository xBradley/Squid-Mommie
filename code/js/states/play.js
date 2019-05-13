//---------------------------------------------------------------------//
//Squid Mommie														   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		play.js													   	   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Play = function(game) {};
Play.prototype = {
	//Play screen
	create: function() {
		console.log("Play");
		//playing main theme
		var theme;
		this.theme = game.add.audio('theme');
		this.theme.loopFull();

		//background
		game.add.sprite(0,0, "bg");
		
		game.world.setBounds(0,0, 1600, 1600);
		
		//p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.gravity.y = 0;

		//Creating map -Matt
		
		//This here is a map in progress
		/*var map; //I don't know a better place to declare these variable -Matt
		var backgroundLayer;
		var decorationsLayer;
		var wallLayer;
		this.map = game.add.tilemap('world');
		this.map.addTilesetImage('caves', 'caveTiles'); // 'caves' is referring to the tilesets in the 'depths.json' file.
		this.map.setCollisionByExclusion([]);
		this.wallLayer = this.map.createLayer('walls'); //this part referes to the 'walls' layer in our map json file.
		//this.wallLayer.resizeWorld(); //This isn't working very well :(
		*/

		//This is for the origional map I made that will probably work for testing.
		this.map = game.add.tilemap('globe');
		this.map.addTilesetImage('ForgottenDungeon', 'dungeon');
		this.map.addTilesetImage('construction_tileset', 'metal');
		this.backgroundLayer = this.map.createLayer('Background');
		this.wallLayer = this.map.createLayer('Walls');
		this.map.setCollisionByExclusion([], true, this.wallLayer);
		game.physics.p2.enable(this.map, true);


		//End of map creation -Matt
		
		
		//add player character (mommie)
		this.mommie = new player(game, 300, 300, "squid");
		game.add.existing(this.mommie);
		
		//spawn babbie and add to group (babbies) 
		this.babbies = game.add.group();
		this.spawnBaby(40, 40);
		this.spawnBaby();
		
		//add arrow sprite for guidance 
		this.arrow = game.add.sprite(200, 200, "arrow");
		this.arrow.scale.setTo(0.1);
		this.arrow.kill();
		
		//arrow timer to be killed every 3 seconds
		this.arrowTimer = game.time.create(false);
		this.arrowTimer.loop(3000, function() {this.arrow.kill();}, this);
		this.arrowTimer.start();
		
		game.camera.follow(this.mommie, Phaser.Camera.FOLLOW_TOPDOWN);
		
	},
	
	//Play update loop
	update: function() {
		var nearest = this.findNearest();			//finds nearest babbie
		var player = this.mommie;					//shortcut for mommie
		var distance;								//distance variable

		//if nearest is defined, find distance from player to nearest
		//else distance is undefined
		(nearest != null) ? 
			distance = Phaser.Math.distance(player.position.x, 
											player.position.y,
										    nearest.position.x, 
											nearest.position.y)
			: distance = undefined;
		
		
		//Spacebar controls
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			//if not babbies are alive do final sing
			if (this.babbies.countLiving() == 0)
				game.state.start("Play", true, false);
			
			var angle;								//angle variable
			//if distance is greater than 200,
			//find angle between player to nearest 
			if (distance >= 200) {
				//console.log(distance);
				angle = Phaser.Math.angleBetweenPoints(player.position, 									  nearest.position);
				
				//revive arrow and point to nearest
				this.arrow.revive();
				this.arrow.angle = Phaser.Math.radToDeg(angle) + 90;	
			}
			//if distance is less than 200,
			//find angle between nearest to player
			else if(distance < 200) {
				//console.log(nearest);
				angle = Phaser.Math.angleBetweenPoints(nearest.position, 									   player.position);
				
				//move towards player
				nearest.body.force.x = Math.cos(angle) * 10000;
				nearest.body.force.y = Math.sin(angle) * 10000;
			}
		}
		  
		
		//arrow is fixed on player
		this.arrow.position.x = player.position.x + 20;
		this.arrow.position.y = player.position.y - 70;;
		
		//if distance is less than 50, eat baby
		if (distance != undefined && distance <= 50)
			this.collectBaby(nearest);
	},
	
	render: function() {
		game.debug.cameraInfo(game.camera, 32, 32);
		game.debug.spriteCoords(this.mommie, 32, 500);
		game.debug.pointer(game.input.activePointer);
		
		//var zone = game.camera.deadzone;
		//game.context.fillStyle = "rgba(0,0,255,0.5)";
		//game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
	},
	
	//spawn baby, add to world, add to group
	spawnBaby: function(_x = game.world.centerX, _y = game.world.centerY) {
		var babbie = new babySquid(game, _x, _y, "squid");
		game.add.existing(babbie);
		this.babbies.add(babbie);
	},
	
	//get closest baby from player
	findNearest: function() {
		return this.babbies.getClosestTo(this.mommie);
	},
	
	//eat baby, increment count
	collectBaby: function(babbie) {
		babbie.destroy();
		this.mommie.incrementCount();
	},
	
}
//---------------------------------------------------------------------//