define(['yelo/StackGrid'],function(StackGrid){


	var supportClassList = 'classList' in document.createElement('div');

	function classReg(c) {
		return ;
	}

	var classSize = function (el, c) {
		var reg = new RegExp("(?:^|\\s+)" + c + "-?(\\d*?)(?:\\s+|$)");
		var match = el.className.match(reg);
		if(match && match.length > 1){return parseInt(match[1]);}
		return 1;
	};

	var defView = document.defaultView;

	var getPosition = function(el){
		return{
			top: el.offsetTop - el.parentNode.scrollTop
		,	left: el.offsetLeft - el.parentNode.scrollLeft
		}
	}

	var Stack = function(el,options){
		this.cellWidth = 0;
		this.cellHeight = 0;
		this.columns = 0;
		this._width = 0;
		this._height = 0;
		this.el = el;
		this.options(options);
		this._items = [];
		el.className+=' '+this.opts.mainClassName;
	}
	Stack.prototype = {
		constructor:Stack
	,	children:function(refresh){
			var item,landscapeSize,portraitSize,pos, _children;
			if(!this._items.length || refresh){
				_children = this.el.getElementsByClassName(this.opts.selectorClass);
				for(var i = 0; i<_children.length; i++){
					item = _children[i];
					if(item.getAttribute('data-stack')){continue;}
					item.setAttribute('data-stack','1');
					pos = getPosition(item);
					pos.sizeX = classSize(item,this.opts.landscape);
					pos.sizeY = classSize(item,this.opts.portrait);
					pos.width = pos.sizeX * this.cellWidth;
					pos.height = pos.sizeY * this.cellHeight;
					pos.el = item;
					this._items.push(pos);
				}
			}
			return this._children;
		}
	,	options:function(options,el){
			if(!el){el = this.el;}
			var opts = {
				width: el.offsetWidth || 200
			,	cellWidth:50
			,	cellHeight:50
			,	mainClassName:'stackContainer'
			,	selectorClass:'item'
			,	landscape:'landscape'
			,	portrait:'portrait'
			};
			if(options){
				for(var n in options){
					opts[n]  = options[n];
				}
			}
			this.cellWidth = opts.cellWidth;
			this.cellHeight = opts.cellHeight;
			this.columns = Math.floor(opts.width/opts.cellWidth);
			this.opts = opts;
			if(!this.grid){
				this.grid = new StackGrid(this.columns);
			}else{
				this.grid.setCols(this.columns);
			}
			return this;
		}
	,	items:function(refresh){
			this.children(refresh);
			return this._items;
		}
	,	fit:function(refresh){
			var i = 0
			,	items = this.items(refresh)
			,	l = items.length
			,	pos
			,	item
			;
			for(i;i<l;i++){
				item = items[i];
				if(typeof item.x !== 'undefined'){
					continue;
				}
				pos = this.grid.setNextEmptyCellRange(item.sizeX,item.sizeY,true);
				item.x = pos[0];
				item.y = pos[1];
				item.el.style.left = item.x * this.cellWidth + 'px';
				item.el.style.top = item.y * this.cellHeight + 'px';
				if(item.y+item.sizeY>this._height){
					this._height = item.y + item.sizeY;
				}
				if(item.x+item.sizeX>this._width){
					this._width = item.x+item.sizeX;
				}
			}
			return this;
		}
	,	height:function(){
			return this._height * this.cellHeight;
		}
	,	width:function(){
			return this._width * this.cellWidth;
		}
	}

	return Stack;

})