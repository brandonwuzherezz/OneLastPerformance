//HELPER FUNCTIONS FOR GEOMETRIC CALCULATIONS (USED BY COLLISION FUNCTIONS)

var nop = function(a, b){};

var Xmath = {	
	sgn : function(x) {
		if (x > 0) return 1;
		return -1;
	},
	
	vPlus : function(p, q) {
		return {x:p.x + q.x, y:p.y + q.y};
	},
	
	vMinus : function(p, q) {
		return {x:p.x - q.x, y:p.y - q.y};
	},
	
	vScale : function(s, p) {
		return {x:s*p.x, y:s*p.y};
	},
	
	vNeg : function(p) {
		return {x:-p.x, y:-p.y};
	},
	
	vNormSq : function(p) {
		return Math.pow(p.x, 2) + Math.pow(p.y, 2);
	},
	
	vNorm : function(p) {
		return Math.sqrt(Xmath.vNormSq(p));
	},
	
	vDistSq : function(p, q) {
		return Xmath.vNormSq(Xmath.vMinus(p, q));
	},
	
	vDist : function(p, q) {
		return Math.sqrt(Xmath.vDistSq(p,q));
	},
	
	vUnit : function(p) {
		return Xmath.vScale(1/Math.sqrt(Xmath.vNormSq(p)), p);
	},
	
	vUnitDir : function(p, q) {
		return Xmath.vUnit(Xmath.vMinus(p, q));
	},
	
	vNormUnitPair : function(p) {
		var s_ = Xmath.vNorm(p);
		return {s:s_, v:Xmath.vScale(1/s_, p)};
	}
}

var Xgeo = {
	//http://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
	onSegment : function(p, q, r) {
		if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
			q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
			return true;	
		}
		return false;
	},
	
	//http://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
	orientation : function(p, q, r) {
		var area = (q.y - p.y) * (r.x - q.x) -
				   (q.x - p.x) * (r.y - q.y);
		
		if (Math.abs(area) < 0.1) {
			return 0; //colinear
		}
		return (area > 0) ? 1 : 2; //cw or ccw
	},
	
	//http://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
	ifIntersection : function(p1, q1, p2, q2) { //segments ab, cd
		var o1 = Xgeo.orientation(p1, q1, p2);
		var o2 = Xgeo.orientation(p1, q1, q2);
		var o3 = Xgeo.orientation(p2, q2, p1);
		var o4 = Xgeo.orientation(p2, q2, q1);
		
		//console.log(o1);
		//console.log(o2);
		//console.log(o3);
		//console.log(o4);
		
		if (o1 != o2 && o3 != o4) return true;
		if (o1 == 0 && Xgeo.onSegment(p1, p2, q1)) return true;
		if (o2 == 0 && Xgeo.onSegment(p1, q2, q1)) return true;
		if (o3 == 0 && Xgeo.onSegment(p2, p1, q2)) return true;
		if (o4 == 0 && Xgeo.onSegment(p2, q1, q2)) return true;
		
		return false;
	},
	
	getBoxEdgeFromPointCollide : function(point, obstacle) {
		var currLeft = (point.position.x > obstacle.position.x);
		var currRight = (point.position.x < obstacle.position.x + obstacle.width);
		var currTop = (point.position.y > obstacle.position.y);
		var currBottom = (point.position.y < obstacle.position.y + obstacle.height);

		//if there is a collision, find out which side of the obstacle we hit and give the point all relevant info
		if (currLeft & currRight & currTop & currBottom) {
			point.collidedWith = obstacle;
			point.isColliding = true;
			
			//only check segment-segment collision with those lines that could have been hit first
			//by doing that, there is only one of two possibilities for the side that was hit (one vertical and one horizontal)
			//and therefore we only have to check one of them by mutual exclusion
			var dirSwitch = 2 * Xmath.sgn(point.direction.y) + Xmath.sgn(point.direction.x);
			switch (dirSwitch) {
				case -3 : //nw
					point.collisionSide = 
					Xgeo.ifIntersection(point.prevPosition, point.position,
										{x: obstacle.position.x, y: obstacle.position.y + obstacle.height},
										{x: obstacle.position.x + obstacle.width, y: obstacle.position.y + obstacle.height}) ? 
					"bottom" : "right";
					break;
				case -1 : //ne
					point.collisionSide = 
					Xgeo.ifIntersection(point.prevPosition, point.position,
										{x: obstacle.position.x, y: obstacle.position.y + obstacle.height},
										{x: obstacle.position.x + obstacle.width, y: obstacle.position.y + obstacle.height}) ? 
					"bottom" : "left";
					break;
				case 1: //sw
					point.collisionSide = 
					Xgeo.ifIntersection(point.prevPosition, point.position,
										{x: obstacle.position.x, y: obstacle.position.y},
										{x: obstacle.position.x + obstacle.width, y: obstacle.position.y}) ? 
					"top" : "right";
					break;
				case 3: //se
					point.collisionSide = 
					Xgeo.ifIntersection(point.prevPosition, point.position,
										{x: obstacle.position.x, y: obstacle.position.y},
										{x: obstacle.position.x + obstacle.width, y: obstacle.position.y}) ? 
					"top" : "left";
					break;
				default:
					throw "dirswitch = " + dirswitch;
			}
		}
		//if there isn't a collision, pass that information to the sample point also
		else {
			point.collidedWith = null;
			point.isColliding = false;
			point.collisionSide = "none";
		}
		return point;
	},
	
	//TODO: ---- GO THROUGH AND DISTINGUISH BETWEEN WIDTH AND HITWIDTH, HEIGHT AND HITHEIGHT IN ALL RELEVANT CLASSES
	//THEN COME BACK AND CHANGE THESE WIDTH AND HEIGHT READS TO HITWIDTH AND HITHEIGHT READS
	ifPointBoxCollision : function(point, obstacle) {
		var currLeft = (point.position.x > obstacle.position.x);
		var currRight = (point.position.x < obstacle.position.x + obstacle.width);
		var currTop = (point.position.y > obstacle.position.y);
		var currBottom = (point.position.y < obstacle.position.y + obstacle.height);
		return (currLeft & currRight & currTop & currBottom);
	},
	
	ifBoxBoxCollision : function(obstacleA, obstacleB) {
		var currLeft = (obstacleA.position.x + obstacleA.width > obstacleB.position.x);
		var currRight = (obstacleA.position.x < obstacleB.position.x + obstacleB.width);
		var currTop = (obstacleA.position.y + obstacleA.height > obstacleB.position.y);
		var currBottom = (obstacleA.position.y < obstacleB.position.y + obstacleB.height);
		return (currLeft & currRight & currTop & currBottom);
	},
}