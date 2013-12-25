var socket = io.connect('http://2014.studio38.ru:8089'), playerID, gameID;

socket.emit('newPlayer');
socket.on('id', function(data) {
	playerID = data.id;
});

socket.on('system', function(data) {
	switch (data.status) {
		case 'no places':
		case 'no game':
			$('#gameID').css('background-color', '#f00').focus();

			setTimeout(function() {
				$('#gameID').css('background-color', '#fff');
			}, 300);

			break;

		case 'server-off':
			$('.game_pad').hide().attr('className', 'game_pad');
			$('#gameID').css('background-color', '#fff').val('');
			$('body').removeClass('fade_second_screen');
			break;

		case 'joined game':
			gameID = data.gameID;
			$('#gameID').css('background-color', '#fff').val('');
			$('.game_pad').addClass(data.color).fadeIn();
			break;
	}
});

gameStart = function() {
	var wh = [parseInt($('.stick i').width()) / 2, parseInt($('.stick i').height()) / 2], pos = [$('.stick i').position().left + wh[0], $('.stick i').position().top + wh[1]];
	socket.emit('iphone', { wh: wh, pos: pos });

	$('body').addClass('fade_second_screen');
	$('.game_pad').addClass('yellow').show();

	$(document).on('touchstart touchmove touchend', function(e) {
		e.preventDefault();
	});

	$('.strike').on('touchstart', function(e) {
		socket.emit('iphone');
	});

	var start = []
	$('.stick i').on('touchstart', function(e) {
		start = [e.originalEvent.targetTouches[0].screenX, e.originalEvent.targetTouches[0].screenY];
		socket.emit('iphone', { pos: now });
	}).on('touchmove', function(e) {
		var now = [e.originalEvent.targetTouches[0].screenX, e.originalEvent.targetTouches[0].screenY],
			change = [start[0] - now[0], start[1] - now[1]];
		socket.emit('iphone', { now: now, change: change });
	});
};

gameStop = function() {

};

$(function() {
	gameStart();

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
