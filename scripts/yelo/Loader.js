define(function(){

	var makeCallBackFunction = function(that, n, img, src, evt){
		var args = {source:src,event:evt,image:img},i;
		return function(){
			while((i = that.loading.indexOf(src))!==-1){
				that.loaded.push(that.loading.splice(i,1)[0]);
			}
			that.trigger(src,args);
			that.trigger(evt,args);
			clearTimeout(that.timers[n]);
			that.timers[n] = null;
			that.load();
		}
	}

	var Loader = function(options){
		var opts = {
			timeOut:180
		,	concurrent:4
		,	direction:'FIFO'
		}
		if(options){
			for(var n in options){opts[n] = options[n];}
		};
		this.timeOut = opts.timeOut;
		this.concurrent = opts.concurrent;
		this.loading = [];
		this.loaded = [];
		this.queue = [];
		this.timers = {};
		this.dir = (opts.direction == 'LIFO') ? 'pop' : 'shift';
		this.listeners = {};
		this.stopped = false;
		this.count = 0;
	}

	Loader.LOAD = 'load';
	Loader.COMPLETE = 'complete';
	Loader.ERROR = 'error';
	Loader.TIME_OUT = 'timeout';

	Loader.prototype = {
		constructor:Loader
	,	add:function(imgPath,fn){
			//implement priority logic
			if(this.loaded.indexOf(imgPath)>=0){return this;}
			this.queue.push(imgPath);
			if(fn){this.addEventListener(imgPath,fn);}
			this.load();
			return this;
		}
	,	load:function(){
			var id, that = this, image, src;
			if(this.stopped){return this;}
			if(!this.queue.length && !this.loading.length){this.complete();}
			id = this.count++;
			while(this.queue.length && (this.loading.length < this.concurrent)){
				src = this.queue[this.dir]();
				this.loading.push(src);
				image = new Image();
				image.onload = makeCallBackFunction(this, id, image, src, Loader.LOAD);
				image.onerror = makeCallBackFunction(this, id, image, src, Loader.ERROR);
				image.src = src;
				this.timers[id] = setTimeout(makeCallBackFunction(this, id, image, src, Loader.TIME_OUT),this.timeOut * 1000);
			}
			return this;
		}
	,	complete:function(){
			this.trigger(Loader.COMPLETE);
			return this;
		}
	,	trigger:function(evt,args){
			if(!this.listeners[evt] || !this.listeners[evt].length){return this;}
			var i = 0, evts = this.listeners[evt], l = evts.length;
			for(i;i<l;i++){
				evts[i](evt,args);
			}
			return this;
		}
	,	addEventListener:function(evt, fn){
			if(!this.listeners[evt]){this.listeners[evt] = [fn];return this;}
			this.listeners[evt].push(fn);
			return this;
		}
	,	removeEventListener:function(evt,fn){
			if(!this.listeners[evt] || !this.listeners[evt].length){return this;}
			var i = this.listeners[evt].indexOf(fn);
			if(i>=0){this.listeners[evt].splice(i,1);}
		}
	,	stop:function(){
			this.stopped = true;
			return this;
		}
	,	resume:function(){
			this.stopped = false;
			this.load();
			return this;
		}
	}

	Loader.prototype.on = Loader.prototype.addEventListener;
	Loader.prototype.off = Loader.prototype.removeEventListener;

	var l;
	var factory = function(props){
		if(!l){l = new Loader(props);}
		return l;
	}

	return factory;

})
