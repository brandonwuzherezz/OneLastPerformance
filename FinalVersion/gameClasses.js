"use strict";

var loaded0 = false;
var loaded1 = false;

function GameState(canvas, context, leveldata, input) {
	//"global" unchanging stuff
	this.canvas = canvas;
	this.context = context;
	this.leveldata = leveldata;
	this.input = new Controller();
	
	//non-level specific
	var startlives = 3;
	var levelfade = 0;
	this.time = 0;
	this.score = 0;
	this.lives = startlives;
	this.levelnum = 0;
	this.smallBorder = 8;
	this.largeBorder = 48;
	
	this.score=0;
	this.highscore=0;
	this.doLevelTransition = -1;
	
	//images
	var titleImage= new Image();
	titleImage.src="http://people.ucsc.edu/~bsamudio/FinalGame120/title.jpg";
	var lightRayImage = new Image();
	lightRayImage.src="http://people.ucsc.edu/~bsamudio/FinalGame120/Ray.png";
	var healthImage= new Image();
	healthImage.src="http://people.ucsc.edu/~bsamudio/FinalGame120/heartListen.png";
	
	//lazy
	var preload0 = new Image();
	preload0.src="cloudsTex.png";
	var preload1 = new Image();
	preload1.src="spaceTex.png";
	
	//sounds
	var Shootsound = new Howl({//change here
	urls: ['http://people.ucsc.edu/~bsamudio/FinalGame120/laser.wav'],
	buffer:true,
	volume:0.05
	});
	var FocusSound = new Howl({
	urls: ['http://people.ucsc.edu/~bsamudio/FinalGame120/dubstep.mp3'],
	buffer:true,
	volume:0.4//change here
	});
	var explodeSound = new Howl({
	urls:["http://people.ucsc.edu/~bsamudio/FinalGame120/explode.wav"],
	buffer:true,
	volume:0.5
	});
	this.EnemyDeathsound = new Howl({//change here
	urls: ['http://people.ucsc.edu/~bsamudio/FinalGame120/Enemydeath.wav'],
	buffer:true,
	volume:0.5
	});	
	
	//level specific (draw + update)
	this.enemyTimeline = {};
	this.obstacleTimeline = {};
	this.activeEnemyList;
	this.activeObstacleList;
	this.activeBulletList;
	this.activePlayer = new Player(this.canvas.width/2, this.canvas.height/2);
	
	//level specific (parameters)
	this.backgroundImage;
	this.obstacleImageSrc;
	this.backgroundmusic;
	this.oneTime = true;
	this.health;
	this.MusicOnce=true;
	
	this.loadLevel = function (levelnumber) {
		//load in timelines for the new level
		this.enemyTimeline = this.leveldata[levelnumber].enemyTimeline; //register enemy List;
		this.enemyTimeline.reset();
		this.obstacleTimeline = this.leveldata[levelnumber].obstacleTimeline; //register obstacle List;
		this.obstacleTimeline.reset();
		
		//clear out active entities
		this.activeEnemyList = new EnemyList();
		this.activeObstacleList = new ObstacleList();
		this.activeBulletList = new BulletList();
		
		//add in new background
		this.backgroundImage = this.leveldata[levelnumber].backgroundImage;
		
		//add in new tileset
		this.obstacleImageSrc = this.leveldata[levelnumber].obstacleImageSrc;
		
		//register level music
		this.backgroundmusic=this.leveldata[levelnumber].music;
		
		//health per level
		this.health=this.leveldata[levelnumber].health;
	
	}
	
	function collisionCheck(c) {
		//player obstacle collision
		c.activeObstacleList.obstaclemap.forEach(function(obstacle) {
			if (Xgeo.ifPointBoxCollision(c.activePlayer, obstacle)) {
				console.log("player obstacle collision");
				c.activePlayer.explode = true;
			}
			
			//obstacle bullet collision
			c.activeBulletList.bulletmap.forEach(function(bullet) {
				if (Xgeo.ifPointBoxCollision(bullet, obstacle)) {
					console.log("obstacle bullet collision");
					c.activeBulletList.delete(bullet);
				}
			});
			
		});
		
		c.activeEnemyList.enemymap.forEach(function(enemy) {
			//player enemy collision
			if (Xgeo.ifPointBoxCollision(c.activePlayer, enemy)) {
				console.log("player enemy collision");
				c.activePlayer.explode = true;
			}
			
			//enemy bullet collision
			c.activeBulletList.bulletmap.forEach(function(bullet) {
				if (enemy.canExplode == true && Xgeo.ifPointBoxCollision(bullet, enemy)) {
					console.log("enemy bullet collision");
					enemy.explode = true;
					c.activeBulletList.delete(bullet);
				}
			});
		});
	}

	this.update = function() {
		//update the controlls (always do this first!);
		this.input.update();

		//if a level transition has been flagged, do that instead
		if (this.doLevelTransition >= this.leveldata.length) {
			if (this.score > this.highscore) {
				this.highscore = this.score;
			}
		}
		else if (levelfade == 0 && (this.doLevelTransition == 0 || this.doLevelTransition == this.levelnum)) {
			this.loadLevel(this.doLevelTransition);
			this.levelnum = this.doLevelTransition;
			levelfade = 0;
			this.doLevelTransition = -1;
			return;
		}
		else if (this.doLevelTransition >= 0) {
			++levelfade;
			if (levelfade == 50) {
				this.loadLevel(this.doLevelTransition);
				this.levelnum = this.doLevelTransition;
				return;
			}
			if (levelfade == 100) {
				levelfade = 0;
				this.doLevelTransition = -1;
				return;
			}
		}
		
		if (this.MusicOnce==true){//Brandon
			this.backgroundmusic.play();//Brandon
			this.MusicOnce=false;
		}
		if(this.input.isPressing.a){//HERE
			Shootsound.play();
		}
		//explosion sound
		if(this.activePlayer.explode==true &&  this.activePlayer.spawnTimer==1){
			explodeSound.play();
		}
		
		if (this.activePlayer.isAlive == true) {
			//spawn new obstacles and enemies as necessary
			this.enemyTimeline.update(this);
			this.obstacleTimeline.update(this);

			collisionCheck(this);
			
			//update those entities which already exist onscreen
			this.activeObstacleList.update(this);
			this.activeBulletList.update(this);
			this.activePlayer.update(this, this.input);
			this.activeEnemyList.update(this);
		}
		else {
			this.activePlayer.update(this, this.input);
		}
		
		//update world time
		++this.time;
		
		if(this.score>this.highscore){
			if(this.activePlayer.isAlive==false){	    	
				this.highscore=this.score;
			}
		}
		if (this.input.isHolding.b) {
			if(this.oneTime==true){//change here
				FocusSound.loop(true);
				FocusSound.play();
				this.oneTime=false;
			}
			return;
	    }
	    
		if(this.input.isReleasing.b==true){
			this.oneTime=true;
			FocusSound.loop(false);//Brandon
		}
		FocusSound.stop();//Brandon	
	}

	this.MainMenuDraw = function(){
		this.context.drawImage(titleImage, 0 ,0 ,this.canvas.width, this.canvas.height);
	}
	
	this.draw = function() {
		//clear the canvas
		this.canvas.width = this.canvas.width;
		
		//draw scrolling background image
		var distance = ((this.time * 3) % this.backgroundImage.height);
		this.context.drawImage(this.backgroundImage,0,distance,this.canvas.width,this.canvas.height);
		this.context.drawImage(this.backgroundImage,0,(distance-this.backgroundImage.height),this.canvas.width,this.canvas.height);

		//draw light above screen
				
		//draw an inner border around the canvas
		this.context.globalCompositeOperation = "overlay";
		this.context.lineWidth = 2 * this.largeBorder;
		this.context.strokeRect (0, 0, canvas.width, canvas.height);
		this.context.globalCompositeOperation = "source-over";
		this.context.drawImage(lightRayImage,0,0,this.canvas.width,this.canvas.height);
		this.context.globalCompositeOperation = "source-over";
		
		//draw those entities which already exist onscreen
		this.activeBulletList.draw(this);
		this.activePlayer.draw(this, this.input);
		this.activeObstacleList.draw(this);
		this.activeEnemyList.draw(this);
		
		//draw an outer border around the canvas
		this.context.lineWidth = 2 * this.smallBorder;
		this.context.strokeStyle = 'black';
		this.context.strokeRect (0, 0, canvas.width, canvas.height);	
		
		if (this.doLevelTransition == this.leveldata.length) {
			//draw win screen
			this.context.globalAlpha = 0.5;
			this.context.fillStyle = "#FFFFFF";
			this.context.fillRect (0, 0, canvas.width, canvas.height);
			this.context.globalAlpha = 1;
			this.context.fillStyle = "#483D8B";
			this.context.font = "35px Andale Mono";
			this.context.fillText('ASCENDED',145,135);
		    this.context.fillText('Score:',155,185);
			this.context.fillText(this.score,285,187);
			this.context.fillText('HighScore:',125,225);
			this.context.fillText(this.highscore,325,227);
			//this.context.font = "25px Andale Mono";
			//this.context.fillText('Press SpaceBar for new game plus',80,285);
		}
		if (this.doLevelTransition >= 0 && this.doLevelTransition < this.leveldata.length) {
			//console.log('doing level transition')
			//console.log('globalAlpha = ' + this.context.globalAlpha);
			this.context.globalAlpha = Math.sin (Math.PI*levelfade / 100);
			this.context.fillStyle = "#000000";
			this.context.fillRect(0, 0, 1000, 1000);
			this.context.globalAlpha = 1;
		}
		
		//draw the HUD draws health
		var spacing = this.canvas.width/32;
		var offsetX = spacing;
		var healthImgSize = this.canvas.width/16;
		for (var i = 0; i < this.health; ++i){
			this.context.drawImage(healthImage, offsetX, spacing, healthImgSize, healthImgSize);
			offsetX += healthImgSize + spacing;
		}
		if(this.activePlayer.isAlive==false){
			this.context.fillStyle = "#483D8B";
			this.context.font = "35px Andale Mono";
			this.context.fillText('GAME OVER',145,135);
		    this.context.fillText('Score:',155,185);
			this.context.fillText(this.score,285,187);
			this.context.fillText('HighScore:',125,225);
			this.context.fillText(this.highscore,325,227);
			this.context.font = "25px Andale Mono";
			this.context.fillText('Press SpaceBar to continue',80,285);
		}	
	 	
	    this.context.fillStyle = "#483D8B";
		this.context.font = "15px Andale Mono";
		this.context.fillText("score:",10,495);
	    this.context.fillText(this.score,75,497);
	    this.context.fillText("highscore:",360,495);
	    this.context.fillText(this.highscore,450,497);
	    this.context.fillText("Level",200,495);
	    this.context.fillText(this.levelnum + 1 ,250,495);
		//TODO draw any blending or special effects
	}
	
	this.loadLevel(0);
	
}

function Controller() {
	//key bindings
	this.leftKey = 65;
	this.rightKey = 68;
	this.upKey = 87;
	this.downKey = 83;
	this.aKey = 32;
	this.bKey = 16;
	this.startKey = 13;
	
	//per-frame flags for key events
	this.isPressing = {l:false, r:false, u:false, d:false, a:false, b:false, s:false};
	this.isHolding = {l:false, r:false, u:false, d:false, a:false, b:false, s:false};
	this.isReleasing = {l:false, r:false, u:false, d:false, a:false, b:false, s:false};
	
	var asyncPress = false;
	var asyncRelease = false;
	
	function keyDown(c, evt){
		asyncPress = true;
		switch(evt.keyCode) {
			case c.leftKey :
				c.isPressing.l = true;
				c.isHolding.l = true;
				break;
			case c.rightKey :
				c.isPressing.r = true;
				c.isHolding.r = true;
				break;
			case c.upKey :
				c.isPressing.u = true;
				c.isHolding.u = true;
				break;
			case c.downKey :
				c.isPressing.d = true;
				c.isHolding.d = true;
				break;
			case c.aKey :
				c.isPressing.a = true;
				c.isHolding.a = true;
				break;
			case c.bKey :
				c.isPressing.b = true;
				c.isHolding.b = true;
				break;
			case c.startKey :
				c.isPressing.s = true;
				c.isHolding.s = true;
				break;
		}
	}//used for movement
 
	function keyUp(c, evt){
		asyncRelease = true;
		switch(evt.keyCode) {
			case c.leftKey :
				c.isReleasing.l = true;
				c.isHolding.l = false;
				break;
			case c.rightKey :
				c.isReleasing.r = true;
				c.isHolding.r = false;
				break;
			case c.upKey :
				c.isReleasing.u = true;
				c.isHolding.u = false;
				break;
			case c.downKey :
				c.isReleasing.d = true;
				c.isHolding.d = false;
				break;
			case c.aKey :
				c.isReleasing.a = true;
				c.isHolding.a = false;
				break;
			case c.bKey :
				c.isReleasing.b = true;
				c.isHolding.b = false;
				break;
			case c.startKey :
				c.isReleasing.s = true;
				c.isHolding.s = false;
				break;
		}
	}//same as keydown
	
	this.update = function() {
		//ensure isPressing only lasts one frame
		//TODO fix this. does not handle case when buttons pressed in succession once per frame
		if (!asyncPress) {
			this.isPressing.l = false;
			this.isPressing.r = false;
			this.isPressing.u = false;
			this.isPressing.d = false;
			this.isPressing.a = false;
			this.isPressing.b = false;
			this.isPressing.s = false;
		}
		else {
			asyncPress = false;
		}
		if (!asyncRelease) {
			this.isReleasing.l = false;
			this.isReleasing.r = false;
			this.isReleasing.u = false;
			this.isReleasing.d = false;
			this.isReleasing.a = false;
			this.isReleasing.b = false;
			this.isReleasing.s = false;
		}
		else {
			asyncRelease = false;
		}
	}

	document.addEventListener('keydown',(evt => keyDown(this, evt)));
	document.addEventListener('keyup',(evt => keyUp(this, evt)));
}