//---------------------------------------------------------------------//
//Squid Mommie - Beta												   //
//		Squid Mommies - Bradley Gallardo, Cathy Tram, Matthew Reed     //
//		level00.js													   //
//---------------------------------------------------------------------//

"use strict";
//---------------------------------------------------------------------//
var Level00 = function(game) {};
Level00.prototype = {
	//initialize variables for mommie
	init: function(_xpos, _ypos, _count, _squad, _theme, _theme2){
		this.xpos = _xpos;
		this.ypos = _ypos;
		this.count = _count;
		this.squad = _squad;
		this.theme = _theme;
		this.theme2 = _theme2;
	},

	create: function() {

		console.log("Level 00");

		//background
		game.stage.backgroundColor = "#2F4F4F";
		game.world.setBounds(0,0, 1600, 1600);
		
		//p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		//added in the desperate attempt to make the map work
	    game.physics.p2.setImpactEvents(true); 
		game.physics.p2.gravity.y = 0;

		//This is for the origional map I made that will probably work for testing.
		this.map = game.add.tilemap('world00');
		this.map.addTilesetImage('slopes', 'slopes');
		this.backgroundLayer = this.map.createLayer('background');
		this.wallLayer = this.map.createLayer('walls');
		this.map.setCollisionByExclusion([], true, this.wallLayer);
		this.wallLayer.resizeWorld();

		//adding wall physics
        game.physics.p2.convertTilemap(this.map, this.wallLayer);
        this.wallCollisionsGroup = game.physics.p2.createCollisionGroup();
        this.wallBodies = game.physics.p2.convertTilemap(this.map, this.wallLayer);
		
		//spawn babbie and add to group (babbies) 
		this.babbies = game.add.group();
		if(this.squad[0])
			this.spawnBaby(496, 1230);
		if(this.squad[1])
			this.spawnBaby(1755, 205);

		
		//add player character (mommie)
		this.mommie = new player(game, this.xpos, this.ypos, "MommieSheet", this.babbies, this.count);
		game.add.existing(this.mommie);
		
		//add babbie followers
		for (var i = 0; i < this.count; i++) {
			this.mommie.attachBaby(this.spawnFollower(this.xpos - 50, this.ypos + 50));
		}
		
		//camera stuff
		game.camera.follow(this.mommie, Phaser.Camera.FOLLOW_TOPDOWN);

		//Move Tutorial Text
		this.moveTutorial = game.add.text(this.mommie.position.x - 100, this.mommie.position.y - 100, "Click or Hold Left Mouse to move me", {
			fontSize: "14px", 
			fill: "#fff",
			font: "Impact", 
			stroke: "#000",
			strokeThickness: 2,
			}
		);
		this.moveTutorial.alpha = 0;

		//Sing Tutorial Text
		this.singTutorial = game.add.text(this.mommie.position.x - 125, this.mommie.position.y - 100, "Press Spacebar to Sing so I can find my babbies", {
			fontSize: "14px", 
			fill: "#fff",
			font: "Impact", 
			stroke: "#000",
			strokeThickness: 2,
			}
		);
		this.singTutorial.alpha = 0;

		//Call Tutorial Text
		this.callTutorial = game.add.text(this.mommie.position.x - 100, this.mommie.position.y - 100, "Sing again when I'm close to call my babbie", {
			fontSize: "14px", 
			fill: "#fff",
			font: "Impact", 
			stroke: "#000",
			strokeThickness: 2,
			}
		);
		this.callTutorial.alpha = 0;
	},
	
	//Play update loop
	update: function() {
		//switching theme the song for the final goodbye
		if(this.mommie.getCount() == 10 && this.theme2.volume < 0.35){
			console.log(this.theme2.volume);
			this.theme.volume -= .01;
			this.theme2.volume += .01;
		}

		//Move Tutorial Text
		//******************************************************//
		//Fade in and Follow player
		if (this.moveTutorial.alive == true &&
			this.moveTutorial.alpha <= 0.9  && 
			this.moveTutorial.position.x <= 420) {
			
			this.moveTutorial.position.x = this.mommie.position.x - 100;
			this.moveTutorial.position.y = this.mommie.position.y - 100;
			this.moveTutorial.alpha += 0.01;
		}
		//After fade, follow player
		else if (this.moveTutorial.alive == true &&
				this.moveTutorial.alpha > 0.9    && 
				this.moveTutorial.position.x <= 420) {
			
			this.moveTutorial.position.x = this.mommie.position.x - 100;
			this.moveTutorial.position.y = this.mommie.position.y - 100;
		}
		//After moving so far, fade out text
		else if (this.moveTutorial.alive == true     &&
				this.moveTutorial.position.x >= 420  && 
				this.moveTutorial.alpha >= 0.1) {
			
			this.moveTutorial.alpha -= 0.01;
		}
		//After fade, kill text
		else if (this.moveTutorial.alive == true     &&
				this.moveTutorial.position.x >= 420  && 
				this.moveTutorial.alpha < 0.1) {
			
			this.moveTutorial.destroy();
			this.moveTutorial.alpha = 0;
		}
		//******************************************************//

		//Sing Tutorial Text
		//******************************************************//
		//Fade in text and follow player
		if (this.moveTutorial.alive == false &&
			this.singTutorial.alive == true  && 
			this.singTutorial.alpha <= 0.9   &&
			this.singTutorial.position.y <= 550) {
			
			this.singTutorial.position.x = this.mommie.position.x - 125;
			this.singTutorial.position.y = this.mommie.position.y - 100;
			this.singTutorial.alpha += 0.01
		}
		//After fade is done, just follow player
		else if (this.moveTutorial.alive == false &&
				this.singTutorial.alive == true   && 
				this.singTutorial.alpha > 0.9     &&
				this.singTutorial.position.y <= 550) {
			
			this.singTutorial.position.x = this.mommie.position.x - 125;
			this.singTutorial.position.y = this.mommie.position.y - 100;
		}
		//After moving so far, fade out text, stop following player
		else if (this.moveTutorial.alive == false &&
				this.singTutorial.alive == true   && 
				this.singTutorial.alpha >= 0.1    &&
				this.singTutorial.position.y > 550) {
				
			this.singTutorial.alpha -= 0.01;
		}
		//After Fade out, kill text
		else if (this.moveTutorial.alive == false &&
				this.singTutorial.alive == true   && 
				this.singTutorial.alpha < 0.1     &&
				this.singTutorial.position.y > 550) {
			
			this.singTutorial.alpha = 0;
			this.singTutorial.destroy();
		}
		//******************************************************//
		
		//Call Tutorial Text 
		//******************************************************//
		//Fade in text and follow player
		if (this.moveTutorial.alive == false &&
			this.singTutorial.alive == false && 
			this.callTutorial.alive == true  &&
			this.callTutorial.alpha <= 0.9   &&
			this.mommie.position.y > 750     &&
			this.mommie.position.x < 600) {
			
			this.callTutorial.position.x = this.mommie.position.x - 125;
			this.callTutorial.position.y = this.mommie.position.y - 100;
			this.callTutorial.alpha += 0.01
		}
		//After fade is done, just follow player
		else if (this.moveTutorial.alive == false &&
				this.singTutorial.alive == false  && 
				this.callTutorial.alive == true   &&
				this.callTutorial.alpha > 0.9     &&
				this.mommie.position.y > 750      &&
				this.mommie.position.x < 600) {
			
			this.callTutorial.position.x = this.mommie.position.x - 125;
			this.callTutorial.position.y = this.mommie.position.y - 100;
		}
		//After moving so far, fade out text, stop following player
		else if (this.moveTutorial.alive == false &&
				this.singTutorial.alive == false  && 
				this.callTutorial.alive == true   && 
				this.callTutorial.alpha >= 0.1    &&
				this.mommie.position.y > 750      &&
				this.mommie.position.x > 600) {
			
			this.callTutorial.alpha -= 0.01;
		}
		//After Fade out, kill text
		else if (this.moveTutorial.alive == false &&
				this.singTutorial.alive == false  && 
				this.callTutorial.alive == true   && 
				this.callTutorial.alpha < 0.1     &&
				this.mommie.position.y > 750      &&
				this.mommie.position.x > 600) {
			
			this.callTutorial.alpha = 0;
			this.callTutorial.destroy();
		}
		//******************************************************//
		
		//Path to Level 01
		if(this.mommie.body.x >= 1850){
			//console.log("Count: " + this.mommie.getCount());

			game.state.start('Level01', true, false, 90, 205, this.mommie.getCount(), this.squad, this.theme, this.theme2);
 
			this.wallLayer.destroy();
			this.backgroundLayer.destroy();
			this.mommie.destroy();
			this.babbies.destroy();
		}
	},
	
	render: function() {
		//game.debug.cameraInfo(game.camera, 32, 32);
		//game.debug.spriteCoords(this.mommie, 32, 500);
		//game.debug.pointer(game.input.activePointer);
		
		//var zone = this.soundWaveEmitter.area;
		//game.context.fillStyle = "rgba(0,0,255,0.5)";
		//game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
	},
	
	//spawn baby, add to world, add to group
	spawnBaby: function(_x = game.world.centerX, _y = game.world.centerY) {
		var babbie = new babySquid(game, _x, _y, "squid");
		game.add.existing(babbie);
		this.babbies.add(babbie);
	},

	//spawn baby, add to world, return baby
	spawnFollower: function(_x = game.world.centerX, _y = game.world.centerY) {
		var babbie = new babySquid(game, _x, _y, "squid");
		game.add.existing(babbie);
		
		return babbie;
	},
}
//---------------------------------------------------------------------//