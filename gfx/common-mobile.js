var socket = io.connect('http://2014.studio38.ru:8089'), playerID, gameID;

socket.emit('newPlayer');
socket.on('id', function(data) {
	playerID = data.id;
});

socket.on('system', function(data) {
	switch (data.status) {
		case 'server-off':
			$('.game_pad').hide().attr('className', 'game_pad');
			$('#gameID').val('');
			$('body').removeClass('fade_second_screen');
			break;

		case 'joined game':
			gameID = data.gameID;
			$('#gameID').val('');
			$('.game_pad').addClass(data.color).fadeIn();
			break;
	}
});

$(function() {
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
		if (!document.getElementById('gameID').value) {
			document.getElementById('gameID').focus();
			return false;
		} else {
			socket.emit('joinGame', { playerID: playerID, gameID: document.getElementById('gameID').value });
		}
	});
});
