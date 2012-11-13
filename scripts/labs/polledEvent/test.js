define(function(){

	return function(Polled,template,insert){
		insert(template());
		var text = document.getElementById('PolledText');
		var form = document.getElementById('PolledForm')
		var intervalInput = form.polledInterval;

		var add = function(){
			var str = '<p>';
			for(var i = 0; i< arguments.length; i++){
				str+=arguments[i]+' ';
			}
			text.innerHTML+=str+'</p>';
		}

		var scroll = new Polled.Scroll();
		scroll
			.interval(500)
			.register(function(args){add('scrolled','current:'+args.current,'scrolled:'+args.scrolled);})
			.start();

		var mouse = new Polled.Mouse();
		mouse
			.interval(500)
			.register(function(args){add('mouse','x:'+args.x,'y:'+args.y);})
			.start();

		form.onsubmit = function(){
			var interval = parseInt(intervalInput.value);
			scroll.interval(interval);
			mouse.interval(interval);
			return false;
		}
	}

})