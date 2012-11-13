define(function(){

	var toArgs = function(args){return Array.prototype.slice.call(args);}
	,	w = window
	,	d = document
	;

	var Polled = function(opts){
		this._timer = null;
		this._interval = 200;
		this._subscribers = [];
		this._hasOccured = false;
		this._hasInit = false;
		this._args = {};
	}
	Polled.prototype = {
		constructor:Polled
	,	register:function(fn){
			this._subscribers.push(fn);
			return this;
		}
	,	unregister:function(fn){
			var i = this._subscribers.indexOf(fn);
			if(i>=0){
				this._subscribers.splice(i,1);
			}
			return this;
		}
	,	trigger:function(){
			this._collectArguments();
			var fns = this._subscribers, l = fns.length, i = 0;
			for(i;i<l;i++){
				fns[i](this._args);
			}
			return this;
		}
	,	_init:function(){
			//do any preparation here
		}
	,	start:function(){
			if(!this._hasInit){this._init();this._hasInit = true;}
			var that = this;
			if(!this._timer){
				this._timer = setInterval(function(){that._timerCallback()},this._interval);
			}
			return this;
		}
	,	interval:function(i){
			if(!arguments.length){return this._interval;}
			if(!i || i == this._interval){return this;}
			this._interval = i;
			return this;
		}
	,	stop:function(){
			clearInterval(this._timer);
			this._timer = null;
			return this;
		}
	,	_timerCallback:function(){
			if(this._check()){
				this.trigger();
			}
		}
	,	_check:function(){
			if(!this._hasOccured){return false;}
			this._hasOccured = false;
			return true;
		}
	,	_collectArguments:function(){

		}
	}
	function getScrollTop(){
		if(typeof pageYOffset!= 'undefined'){
		//most browsers
			return pageYOffset;
		}
		else{
			var B = document.body; //IE 'quirks'
			var D = document.documentElement; //IE with doctype
			D = (D.clientHeight)? D: B;
			return D.scrollTop;
		}
	}

	var ScrollPolled = function(opts){
		Polled.call(this,opts);
		this._args = {current:0,scrolled:0}
	}
	ScrollPolled.prototype = new Polled();
	ScrollPolled.prototype.constructor = Polled;
	ScrollPolled.prototype._init = function(){
		var that = this;
		if(w.attachEvent){w.attachEvent('onscroll',function(e){that.onScroll(e)})}else{w.addEventListener('scroll',function(e){that.onScroll(e)});};
	}
	ScrollPolled.prototype.onScroll = function(e){
		this._hasOccured = true;	
	}
	ScrollPolled.prototype._collectArguments = function(){
		var current = getScrollTop();
		if(current!==this._args.current){
			this._args.scrolled = current - this._args.current;
			this._args.current = current;
		}
	}

	var MousePosPolled = function(opts){
		Polled.call(this,opts);
		this._args = {x:0,y:0};
	}
	MousePosPolled.prototype = new Polled();
	MousePosPolled.prototype.constructor = Polled;
	MousePosPolled.prototype._init = function(){
		var that = this;
		if(w.attachEvent){w.attachEvent('onmousemove',function(e){that.onMouseMove(e)})}else{w.addEventListener('mousemove',function(e){that.onMouseMove(e)});};
	}
	MousePosPolled.prototype.onMouseMove = function(e){
		e = e || window.event;
		var cursor = {x:0, y:0};
		if (e.pageX || e.pageY) {
			cursor.x = e.pageX;
			cursor.y = e.pageY;
		} 
		else {
			cursor.x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
			cursor.y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
		}
		if(cursor.x != this._args.x || cursor.y != this._args.y){
			this._hasOccured = true;
			this._args = cursor;
		}
	}

	Polled.Mouse = MousePosPolled;
	Polled.Scroll = ScrollPolled;

	return Polled;

})