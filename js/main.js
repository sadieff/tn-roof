$(document).ready(function(){

	$(document).on('click', '.js-menu-toggle', function(){
		$('.header-menu').toggleClass('active');
		$('body').toggleClass('menu-opened');
	});

	// меню навигация
	$(document).on('click', '.js-header-navigation a[href^="#"]', function(e){
		let element = $(this);
		$('html, body').stop().animate({
			scrollTop: $(element.attr('href')).offset().top-95
		}, 1000);
		e.preventDefault();
	});

	$(document).on('click', '.js-menu-open', function(){
		openModal('.js-modal-nav');
	});

	$(document).on('click', '.js-open-game', function(){
		openModal('.js-modal-game');
	});

	$(document).on('click', '.js-project', function(){
		openModal('.js-modal-projects');
	});

	$(document).on('click', '.js-open-test', function(){
		openModal('.js-modal-test');
	});

	$(document).on('click', '.js-modal-close', function(){
		closeModal();
	});

	// Табы
	$(document).on('click', '.js-tab-title:not(.active)', function(){

		$(this).addClass('active');
		$(this).siblings().removeClass('active');

		let target = $('.js-tab-content').eq($(this).index());
		target.siblings().css('display', 'none');
		target.fadeIn(300);

	});

	// Карусели
	let projectCarousel = $('.js-carousel-project').owlCarousel({
		loop: false,
		margin: 0,
		items: 1,
		dots: false,
		nav: false,
		navText: []
	});
	let articleCarousel = $('.js-carousel-article').owlCarousel({
		loop: false,
		margin: 30,
		autoWidth: true,
		dots: false,
		nav: false,
		navText: []
	});

	let historyCarousel = $('.js-carousel-history');

	historyCarousel.owlCarousel({
		loop: false,
		margin: 20,
		dots: true,
		nav: true,
		navText: [],
		onInitialized: carouselInitialized,
		autoWidth: true
	});

	historyCarousel.on('changed.owl.carousel', function(event) {

		$('.js-carousel-history .owl-item').each(function (){
			$(this).find('.history-item').removeClass('active');
		});

		let activeElement = $('.js-carousel-history .owl-item').eq(event.item.index);
		activeElement.find('.history-item').addClass('active');

		$(event.currentTarget).find('.js-carousel-count').text(++event.item.index);

	});

	function carouselInitialized (event){
		$(event.currentTarget).append('<div class="carousel-count">' +
			'<span class="js-carousel-count">1</span> /' + event.item.count +
		'</div>');
	}

	/* js-carousel-nominations */

	let nominationsCarousel = $('.js-carousel-nominations');
	nominationsCarousel.owlCarousel({
		loop: true,
		margin: 20,
		dots: true,
		center: true,
		nav: true,
		navText: [],
		onInitialized: carouselInitialized,
		autoWidth: true
	});

	nominationsCarousel.on('changed.owl.carousel', function(event) {
		$(event.currentTarget).find('.js-carousel-count').text(++event.page.index);
	});

	// audioPlayer

	//https://github.com/mediaelement/mediaelement/blob/master/docs/api.md#properties
	$('audio').mediaelementplayer({
		shimScriptAccess: 'always'
	});

	var playerId = $('#podcast').closest('.mejs__container').attr('id');
	var player = mejs.players[playerId];

	$(document).on('click', '.js-player-play:not(.active)', function(){
		$(this).toggleClass('active');
		player.play();
	});
	$(document).on('click', '.js-player-play.active', function(){
		$(this).toggleClass('active');
		player.pause();
	});
	$(document).on('click', '.js-player-next', function(){
		let currentTime = player.getCurrentTime() + 10;
		player.setCurrentTime(currentTime);
	});
	$(document).on('click', '.js-player-prev', function(){
		let currentTime = player.getCurrentTime() - 10;
		player.setCurrentTime(currentTime);
	});

	// статьи
	let get = window.location.search.replace('?','').split('&')
		.reduce(
			function(p,e){
				let a = e.split('=');
				p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
				return p;
			},
			{}
		);

	if (get['article']) {

		openModal('.js-modal-article');

		$.ajax({
			url: 'article-'+get['article']+'.html',
			data: '',
			type: 'get',
			dataType: 'html',
			success: function (data) {

				$('.js-article-content').html(data);
				setTimeout(function (){
					$('.js-article-content').removeClass('loading');
				}, 1000)

			}
		});

	}

	$(document).on('click', '.js-history-back', function(e){
		history.pushState(null, null, location.pathname);
	});

	$(document).on('click', '.js-open-article', function(e){

		e.stopPropagation();
		e.preventDefault();

		let action = $(this).data('target');

		history.pushState(null, null, $(this).attr('href'));
		$('.js-article-content').html('').addClass('loading');
		openModal('.js-modal-article');

		$.ajax({
			url: action,
			data: '',
			type: 'get',
			dataType: 'html',
			success: function (data) {

				$('.js-article-content').html(data);
				setTimeout(function (){
					$('.js-article-content').removeClass('loading');
				}, 1000)

			}
		});

	});

	// stick header
	$(window).scroll(function(){
		if ($(window).scrollTop() >= 100) {
			if ($('.header').hasClass() == false) $('.header').addClass('scrolled');
		}
		else $('.header').removeClass('scrolled');
	});

	function openModal(element){
		$('.modal-item.active').removeClass('active');
		$(element).add('.modal,.modal-substrate').addClass('active');
		$('body').addClass('modal-opened');
	}

	function closeModal(){
		$('.modal,.modal-substrate').removeClass('active');
		$('body').removeClass('modal-opened');
	}

	// Валидация форм
	$(document).on('click', '.js-submit', function(e){

		e.stopPropagation();
		e.preventDefault();

		let $form = $(this).closest('form'),
			data = $form.serialize(),
			action = $form.attr('action'),
			rules = Object(),
			inputs = $form.find('input').add('textarea', $form.get(0)),
			validate = true;

		inputs.each(function(){
			let r = $(this).data('rules');
			if (r && r.length != 0){
				rules[$(this).attr('name')] = r;
				r = r.split(',');
				for (i = 0; i < r.length; i++) {
					var rule = r[i];
					if (validator[rule]){
						if ( !validator[rule]($(this)) ){
							validate = false;
						}
					}
				}
			}
		});

		if (!validate) return;
		let btn = $(this).addClass('desabled').removeClass('.js-submit');

		$('.js-success-title').text('Спасибо!');
		$('.js-success-dsc').html('Вы успешно подписались на нашу рассылку. На электронный адрес отправлено письмо с подтверждением');
		openFB ($('.js-success'));

		$.ajax({
			url: '/local/ajax/'+action,
			data: data,
			type:'post',
			dataType: 'JSON',
			success:function(data){
				if(data.action == 'refresh') document.location.reload();
				else if(data.result == 'success') {

					$('.js-success-title').text(data.title);
					$('.js-success-dsc').html(data.dsc);
					openFB ($('.js-success'));

				}
				else if(data.result == 'error') {

					$('.js-error-title').text(data.title);
					$('.js-error-dsc').html(data.dsc);
					openFB ($('.js-error'));

				}

				btn.addClass('desabled').removeClass('.js-submit');
			}
		});

		return false;
	});

	$('input').add('textarea, label input[type=checkbox] ~ span').on('focus click', function(){
		$(this).parent()
			.removeClass('wrong');
	}).each( function(){

		if ( $(this).data('rules') ){
			if($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
				$(this).closest('label').addClass('feild_wrapper');
			}
			else {
				$(this).wrap('<div class="feild_wrapper"></div>');
				$(this).parent().append('<span class="error_label"></span>');
			}
		}

	});

});

function openFB (element){
	$.fancybox.open({
		src  : element,
		type : 'inline',
		attr: {
			scrolling: "none"
		},
		scrolling : 'visible',
		touch: false
	});
}

var validator = {
	required:function($i){
		if ($i.val() == '' || $i.val() == $i.attr('placeholder')){
			fieldError.call( $i, lang.requiredError );

			return false;
		}
		return true;
	},
	email:function($i){

		if ($i.val() == '') return true;

		var r = new RegExp(".+@.+\..+","i");
		if ( ! r.test($i.val()) ){
			fieldError.call( $i, lang.emailError );
			return false;
		}
		return true;
	},
	phone:function($i){
		console.log('phone');
		var r = new RegExp("^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$","i");
		if ( ! r.test($i.val()) ){
			fieldError.call( $i, lang.phoneError );
			return false;
		}
		return true;
	},
	password:function($i){
		if ($i.val().length < 6){
			fieldError.call( $i, lang.password );
			return false;
		}
		return true;
	},
	confirmpass:function($i){
		let child = $i.closest('form').find($i.data('target'));
		if ($i.val() != child.val()){
			console.log($i.val(),child.val());
			fieldError.call( $i, lang.confirmpass );
			return false;
		}
		return true;
	},
	politic:function($i){
		if ($i.prop("checked") === false){
			$i.closest('label').addClass('wrong');
			return false;
		}
		return true;
	}
}

var fieldError = function(message){

	if ( !$(this).parent().hasClass('feild_wrapper') ){

		$(this).wrap('<div class="feild_wrapper"></div>');
		$(this).parent().append('<span class="error_label"></span>');

	}

	$(this).parent().addClass('wrong');
	$(this).siblings('.error_label').text( message );

	return false;
}

var lang = {
	success: 			'Ваша заявка успешно отправлена',
	error: 				'Произошла ошибка, попробуйте еще раз',
	name: 				'Имя',
	phone:				'Телефон',
	email: 				'Email',
	password: 			'Пароль слишком короткий',
	confirmpass: 	    'Введенные пароли не совпадает',
	requiredError:		'Это поле не может быть пустым',
	emailError:			'Поле Email должно содержать корректный адрес',
	phoneError:			'Укажите корректный номер телефона'
};