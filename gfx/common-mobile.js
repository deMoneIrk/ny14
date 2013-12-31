var socket = io.connect('http://2014.studio38.ru:8089'), playerID, gameID;

socket.emit('newPlayer', { iid: window.iid });
socket.on('id', function(data) {
	playerID = data.id;
});

socket.on('system', function(data) {
	switch (data.status) {
		case 'no places':
		case 'no game':
			if (gameID) {
				gameID = false;
				gameStop();
			}

			$('#gameID').css('background-color', '#f00').focus();

			setTimeout(function() {
				$('#gameID').css('background-color', '#fff');
			}, 300);

			break;

		case 'server-off':
			gameStop();
			break;

		case 'joined game':
			gameID = data.gameID;
			gameStart(data.color);
			break;
	}
});

/***** requestAnimationFrame polyfill *****/
// Source: http://html5.by/blog/what-is-requestanimationframe/
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var start = [], now, change = [0, 0];
gameStart = function(color) {
	var wh = [parseInt($('.stick i').width()) / 2, parseInt($('.stick i').height()) / 2], pos = [$('.stick i').position().left + wh[0], $('.stick i').position().top + wh[1]], max = 140;

	$('body').addClass('fade_second_screen');
	$('.first_screen, .second_screen').hide();
	$('.game_pad').addClass(color).show();

	$(document).on('touchstart touchmove touchend', function(e) { e.preventDefault(); });

	$('.strike').on('touchstart', function(e) {
		socket.emit('shot', { playerID: playerID, gameID: gameID });
	});

	var started = false;
	$(document).on('touchstart', function(e) {
		if (e.target == $('.stick i')[0]) {
			started = true;
			start = [e.originalEvent.targetTouches[0].screenX, e.originalEvent.targetTouches[0].screenY];
		}
	}).on('touchmove', function(e) {
		if (!started) return;

		now = [e.originalEvent.targetTouches[0].screenX, e.originalEvent.targetTouches[0].screenY];
		change = [start[0] - now[0], start[1] - now[1]];

		if (change[0] > max) change[0] = max; if (change[0] < -max) change[0] = -max;
		if (change[1] > max) change[1] = max; if (change[1] < -max) change[1] = -max;

		change[2] = Math.sqrt(Math.pow(change[0], 2) + Math.pow(change[1], 2) - 2 * change[0] * change[1] * Math.cos(90 * Math.PI / 180));

		var
			angle1 = Math.acos((Math.pow(change[0], 2) + Math.pow(change[2], 2) - Math.pow(change[1], 2)) / (2 * change[0] * change[2])) * 180 / Math.PI,
			angle0 = 90 - angle0,
			angle2 = 90;

		if (change[2] < -max) {
			change[2] = -max;
			change[1] = change[2] * (Math.sin(angle0 * Math.PI / 180) / Math.sin(angle1 * Math.PI / 180));
			change[0] = change[2] * (Math.sin(angle1 * Math.PI / 180) / Math.sin(angle0 * Math.PI / 180));
		} else if (change[2] > max) {
			change[2] = max;
			change[1] = change[2] * (Math.sin(angle0 * Math.PI / 180) / Math.sin(angle1 * Math.PI / 180));
			change[0] = change[2] * (Math.sin(angle1 * Math.PI / 180) / Math.sin(angle0 * Math.PI / 180));
		}

		$('.stick i').css('transform', 'translate' + (Modernizr.csstransforms3d ? '3d' : '') + '(' + (-change[0]) + 'px, ' + (-change[1]) + 'px' + (Modernizr.csstransforms3d ? ', 0px' : '') + ')');

		// socket.emit('move', { playerID: playerID, gameID: gameID, speedX: -change[0], speedY: -change[1], iid: window.iid });
	}).on('touchend', function(e) {
		if (!started) return;

		change[0] = 0;
		change[1] = 0;
		$('.stick i').css('transform', 'translate' + (Modernizr.csstransforms3d ? '3d' : '') + '(0px, 0px' + (Modernizr.csstransforms3d ? ', 0px' : '') + ')');
	});

	setInterval(window.sendData, 100);
};

window.sendData = function() {
	socket.emit('move', { playerID: playerID, gameID: gameID, speedX: -change[0], speedY: -change[1] });
};

gameStop = function() {
	clearInterval(window.sendData);
	$('.game_pad').hide();
	$('.last_screen').show();
/*
	$('body').removeClass('fade_second_screen');
	$('.first_screen').show(); $('.second_screen').hide();
	$('.game_pad').attr('class', 'game_pad').hide();
*/
	$(document).off('touchstart touchmove touchend');
	$('.stick i').off('touchstart touchmove touchend');
	$('.strike').off('touchstart');
};

$(function() {
	if (window.iid) $('body').addClass('fade_second_screen');

	if(window.orientation == -90 || window.orientation == 90 || window.orientation == undefined) {
		$('body').addClass('horizontal');
	} else {
		$('body').removeClass('horizontal');
	}

	window.addEventListener("orientationchange", function() {
		if(window.orientation == -90 || window.orientation == 90 || window.orientation == undefined) {
			$('body').addClass('horizontal');
		} else {
			$('body').removeClass('horizontal');
		}
	}, false);

	$('.fb_btn').on('click', function() {
		top.location.href = '/facebook';
	});
	
	$('.play_inkognito_btn').click(function() {
		$('body').addClass('fade_second_screen');
	});

	$('.join_btn').click(function() {
		if (!$('#gameID').val()) {
			$('#gameID').focus();
			return false;
		} else {
			socket.emit('joinGame', { playerID: playerID, gameID: document.getElementById('gameID').value });
		}
	});
});
