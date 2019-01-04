"use strict";

var disc = fireSpread(Math.PI* 3/2, Math.PI/2, 5, 2, new Enemy(0, 0, 10, 10, nop, nop, 30, false));
var cont = moveDirectional(1, 0, 2);

var leveldata = {};
leveldata.length = 2;
//first level
leveldata[0] = {};
leveldata[0].backgroundImage = new Image();
leveldata[0].backgroundImage.src = "http://people.ucsc.edu/~bsamudio/FinalGame120/clouds.jpg";
leveldata[0].obstacleImageSrc = "cloudsTexSmall.png";
leveldata[0].enemyTimeline = new EnemyTimeline(
  125,
	{initX:150, initY:50, width:50, height:50, discreteBehavior:disc, continuousBehavior:fmany(moveFixed(0, 4), moveSinusoidal(20, 10, 0, 1)), beatInterval:30, canExplode:true, src:defaultEnemyImageSrc},
  25,
  {initX:300, initY:50, width:50, height:50, discreteBehavior:disc, continuousBehavior:moveFixed(-1, 2), beatInterval:30, canExplode:true, src:defaultEnemyImageSrc},
  25,
  {initX:150, initY:50, width:50, height:50, discreteBehavior:disc, continuousBehavior:moveFixed(1, 2), beatInterval:30, canExplode:true, src:defaultEnemyImageSrc},
	25,
	{initX:300, initY:50, width:50, height:50, discreteBehavior:disc, continuousBehavior:moveFixed(-1, 2), beatInterval:30, canExplode:true, src:defaultEnemyImageSrc},
  50,
  {initX:412, initY:50, width:50, height:50, discreteBehavior:disc, continuousBehavior:moveFixed(-2, 0), beatInterval:30, canExplode:true, src:defaultEnemyImageSrc},//2
  25,
  {initX:125, initY:50, width:50, height:50, discreteBehavior:disc, continuousBehavior:moveFixed(2, 0), beatInterval:30, canExplode:true, src:defaultEnemyImageSrc},//3
  25,
  {initX:125, initY:50, width:50, height:50, discreteBehavior:disc, continuousBehavior:moveFixed(2, 0), beatInterval:30, canExplode:true, src:defaultEnemyImageSrc},//4
  250,
  {initX:0, initY:50, width:50, height:50, discreteBehavior:fireSingle(new Enemy(0, 0, 10, 10, nop, moveFixed(0, 5))), continuousBehavior:moveFixed(2, 1), beatInterval:30, canExplode:true, src:defaultEnemyImageSrc},//5
  25,
  {initX:462, initY:50, width:50, height:50, discreteBehavior:fireSingle(new Enemy(0, 0, 10, 10, nop, moveFixed(0, 5))), continuousBehavior:moveFixed(-2, 1), beatInterval:30, canExplode:true, src:defaultEnemyImageSrc},//6
  25,
  {initX:0, initY:50, width:50, height:50, discreteBehavior:fireSingle(new Enemy(0, 0, 10, 10, nop, moveFixed(0, 5))), continuousBehavior:moveFixed(2, 1), beatInterval:30, canExplode:true, src:defaultEnemyImageSrc}//7
);

leveldata[0].obstacleTimeline = new ObstacleTimeline(
  //{initX:0, initY:-2000, directionX:0, directionY:1, speed:2, width:50, height:3000},//left wall
  //{initX:462, initY:-2000, directionX:0, directionY:1, speed:2, width:50, height:3000},//right wall
  {initX:0, initY:-50, directionX:0, directionY:1, speed:2, width:150, height:50},//1
  {initX:362, initY:-100, directionX:0, directionY:1, speed:2, width:150, height:100},//2
  50,
  {initX:150, initY:-100, directionX:0, directionY:1, speed:2, width:50, height:100},//3
  25,
  {initX:100, initY:-50, directionX:0, directionY:1, speed:2, width:50, height:50},//4
  25,
  {initX:437, initY:-150, directionX:0, directionY:1, speed:2, width:75, height:150},//5
  50,
  //{initX:-150, initY:-50, directionX:1, directionY:0, speed:2, width:150, height:50},//6
  50,
  {initX:75, initY:-100, directionX:0, directionY:1, speed:2, width:75, height:100},//7
  {initX:0, initY:-250, directionX:0, directionY:1, speed:2, width:75, height:250},//extra 1
  25,
  //{initX:256+150, initY:-50, directionX:1, directionY:0, speed:2, width:150, height:50},//8
  50,
  {initX:462, initY:-50, directionX:0, directionY:1, speed:2, width:50, height:50},//9
  25,
  {initX:412, initY:-50, directionX:0, directionY:1, speed:2, width:100, height:50},//extra 2
  50,
  {initX:0, initY:-125, directionX:0, directionY:1, speed:2, width:100, height:125},//10
  25,
  {initX:256, initY:-200, directionX:0, directionY:1, speed:2, width:50, height:200},//11
  {initX:412, initY:-100, directionX:0, directionY:1, speed:2, width:100, height:100},//12
  50,
  {initX:0, initY:-50, directionX:0, directionY:1, speed:2, width:175, height:50},//13
  {initX:437, initY:-75, directionX:0, directionY:1, speed:2, width:75, height:75},//14
  125,
  //{initX:-250, initY:50, directionX:1, directionY:0, speed:3, width:250, height:150},//17
  25,
  //{initX:606, initY:50, directionX:-1, directionY:0, speed:3, width:250, height:150},//18
  25,
  //{initX:256, initY:50, directionX:1, directionY:0, speed:3, width:250, height:150},//19
  50,
  {initX:0, initY:-100, directionX:0, directionY:1, speed:2, width:100, height:100},//20
  25,
  {initX:412, initY:-150, directionX:0, directionY:1, speed:2, width:100, height:150},//21
  25,
  {initX:287, initY:-150, directionX:0, directionY:1, speed:2, width:125, height:150},//22
  50,
  {initX:0, initY:-50, directionX:0, directionY:1, speed:2, width:200, height:50},//23
  25,
  {initX:362, initY:-150, directionX:0, directionY:1, speed:2, width:150, height:150},//24
  100
);

leveldata[0].music=new Howl({//Brandon
	urls: ['http://people.ucsc.edu/~bsamudio/Prince%20.mp3'],
	volume:0.45,
	buffer:true,
	loop:true
});
leveldata[0].health=3;

//second level

leveldata[1] = {};
leveldata[1].backgroundImage = new Image();
leveldata[1].backgroundImage.src = "bg1.jpg";
leveldata[1].obstacleImageSrc = "spaceTexSmall.png";
leveldata[1].enemyTimeline = new EnemyTimeline(
	60,
	
	{initX:562, initY:100, width:50, height:50,
		discreteBehavior: fireSingle(new Enemy(0, 0, 50, 50, nop, moveDirectional(0, 1, 10), 30, false)),
		continuousBehavior: moveDirectional(-1, 0, 4),
		beatInterval:15, canExplode:true, src:defaultEnemyImageSrc
	},
	
	30,
	
	{initX:0, initY:150, width:50, height:50,
		discreteBehavior: fireSingle(new Enemy(0, 0, 50, 50, nop, moveDirectional(0, 1, 10), 30, false)),
		continuousBehavior: moveDirectional(1, 0, 4),
		beatInterval:15, canExplode:true, src:defaultEnemyImageSrc
	},
	{initX:562, initY:200, width:50, height:50,
		discreteBehavior: fireSingle(new Enemy(0, 0, 50, 50, nop, moveDirectional(0, 1, 10), 30, false)),
		continuousBehavior: moveDirectional(-1, 0, 4),
		beatInterval:15, canExplode:true, src:defaultEnemyImageSrc
	},
	
	75,
	
	{initX:0, initY:462, width:100, height:100,
		discreteBehavior: nop,
		continuousBehavior: moveWithAccel(0,-1, 1, 10, .5),
		beatInterval:30, canExplode:true, src:defaultEnemyImageSrc
	},
	{initX:100, initY:462, width:100, height:100,
		discreteBehavior: nop,
		continuousBehavior: moveWithAccel(0,-1, 1, 10, .5),
		beatInterval:30, canExplode:true, src:defaultEnemyImageSrc
	},
	{initX:412, initY:462, width:100, height:100,
		discreteBehavior: nop,
		continuousBehavior: moveWithAccel(0,-1, 1, 10, .5),
		beatInterval:30, canExplode:true, src:defaultEnemyImageSrc
	},
	{initX:312, initY:462, width:100, height:100,
		discreteBehavior: nop,
		continuousBehavior: moveWithAccel(0,-1, 1, 10, .5),
		beatInterval:30, canExplode:true, src:defaultEnemyImageSrc
	},
	
	20,
	
	{initX:200, initY:462, width:112, height:112,
		discreteBehavior: fmany(fireSingle(new Enemy(0, 0, 50, 50, nop, moveDirectional(1,0,15), 30, false)),
								fireSingle(new Enemy(0, 0, 50, 50, nop, moveDirectional(-1,0,15), 30, false))),
		continuousBehavior: moveWithAccel(0,-1, 1, 8, .5),
		beatInterval:15, canExplode:true, src:defaultEnemyImageSrc
	},
	
	30,
	
	{initX:50, initY:256, width:50, height:50,
		discreteBehavior: nop,
		continuousBehavior: fmany(moveFixed(4, 0), moveSinusoidal(30, 40, 1, 0)),
		beatInterval:45, canExplode:true, src:defaultEnemyImageSrc
	},
	{initX:562, initY:256, width:50, height:50,
		discreteBehavior: nop,
		continuousBehavior: fmany(moveFixed(-4, 0), moveSinusoidal(30,-40, 1, 0)),
		beatInterval:45, canExplode:true, src:defaultEnemyImageSrc
	},
	
	120,
	
	{initX:50, initY:462, width:100, height:100,
		discreteBehavior: fireSingle(new Enemy(0, 0, 50, 50, nop, moveDirectional(1,0,15), 30, false)),
		continuousBehavior: moveWithAccel(0,-1, 1, 8, .5),
		beatInterval:15, canExplode:true, src:defaultEnemyImageSrc
	},
	
	{initX:362, initY:462, width:100, height:100,
		discreteBehavior: fireSingle(new Enemy(0, 0, 50, 50, nop, moveDirectional(-1,0,15), 30, false)),
		continuousBehavior: moveWithAccel(0,-1, 1, 8, .5),
		beatInterval:15, canExplode:true, src:defaultEnemyImageSrc
	},
	
	100,
	
	{initX:-50, initY:206, width:50, height:50,
		discreteBehavior: fmany(fireSingle(new Enemy(0, 0, 25, 25, nop, moveDirectional(0,1,15), 30, false)),
								fireSingle(new Enemy(0, 0, 25, 25, nop, moveDirectional(0,-1,15), 30, false))),
		continuousBehavior: moveWithAccel(1, 0, 1, 8, .5),
		beatInterval:15, canExplode:true, src:defaultEnemyImageSrc
	},
	{initX:562, initY:206, width:50, height:50,
		discreteBehavior: fmany(fireSingle(new Enemy(0, 0, 25, 25, nop, moveDirectional(0,1,15), 30, false)),
								fireSingle(new Enemy(0, 0, 25, 25, nop, moveDirectional(0,-1,15), 30, false))),
		continuousBehavior: moveWithAccel(-1, 0, 1, 8, .5),
		beatInterval:15, canExplode:true, src:defaultEnemyImageSrc
	},
	
	100,
	
	{initX:206, initY:-100, width:100, height:100,
		discreteBehavior: fireSpread(Math.PI* 3/2, Math.PI/2, 5, 2, new Enemy(0, 0, 50, 50, nop, nop, 30, false)),
		continuousBehavior: fmany(moveFixed(0, 4), moveSinusoidal(30, 40, 0, 1)),
		beatInterval:45, canExplode:true, src:defaultEnemyImageSrc
	}
);

leveldata[1].obstacleTimeline = new ObstacleTimeline(
	{initX:-50, initY:0, directionX:0, directionY:1, speed:4, width:100, height:500},
	{initX:462, initY:0, directionX:0, directionY:1, speed:4, width:100, height:500},
	{initX:-50, initY:-500, directionX:0, directionY:1, speed:4, width:100, height:500},
	{initX:462, initY:-500, directionX:0, directionY:1, speed:4, width:100, height:500},
	125,
	{initX:-50, initY:-500, directionX:0, directionY:1, speed:4, width:100, height:500},
	{initX:462, initY:-500, directionX:0, directionY:1, speed:4, width:100, height:500},
	125,
	{initX:-50, initY:-400, directionX:0, directionY:1, speed:4, width:100, height:400},
	{initX:462, initY:-400, directionX:0, directionY:1, speed:4, width:100, height:400},
	{initX:50, initY:-75, directionX:0, directionY:1, speed:4, width:150, height:50},
	{initX:312, initY:-75, directionX:0, directionY:1, speed:4, width:150, height:50},
	50,
	{initX:128, initY:-75, directionX:0, directionY:1, speed:4, width:256, height:50},
	50,
	{initX:-50, initY:-400, directionX:0, directionY:1, speed:4, width:100, height:400},
	{initX:462, initY:-400, directionX:0, directionY:1, speed:4, width:100, height:400},
	{initX:50, initY:-75, directionX:0, directionY:1, speed:4, width:150, height:50},
	{initX:312, initY:-75, directionX:0, directionY:1, speed:4, width:150, height:50},
	50,
	{initX:128, initY:-75, directionX:0, directionY:1, speed:4, width:256, height:50},
	{initX:50, initY:582, directionX:0, directionY:-1, speed:4, width:150, height:50},
	{initX:312, initY:582, directionX:0, directionY:-1, speed:4, width:150, height:50},
	50,
	{initX:-50, initY:-400, directionX:0, directionY:1, speed:4, width:100, height:400},
	{initX:462, initY:-400, directionX:0, directionY:1, speed:4, width:100, height:400},
	{initX:50, initY:-75, directionX:0, directionY:1, speed:4, width:150, height:50},
	{initX:312, initY:-75, directionX:0, directionY:1, speed:4, width:150, height:50},
	{initX:128, initY:582, directionX:0, directionY:-1, speed:4, width:256, height:50},
	50,
	{initX:128, initY:-75, directionX:0, directionY:1, speed:4, width:256, height:50},
	{initX:50, initY:582, directionX:0, directionY:-1, speed:4, width:150, height:50},
	//{initX:312, initY:582, directionX:0, directionY:-1, speed:4, width:150, height:50},
	50,
	{initX:-50, initY:-500, directionX:0, directionY:1, speed:4, width:100, height:500},
	{initX:462, initY:-500, directionX:0, directionY:1, speed:4, width:100, height:500},
	{initX:50, initY:-75, directionX:0, directionY:1, speed:4, width:150, height:50},
	{initX:312, initY:-75, directionX:0, directionY:1, speed:4, width:150, height:50},
	{initX:128, initY:582, directionX:0, directionY:-1, speed:4, width:256, height:50},
	125,
	{initX:-50, initY:-500, directionX:0, directionY:1, speed:4, width:100, height:500},
	{initX:462, initY:-500, directionX:0, directionY:1, speed:4, width:100, height:500},
	50
);

leveldata[1].music=new Howl({//Brandon
	urls: ['http://people.ucsc.edu/~bsamudio/Prince%20.mp3'],
	volume:0.45,
	buffer:true,
	loop:true
});
leveldata[1].health=3;

var gameState;

var MainMenu=true;

function init() {
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	gameState = new GameState(canvas, context, leveldata);
	//we need to update once before drawing
	//since the first update defines a bunch of fields used by the draw functions
	gameState.update();
	setInterval(main, 30);
//	document.addEventListener('keydown',evt => main());
}
function main() {
	//however, after that, we go back to calling draw before update
	//this is due to the way that player-obstacle collision is handled
	if(MainMenu==true){
	 gameState.MainMenuDraw();
		if(gameState.input.isPressing.a){
			return MainMenu=false;
		}
	}
	else{
		gameState.draw();
		gameState.update();
	}
}