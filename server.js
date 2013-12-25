var	io = require('socket.io').listen(8089),
	fs = require('fs'),

	mysql = require('mysql'), cn = mysql.createConnection({
		host: 'localhost',
		user: 'ny14',
		password: 'CAesU51d/9Muz'
	}),

	express = require('express'),
	app = express();

app.get('/', function(req, res) { 
	if (req.query.mobile || req.headers['user-agent'].match(/iPhone|Android|Windows Phone/i)) {
		res.sendfile('mobile.html');
	} else {
		res.sendfile('index.html');
	}
});

app.use(express.static(__dirname));

app.listen(8088);

io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('origins', '2014.studio38.ru:*');
// io.set('log level', 1);

var games = {}, players = {};

io.sockets.on('connection', function (socket) {
	socket.on('newGame', function() {
		var gameID;
		do {
			gameID = parseInt(getFloatRand(1000, 99999));
		} while (typeof games[gameID] != 'undefined');

		games[gameID] = {
			id: gameID,
			dbID: null,
			colors: ['green', 'red', 'blue', 'yellow'],
			players: {},
			socket: socket,
			started: false
		};

		socket.set('gameID', gameID);

		socket.emit('id', { id: gameID });
	});

	socket.on('newPlayer', function() {
		var playerID = 'i' + Math.random();

		players[playerID] = {
			socket: socket,
			gameID: null
		};

		socket.set('playerID', playerID);
		socket.emit('id', { id: playerID });
	});

	socket.on('disconnect', function() {
		socket.get('gameID', function(err, gameID) {
			if (!gameID) {
				socket.get('playerID', function(err, playerID) {
					// нужно узнать gameID у данного игрока, если оно есть
					// socket.emit('system' + gameID, { status: 'client-off', playerID: playerID });
					if (players[playerID] && players[playerID].gameID && games[players[playerID].gameID] && games[players[playerID].gameID].socket)
						games[players[playerID].gameID].socket.emit('system', { status: 'player-off', playerID: playerID });

					delete players[playerID];
				});
			} else {
				for (var i in games[gameID].players)
					if (players[i] && players[i].socket) players[i].socket.emit('system', { status: 'server-off' });

				delete games[gameID];
			}
		});
	});

	socket.on('joinGame', function(data) {
		if (!games[data.gameID]) {
			socket.emit('system', { status: 'no game' });
			return false;
		}

		if (Object.keys(games[data.gameID].players).length > 3 || games[data.gameID].started) {
			socket.emit('system', { status: 'no places' });
			return false;
		}

		var color = games[data.gameID].colors.pop();
		games[data.gameID].players[data.playerID] = {
			color: color,
			playerID: data.playerID
		};

		players[data.playerID].gameID = data.gameID;
		socket.emit('system', { status: 'joined game', gameID: data.gameID, color: color });
		games[data.gameID].socket.emit('system', { player: games[data.gameID].players[data.playerID] });
	});
});

function getFloatRand(min, max) {
	return min + Math.random() * (max - min);
}
