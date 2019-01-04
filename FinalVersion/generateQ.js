//builds the code used at the beginning of tile.js

function printQ (m, n) {
	var Q = new Map();
	var Q_ = [];
	
	for (var i = m; i <= n; ++i) {
		for (var j = m; j <= n; ++j) {
			if (!Q.has(i/j)) {
				Q.set(i/j, [i/j, i, j]);
			}
		}
	}
	
	Q.forEach(function(value, key, map) {Q_.push(value)});
	Q_.sort((a, b) => (a[0] - b[0]));
	
	var str = "const Q_" + m + "_" + n + " = \n[";
	for (var i = 0; i < Q_.length - 1; ++i) {
		str += "[" + Q_[i][1] + "/" + Q_[i][2] + ", " + Q_[i][1] + ", " + Q_[i][2] + "],\n";
	}
	str += "[" + Q_[Q_.length-1][1] + "/" + Q_[Q_.length-1][2] + ", " + Q_[Q_.length-1][1] + ", " + Q_[Q_.length-1][2] + "]];\n\n"
	return str;
}

var Qstr = "";
for (var j = 2; j <= 10; ++j) {
	for (var i = 1; i < j; ++i) {
  	Qstr += printQ(i, j);
  }
}

Qstr += "\n\nvar Q = new Map();\n";

for (var j = 2; j <= 10; ++j) {
	for (var i = 1; i < j; ++i) {
  	Qstr += "Q.set ('" + i + "_" + j + "', " + "Q_" + i + "_" + j + ");\n"
  }
}

console.log(Qstr);