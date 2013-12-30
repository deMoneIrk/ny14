var	io = require('socket.io').listen(8089),
	fs = require('fs'),

	mysql = require('mysql'), cn, dbConf = {
		host: 'localhost',
		user: 'ny14',
		database: 'ny14',
		password: 'CAesU51d/9Muz'
	},

	express = require('express'),
	app = express(),

	auth = require('connect-auth'),
	oauth = require('oauth').OAuth2,
	userSessions = { line: {}, back: {} };

function handleDisconnect() {
	cn = mysql.createConnection(dbConf);

	cn.connect(function(err) {
		if(err) {
			setTimeout(handleDisconnect, 2000);
		}
	});

	cn.on('error', function(err) {
		console.log('db error', err);
		if(err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});
}
handleDisconnect();

app.configure(function () {
	app.use(express.cookieParser('2Zy2pGu2W6tcT9uKiYiG914SEcviEyGo'));
	app.use(express.session({ secret: '2Zy2pGu2W6tcT9uKiYiG914SEcviEyGo' }));
	app.use(auth([
		auth.Facebook({ appId: '678145028883515', appSecret: '452b01ca73a387988d3d170be7b64277', scope: "email", callback: 'http://2014.studio38.ru/facebook' })
	]));
});

app.get('/facebook', function(req, res) {
	req.authenticate(['facebook'], function(error, authenticated) {
		if (authenticated) {
			var oa = new oauth('678145028883515', '452b01ca73a387988d3d170be7b64277', 'https://graph.facebook.com');
			oa._request('GET', 'https://graph.facebook.com/me?fields=id,name,gender,location,email,picture.width(100).height(100)', {}, '',
				req.session.access_token, function(err, data, result) {
				if (!error) {
					var d = JSON.parse(data);
					cn.query('SELECT id, name, photo FROM users WHERE facebook_id = ?', [d.id], function(err, result) {
						if (!result.length) {
							var pic = (d.picture && d.picture.data && d.picture.data.url) ? d.picture.data.url : '', loc = d.location && d.location.name ? d.location.name : '';
							cn.query('INSERT INTO users (facebook_id, name, photo, gender, email, location, created, first_login, invited_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)', [
								d.id, d.name, pic, d.gender == 'male' ? 'm' : 'f', d.email, loc, new Date(), new Date()
							], function(err, result) {
								if (err) throw err;

								req.session.userID = result.insertId;
								req.session.userPic = pic;
								req.session.userName = d.name;
								res.end('<script type="text/javascript">top.location.href="/";</script>');
							});
						} else {
							req.session.userID = result[0].id;
							req.session.userPic = result[0].photo;
							req.session.userName = result[0].name;

							cn.query('UPDATE users SET email = ?, last_login = ? WHERE id = ?', [d.email, new Date(), result[0].id]);
							res.end('<script type="text/javascript">top.location.href="/";</script>');
						}
					});
				}
			});

			oa._request('GET', 'https://graph.facebook.com/me/friends?fields=id,name,gender,location,picture.width(100).height(100)&limit=1000', {}, '',
				req.session.access_token, function(err, data, result) {
				var d = JSON.parse(data);

				if (!d.data) return false;
				d = d.data;

				for (var i in d) {
					if (!d[i].id) continue;

					var pic = (d[i].picture && d[i].picture.data && d[i].picture.data.url) ? d[i].picture.data.url : '', loc = d[i].location && d[i].location.name ? d[i].location.name : '';
					cn.query('INSERT INTO users (facebook_id, name, photo, gender, invited_by, location, created) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = id', [
						d[i].id, d[i].name, pic, d[i].gender == 'male' ? 'm' : 'f', req.session.auth.user.id, loc, new Date()
					]);
				}
			});
		} else {
			res.end('<script type="text/javascript">top.location.href="/";</script>');
		}
	});
});

app.get('/records.html', function(req, res) {
	cn.query('SELECT users.*, SUM(score) AS score FROM plays LEFT JOIN users ON plays.user_id = users.id GROUP BY user_id ORDER BY SUM(score) DESC LIMIT 0, 25', function(err, data) {
		var html = '', records = fs.readFileSync('records.html').toString();
		for (var i in data)
			html += '<tr><td>' + (parseInt(i) + 1) + '.</td><td><div class="avatar"><img src="' + data[i].photo + '" /></div></td><td>' + escapeHtml(data[i].name) + '</td><td><div>' + data[i].score + '</div></td></tr>';

		res.end(records.replace('#RECORDS#', html));
	});
});

app.get('/', function(req, res) {
	if (req.query.mobile || req.headers['user-agent'].match(/iPhone|Android|Windows Phone/i)) {
		var mobile = fs.readFileSync('mobile.html').toString();
		if (req.isAuthenticated()) {
			if (!userSessions.line[req.session.userID]) {
				userSessions.line[req.session.userID] = {
					name: req.session.userName,
					pic: req.session.userPic,
					iid: 'i' + Math.random()
				};

				userSessions.back[userSessions.line[req.session.userID].iid] = req.session.userID;
			}

			res.send(mobile.replace('#SCRIPT#', '<script type="text/javascript">window.iid = "' + userSessions.line[req.session.userID].iid + '";</script>'));
		} else {
			res.send(mobile.replace('#SCRIPT#', ''));
		}
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
	socket.on('iphone', function(data) {
		console.log(data);
	});

	socket.on('newGame', function() {
		var gameID;
		do {
			gameID = parseInt(getFloatRand(1, 10));
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

	socket.on('newPlayer', function(data) {
		var playerID = 'i' + Math.random().toString().substr(2);

		players[playerID] = {
			socket: socket,
			gameID: null
		};

		var res = { id: playerID };

		if (data.iid && userSessions.back[data.iid]) {
			players[playerID].iid = userSessions.back[data.iid];
			cn.query('UPDATE users SET last_login = ? WHERE id = ?', [new Date(), players[playerID].iid]);

			players[playerID].name = res.name = escapeHtml(userSessions.line[players[playerID].iid].name);
			players[playerID].pic = res.pic = userSessions.line[players[playerID].iid].pic;
		}

		socket.set('playerID', playerID);
		socket.emit('id', res);
	});

	socket.on('shot', function(data) {
		if (!games[data.gameID]) {
			socket.emit('system', { status: 'no game' });
			return false;
		}

		if (Object.keys(games[data.gameID].players).length > 3 || games[data.gameID].started) {
			socket.emit('system', { status: 'no places' });
			return false;
		}

		games[data.gameID].socket.emit('shot', { playerID: data.playerID });
	});

	socket.on('game results', function(data) {
		if (!games[data.gameID]) {
			socket.emit('system', { status: 'no game' });
			return false;
		}

		var np = {};
		for (var i in data.players) {
			if (games[data.gameID].players[i] && games[data.gameID].players[i].iid) {
				np[games[data.gameID].players[i].iid] = data.players[i];
			}
		}

		if (np) {
			cn.query('INSERT INTO games (created) VALUES (?)', [new Date()], function(err, data) {
				for (var i in np)
					cn.query('INSERT INTO plays (game_id, user_id, score) VALUES (?, ?, ?)', [data.insertId, i, np[i]]);
			});
		}
	});

	socket.on('move', function(data) {
		if (!games[data.gameID]) {
			socket.emit('system', { status: 'no game' });
			return false;
		}

		if (Object.keys(games[data.gameID].players).length > 3 || games[data.gameID].started) {
			socket.emit('system', { status: 'no places' });
			return false;
		}

		games[data.gameID].socket.emit('move', { playerID: data.playerID, x: data.speedX, y: data.speedY });
	});

	socket.on('disconnect', function() {
		socket.get('gameID', function(err, gameID) {
			if (!gameID) {
				socket.get('playerID', function(err, playerID) {
					// нужно узнать gameID у данного игрока, если оно есть
					// socket.emit('system' + gameID, { status: 'client-off', playerID: playerID });
					if (players[playerID] && players[playerID].gameID && games[players[playerID].gameID] && games[players[playerID].gameID].socket) {
						if (games[players[playerID].gameID].players[playerID])
							games[players[playerID].gameID].colors.push(games[players[playerID].gameID].players[playerID].color);

						delete games[players[playerID].gameID].players[playerID];

						games[players[playerID].gameID].socket.emit('system', { status: 'player-off', playerID: playerID });
					}

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
		if (!games[data.gameID] || !players[data.playerID]) {
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

		var res = { status: 'new player', playerID: data.playerID, color: color };
		if (players[data.playerID].iid) {
			games[data.gameID].players[data.playerID].iid = players[data.playerID].iid;

			res.name = escapeHtml(players[data.playerID].name);
			res.pic = players[data.playerID].pic;
		}
		games[data.gameID].socket.emit('system', res);
	});
});

function getFloatRand(min, max) {
	return min + Math.random() * (max - min);
}

function escapeHtml(text) {
	return text.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
