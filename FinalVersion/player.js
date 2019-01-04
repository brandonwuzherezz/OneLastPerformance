"use strict";

function BulletList() {
	this.bulletmap = new Set();
	
	this.insert = function(b) {
		this.bulletmap.add(b);
	}
	
	this.delete = function(b) {
		this.bulletmap.delete(b);
	}
	
	this.draw = function(gamestate) {
		this.bulletmap.forEach(function(b) {
			b.draw(gamestate);
		});
	}
	
	this.update = function(gamestate) {
		this.bulletmap.forEach(function(b) {
			b.update();
			b.subOffscreen(gamestate);
		});
	}
}

function PlayerBullet(_x, _y, width = 15, height = 40, speed = 20){
	var bulletImage = new Image();
	bulletImage.src="http://people.ucsc.edu/~bsamudio/FinalGame120/bolt.png";

	this.tag = "bullet";
	this.position = {x:_x-10, y: _y-20};
	this.width = width;
	this.height = height;
	this.speed = speed;
	
	this.subOffscreen = function(gamestate) {
		if (this.position.x < 0 || this.position.x > gamestate.canvas.width ||
			this.position.y < 0 || this.position.y > gamestate.canvas.height) {
			gamestate.activeBulletList.delete(this);
		}
	}
	
	this.draw = function(gamestate){
		gamestate.context.drawImage(bulletImage, this.position.x, this.position.y, this.width, this.height);
	}
	
	this.update = function(){
		this.position.y -= this.speed;
	}
}//end of bullet function

function Player(_x = 0, _y = 0, width =50, height = 50, speed = 7, focusSpeed = 4, rateOfFire = 10){
	
	var playerSpriteSheet = new SpriteSheet(
	"SpriteSheet.png", //src
	128, 128, //width and height of frames
	20, //animation speed
	1 //frames per animation
	);
	
	
	var playerImage = new Image();
	playerImage.src="https://i402.photobucket.com/albums/pp101/Tumer/Prince-2000x1250_zpshckamhy2.png";
	
	var explosionImage = document.createElement("img"),
	imageUrl = "http://i402.photobucket.com/albums/pp101/Tumer/metalslug_zpsjtrdg5wm.gif";
	explosionImage.src = imageUrl; //TODO WHY IS IT LIKE THIS?
	

	
	this.tag= "player";
	this.position = {x:_x, y:_y};
	this.prevPosition = {x:_x, y:_y};
	this.width = width;
	this.height = height;
	this.hitboxWidth = 0.25 * width;
	this.hitboxHeight = 0.25 * height;
	this.direction;
	this.speed = speed;
	this.focusSpeed = focusSpeed;
	this.rof = rateOfFire;
	this.cooldown = 0;
	this.collisionSide = "none";
	this.isColliding = false;
	this.collidedWith = null;
	this.explode = false;
	
	this.isAlive=true;
	this.spawnTimer=0;
    this.isExploding=false;
    
	
	function playerObstacleCollide(c) {
		var obstacle = c.collidedWith;
		switch (c.collisionSide) {
			case "top" :
				c.position.y = Math.min(obstacle.position.y, obstacle.position.y + obstacle.direction.y * obstacle.speed);
				break;
			case "bottom" :
				c.position.y = Math.max(obstacle.position.y + obstacle.height, obstacle.position.y + obstacle.height + obstacle.direction.y * obstacle.speed);
				break;
			case "left" :
				c.position.x = Math.min(obstacle.position.x, obstacle.position.x + obstacle.direction.x * obstacle.speed);
				break;
			case "right" :
				c.position.x = Math.max(obstacle.position.x + obstacle.height, obstacle.position.x + obstacle.height + obstacle.direction.x * obstacle.speed);
				break;
			case "none" :
				//leave position as is
				break;
			default :
				throw "error: player is in collision routine but has collisionSide marked as " + c.collisionSide;
				break;
		}
	}

	this.draw = function(gamestate, input){
		playerSpriteSheet.draw(gamestate, this.position.x - this.width/2, this.position.y - this.height/2, this.width, this.height);

		//draw explosion graphics
		if (this.explode){
			if(this.isExploding){
				gamestate.context.drawImage(explosionImage, this.position.x - this.width/2, this.position.y - this.height/2, 50, 60);
			}
		}	
		//restart screen

		if (input.isHolding.b) {
			gamestate.context.globalCompositeOperation = "overlay";
			gamestate.fillStyle = "#A0A0FF";
			gamestate.context.beginPath();
			gamestate.context.arc(this.position.x, this.position.y, this.height / 2, 0, 2*Math.PI);
			gamestate.context.fill();
		    gamestate.context.globalCompositeOperation = "source-over";
	    /*  gamestate.fillStyle = "	#FF0000";
		    gamestate.strokeStyle= "	#FF0000";
			gamestate.context.beginPath();
			gamestate.context.arc(this.position.x, this.position.y, 5, 0, 2*Math.PI);
			gamestate.context.fill();*/
            return;
		}
	}//basic draw replace with image later
 
	this.update = function(gamestate, input){
		const sqrt2inv = 1.0/Math.sqrt(2);

		playerObstacleCollide(this);
		
		if (this.explode && this.isAlive) {
			if(!this.isExploding){//if respawn is false
				gamestate.health--;//lower health
				this.isExploding = true;//can respawn
				//if no more health
				if(gamestate.health==0){
					this.isAlive=false;//alive is false
					this.spawnTimer++;//spawntimer start
					return;
				}
			}
			this.spawnTimer++;//spawn timer add one
		}//end of this explode
		
		//respawns after spawn timer = ture and isExploding is true
		if (this.isExploding && this.spawnTimer == 10){
			if (this.isAlive == true){
			//makes a new player
			gamestate.activePlayer = new Player(gamestate.canvas.width/2, gamestate.canvas.height/2);
			this.spawnTimer = 0;
			this.isExploding = false;
			this.explode = false;
			 if(gamestate.score>0){
			  gamestate.score-=100;
			 }
			}
		}
		//if spawn timer isnt 10 return
		if(this.isAlive && this.isExploding){
			return;
		}
		
		//restart function for health =0
		if(this.isAlive == false){
			if(input.isPressing.a){
				gamestate.activePlayer = new Player(gamestate.canvas.width/2, gamestate.canvas.height/2);
		   
				gamestate.doLevelTransition = 0;
		        gamestate.score = 0;
				this.isAlive = true;
				this.explode = false;
				this.spawnTimer = 0;
				return;
			}
			this.spawnTimer++;
			return;
		}//end of alive

		var currspeed = (input.isHolding.b) ? this.focusSpeed : this.speed;
		
		this.direction = {x:0, y:0};
		this.direction.x += (input.isHolding.l) ? -1 : 0;
		this.direction.x += (input.isHolding.r) ? 1 : 0;
		this.direction.y += (input.isHolding.u) ? -1 : 0;
		this.direction.y += (input.isHolding.d) ? 1 : 0;
		
		if (this.direction.x != 0 && this.direction.y != 0) {
			this.direction.x *= sqrt2inv;
			this.direction.y *= sqrt2inv;
		}
		
		this.prevPosition.x = this.position.x;
		this.prevPosition.y = this.position.y;
		this.position.x += currspeed * this.direction.x;
		this.position.y += currspeed * this.direction.y;
		this.position.x = Math.max(gamestate.largeBorder, Math.min(gamestate.canvas.width - gamestate.largeBorder, this.position.x));
		this.position.y = Math.max(gamestate.largeBorder, Math.min(gamestate.canvas.height - gamestate.largeBorder, this.position.y));
				
				var animFrame;
		if (this.direction.y == 0) {
			animFrame = (this.direction.x == 0) ? 0 :
						(this.direction.x < 0) ? 2 : 3;
		}
		else {
			animFrame = (this.direction.y > 0) ? 1 : 0;
		}
		playerSpriteSheet.update(animFrame);
		
		if (input.isPressing.a) {
			this.cooldown = 0;
		}
		if (input.isHolding.a) {
			if (this.cooldown == 0) {
				this.cooldown = this.rof;
				gamestate.activeBulletList.insert(new PlayerBullet (this.position.x, this.position.y));
			}
			this.rof -= 1;
		}
	}
	
	this.toQuad = function(qt) {
		qt.insert(this);
	}
}//end of player function