define(['yelo/PolledEvent'],function(PolledEvent){

	function getPos(obj,undefined) {
		var curleft = curtop = 0;
		if (obj && obj.offsetParent){
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			}while(obj = obj.offsetParent);
			return {x:curleft,y:curtop};
		}
		return {x:undefined,y:undefined};
	}

	function getDimensions(obj){
		return obj ? {x:obj.offsetWidth,y:obj.offsetHeight} : {x:undefined,y:undefined};
	}

	snapToGrid = function(val,gridSize){
		return gridSize * Math.round(val/gridSize);
	};

	var Snap = function(opts){
		var that = this;
		this._mouseEvent = (new PolledEvent.Mouse())
										.interval(opts && opts.interval || arguments[2] || 200)
										.register(function(args){that._mouseMove(args)})
										.start()
		;
		this._el = opts && opts.element || arguments[0];
		this._container = opts && opts.container || arguments[1] || null;
		this._pos = getPos(this._el);
		this._actualSize = getDimensions(this._el);
		this._size = opts && opts.size ? {x:opts.size,y:opts.size}:null || arguments[3] ? {x:arguments[3],y:arguments[3]} : null || this._actualSize;
		this._containerSize = getDimensions(this._container);
		this._containerSize.x-=this._size.x;
		this._containerSize.y-=this._size.y;
		this._halfSize = {x:(this._actualSize.x/2),y:(this._actualSize.y/2)};
	}
	Snap.prototype._mouseMove = function(args){
		var s = this._el.style
		,	pos = {
				x: snapToGrid(args.x - this._pos.x - this._halfSize.x,this._size.x)
			,	y: snapToGrid(args.y - this._pos.y - this._halfSize.y,this._size.y)
			};
		//console.log(pos.x,this._containerSize.x)
		if(pos.x<0){pos.x = 0;}
		else if(pos.x>this._containerSize.x){pos.x = this._containerSize.x}
		if(pos.y < 0){pos.y = 0;}
		else if(pos.y>this._containerSize.y){pos.y = this._containerSize.y}
		if(pos.x!=s.left){s.left = pos.x+'px'};
		if(pos.y!=s.top){s.top = pos.y+'px'};
	}
	return Snap;

})