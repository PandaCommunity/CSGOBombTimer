var http = require('http');
var fs = require('fs');
var io = require('socket.io')(1337);

var initialBomb = 0;
var menuSteamID = "";
var playerSide = "";

console.log("CS:GO Bomb Timer, by Ron Melkhior");
console.error("Remember to move the config to your CS:GO cfg folder.");
console.log("Initiating server...");

function now() {
	return Math.floor(new Date() / 1000);
}

http.createServer(function (req, res) {
	var body = "";
	var timerState = "";
	var gameState = "";
	req.on('data', function (chunk) {
		if (req.method == 'POST') {
			body += chunk;
		}
	});
	req.on('end', function () {
		parsedBody = JSON.parse(body);
		if (parsedBody.hasOwnProperty("player")) {
			if (parsedBody.player["activity"] == "menu") {
				menuSteamID = parsedBody.player["steamid"].toString();
				gameState = "I am currently in the CS:GO menu.";
			}
			if (parsedBody.player["activity"] == "playing") {
				if (parsedBody.player["steamid"].toString() == menuSteamID) {
					if (parsedBody.player["team"] == "T") {
						playerSide = "Terrorist";
					} else if (parsedBody.player["team"] == "CT") {
						playerSide = "Counter-Terrorist";
					}
				}
			}
		}
		if (parsedBody.hasOwnProperty("round")) {
			if (parsedBody.round["bomb"] == "planted") {
				var rightNow = now();
				var initialCheck = initialBomb + 41;
				if (rightNow > initialCheck) {
					initialBomb = now();
					timerState = "start";
				}
			}
		}
		if (parsedBody.hasOwnProperty("map")) {
			if (parsedBody.map["mode"] == "gungameprogressive") {
				mapPlayed = parsedBody.map["name"];
				gameState = "I am currently playing an Arms Race match on " + mapPlayed + " as a " + playerSide;
			} else if (parsedBody.map["mode"] == "deathmatch") {
				mapPlayed = parsedBody.map["name"];
				gameState = "I am currently playing a Deathmatch match on " + mapPlayed + " as a " + playerSide;
			} else if (parsedBody.map["mode"] == "gungametrbomb") {
				mapPlayed = parsedBody.map["name"];
				terrorScore = parsedBody.map.team_t["score"];
				ctScore = parsedBody.map.team_ct["score"];
				if (terrorScore > ctScore) {
					if (playerSide == "Terrorist") {
						gameState = "I am currently winning a Demolition match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
					} else if (playerSide == "Counter-Terrorist") {
						gameState = "I am currently losing a Demolition match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
					}
				} else if (ctScore > terrorScore) {
					if (playerSide == "Terrorist") {
						gameState = "I am currently losing a Demolition match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
					} else if (playerSide == "Counter-Terrorist") {
						gameState = "I am currently winning a Demolition match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
					}
				} else if (ctScore == terrorScore) {
					if (ctScore == 0) {
						if (playerSide == "Terrorist") {
							gameState = "I am currently starting a Demolition match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
						} else if (playerSide == "Counter-Terrorist") {
							gameState = "I am currently starting a Demolition match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
						}
					} else {
						if (playerSide == "Terrorist") {
							gameState = "I am currently tying a Demolition match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
						} else if (playerSide == "Counter-Terrorist") {
							gameState = "I am currently tying a Demolition match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
						}
					}
				}
			} else if (parsedBody.map["mode"] == "casual") {
				mapPlayed = parsedBody.map["name"];
				terrorScore = parsedBody.map.team_t["score"];
				ctScore = parsedBody.map.team_ct["score"];
				if (terrorScore > ctScore) {
					if (playerSide == "Terrorist") {
						gameState = "I am currently winning a Casual match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
					} else if (playerSide == "Counter-Terrorist") {
						gameState = "I am currently losing a Casual match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
					}
				} else if (ctScore > terrorScore) {
					if (playerSide == "Terrorist") {
						gameState = "I am currently losing a Casual match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
					} else if (playerSide == "Counter-Terrorist") {
						gameState = "I am currently winning a Casual match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
					}
				} else if (ctScore == terrorScore) {
					if (ctScore == 0) {
						if (playerSide == "Terrorist") {
							gameState = "I am currently starting a Casual match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
						} else if (playerSide == "Counter-Terrorist") {
							gameState = "I am currently starting a Casual match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
						}
					} else {
						if (playerSide == "Terrorist") {
							gameState = "I am currently tying a Casual match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
						} else if (playerSide == "Counter-Terrorist") {
							gameState = "I am currently tying a Casual match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
						}
					}
				}
			} else if (parsedBody.map["mode"] == "competitive") {
				mapPlayed = parsedBody.map["name"];
				terrorScore = parsedBody.map.team_t["score"];
				ctScore = parsedBody.map.team_ct["score"];
				if (terrorScore > ctScore) {
					if (playerSide == "Terrorist") {
						gameState = "I am currently winning a Competitive match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
					} else if (playerSide == "Counter-Terrorist") {
						gameState = "I am currently losing a Competitive match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
					}
				} else if (ctScore > terrorScore) {
					if (playerSide == "Terrorist") {
						gameState = "I am currently losing a Competitive match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
					} else if (playerSide == "Counter-Terrorist") {
						gameState = "I am currently winning a Competitive match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
					}
				} else if (ctScore == terrorScore) {
					if (ctScore == 0) {
						if (playerSide == "Terrorist") {
							gameState = "I am currently starting a Competitive match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
						} else if (playerSide == "Counter-Terrorist") {
							gameState = "I am currently starting a Competitive match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
						}
					} else {
						if (playerSide == "Terrorist") {
							gameState = "I am currently tying a Competitive match (" + terrorScore + "-" + ctScore + ") as a Terrorist on " + mapPlayed;
						} else if (playerSide == "Counter-Terrorist") {
							gameState = "I am currently tying a Competitive match (" + ctScore + "-" + terrorScore + ") as a Counter-Terrorist on " + mapPlayed;
						}
					}
				}
			}
		}
		
		var updateArray = {timer:timerState, gamestring:gameState};
		jsonUpdate = JSON.stringify(updateArray);
		io.emit('update', jsonUpdate);
	});
	
	
}).listen(3000);
console.error("Script fully initiated...");