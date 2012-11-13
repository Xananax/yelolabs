define(function(){

	var animateSize = function sizeAnim(obj,width,wd,height,hd){
		var _render = obj.render()
		,	cw = parseInt(_render.inner.style.width)
		,	ch = parseInt(_render.inner.style.height)
		,	o = obj._options
		;
		if(cw==width && ch==height){
			clearInterval(obj._scaleInterval);
			_render.inner.style.backgroundImage='none';
			_render.content.style.display='block';
			if(o.close){
				_render.inner.appendChild(_render.closeBtn);
				obj._hasCloseBtn=1;
			}
			if(o.onOpen){o.onOpen();}
		}else{
			if(cw != width){
				_render.inner.style.width=(width - Math.floor(Math.abs(width - cw)*.6) * wd)+'px';
			}
			if(ch != height){
				_render.inner.style.height=(height - Math.floor(Math.abs(height - ch)*.6)* hd)+'px';
			}
			obj.pos();
		}
	};

	var animateAlpha = function alphaAnim(obj,el,alpha,direction){
		var _render = obj.render()
		,	o = obj._options
		,	opacity = Math.round(el.style.opacity*100)
		,	n
		;
		if(opacity == alpha){
			clearInterval(obj._alphaInterval);
			if(direction == -1){
				el.style.display='none';
				(el == _render.box) ?
					obj.alpha(_render.mask,-1,0,2)
					:
					_render.content.innerHTML=_render.inner.style.backgroundImage=''
					;
			}else{
				if(el == _render.mask){
					obj.alpha(_render.box,1,100)
				}else{
					_render.box.style.filter='';
					obj.fill(
						o.html||o.url
					,	o.url || o.iframe || o.image
					,	o.post
					,	o.animate
					,	o.width
					,	o.height
					);
				}
			}
		}else{
			n = alpha - Math.floor(Math.abs(alpha - opacity)*.5) * direction;
			el.style.opacity = n/100;
			el.style.filter='alpha(opacity='+n+')';
		}
	};

	var resizeProportional = function scaleSize(maxW, maxH, currW, currH){
		var ratio = Math.min(maxW/currW, maxH/currH);
		return [ratio * currW,ratio * currH];
	}

	var resizeImage = function(maxW,maxH,img){
		var target = resizeProportional(maxW,maxH,img.width,img.height);
		if(target[0] !== img.width || target[1] !== img.height){
			img.width = target[0];
			img.height = target[1];
		}
	}

	var createCallBackButton = function(name,fn,classes,box){
		var n = document.createElement('a');
		n.innerHTML = name;
		n.href='#';
		n.className = (classes? classes+' ' : '')+name.replace(/\s/g,'_').replace(/[^a-zA-Z 0-9 _-]+/g,'');
		n.onclick = function(){fn(name,box,classes);return false;};
		return n;
	}

	var regexes = {
		images:/\.gif$|\.png$|\.jpg$|\.jpeg$|\.bmp$|\.tiff$/i
	,	iframe:/\.css$|\.js$|\.coffee$|\.txt$|\.ini$|\.html$|\.htm$|\.asp$|\.aspx$|\.php$|^(https?:\/\/[^\s]+)/i
	,	url:/^ajax/
	}

	var ids = 0;

	var ModalBox = function(o,content,buttons){
		if (!(this instanceof ModalBox)){
			return new ModalBox(o,content);
		}
		this._render = false;
		this.autohideTimeOut = false;
		this._scaleInterval = false;
		this._alphaInterval = false;
		this._hasCloseBtn = 0;
		this._options = {
			mainClass : 'modal'
		,	boxClass:'box'
		,	innerClass:'inner'
		,	contentClass:'content'
		,	maskClass:'mask'
		,	closeClass:'close'
		,	titleClass:'title'
		,	buttonsClass:'buttons'
		,	id:ids++
		,	opacity:70
		,	close:1
		,	animate:1
		,	fixed:1
		,	mask:1
		,	topsplit:2
		,	url:0
		,	post:0
		,	height:0
		,	width:0
		,	html:0
		,	iframe:0
		,	scaleInterval:20
		,	alphaInterval:20
		,	onOpen:false
		,	onClose:false
		,	imgBorders:10
		,	title:''
		}
		this._callbacks = {};

		if(typeof o == 'string'){
			buttons = content;
			content = o;
			o = null;
		}

		if(o){this.options(o);}
		if(content){this.content(content);}
		if(buttons){this.buttons(buttons);}
	};

	ModalBox.prototype = {
		constructor:ModalBox
	,	createElements:function(){
			var _render = this._render || null
			,	o = this._options
			,	that = this
			;
			if(!_render){
				_render = {
					box:document.createElement('div')
				,	inner:document.createElement('div') 
				,	content:document.createElement('div') 
				,	mask:document.createElement('div') 
				,	closeBtn:document.createElement('div') 
				,	title:document.createElement('div')
				,	buttons:document.createElement('div')
				}

				_render.box.className=o.mainClass+'_'+o.boxClass;
				_render.inner.className=o.mainClass+'_'+o.innerClass;
				_render.content.className=o.mainClass+'_'+o.contentClass;
				_render.mask.className=o.mainClass+'_'+o.maskClass;
				_render.closeBtn.className=o.mainClass+'_'+o.closeClass;
				_render.title.className=o.mainClass+'_'+o.titleClass;
				_render.buttons.className=o.mainClass+'_'+o.buttonsClass;

				document.body.appendChild(_render.mask);
				document.body.appendChild(_render.box);
					_render.box.appendChild(_render.inner);
						_render.inner.appendChild(_render.content);
						_render.inner.appendChild(_render.title);
						_render.inner.appendChild(_render.buttons);

				_render.mask.onclick=_render.closeBtn.onclick=function(e){that.hide(e)};
				//TODO: change this to better event
				window.onresize=function(){that.resize();}

				this._hasCloseBtn = 0;
				this._render = _render;
				return this._render;
			}
			_render.box.style.display='none';
			_render.title.display = 'none';
			clearTimeout(this.autohideTimeOut);
			if(this._hasCloseBtn){
				_render.inner.removeChild(_render.closeBtn);
				this._hasCloseBtn=0;
			}
			return this._render;
		}
	,	render:function(refresh){
			if(this._render && !refresh){return this._render;}
			var o = this._options
			,	_render = this.createElements()
			,	that = this
			;

			_render.inner.id=o.mainClass+'_'+o.innerClass+'_'+o.id;
			_render.mask.id=o.mainClass+'_'+o.maskClass+'_'+o.id;;
			_render.box.style.position=o.fixed?'fixed':'absolute';

			if(o.mask){
				this.mask();
				this.alpha(_render.mask,1,o.opacity)
			}else{
				this.alpha(_render.box,1,100)
			};
			if(o.autohide){
				this.autohideTimeOut=setTimeout(function(){that.hide();},1000*o.autohide)
			}else{
				//TODO: Change this to better event
				document.onkeyup=this.esc;
			}
			return _render;
		}
	,	show:function(){
			var o = this._options
			,	_render = this.render();
			if(o.html && !o.animate){
				_render.inner.style.backgroundImage='none';
				_render.content.innerHTML=o.html;
				_render.content.style.display='';
				_render.inner.style.width= o.width ? o.width+'px' : 'auto';
				_render.inner.style.height= o.height ? o.height+'px' : 'auto';
			}else{
				_render.content.style.display='none'; 
				if(!o.animate && o.width && o.height){
					_render.inner.style.width=o.width+'px';
					_render.inner.style.height=o.height+'px'
				}else{
					_render.inner.style.width=_render.inner.style.height='100px'
				}
			}
		}
	,	options:function(opts){
			var n = arguments.length
			,	o = this._options
			;
			if(n==1){
				for(opt in opts){
					o[opt]=opts[opt];
				}
				return this;
			}
			if(n>1){
				o[arguments[0]] = arguments[1];
				return this;
			}
			if(o.content){
				this.content(o.content);
				delete o.content;
			}
			return this._options;
		}
	,	content:function(c){
			var o = this._options
			;
			if(typeof c == 'string'){
				c = c.split('##');
				if(c.length>1){
					o.title = c.shift();
				}
				c = c.shift();
				if(c.match(regexes.images)){
					console.log('image!');
					o.image = c;
					o.iframe = null;
					o.url = null;
					o.html = null;
					return this;
				}
				if(c.match(regexes.iframe)){
					console.log('iframe');
					o.iframe = c;
					o.url = null;
					o.image = null;
					o.html = null;
					return this;
				}
				if(c.match(regexes.url)){
					console.log('url!');
					o.url = c;
					o.iframe = null;
					o.image = null;
					o.html = null;
					return this;
				}
				console.log('just text');
				o.url = null;
				o.iframe = null;
				o.image = null;
				o.html = c;
			}else if(c.nodeType == 1){
				o.html = c;
			}else{
				throw new Error('could not parse this object');
			}
		}
	,	hide:function(){
			var o = this._options
			,	_render = this.render();
			this.alpha(_render.box,-1,0,3);
			//TODO: better event
			document.onkeypress=null;
			if(o.onClose){o.onClose()}
			return this;
		}
	,	esc:function(e){
			e=e||window.event;
			if(e.keyCode==27){this.hide();}
		}
	,	resize:function(){
			this.pos();
			this.mask();
			return this;
		}
	,	mask:function(){
			var _render = this.render()
			,	_s = this.total()
			;
			_render.mask.style.height=_s[1]+'px';
			_render.mask.style.width=_s[0]+'px';
		}
	,	pos:function(){
			var o = this._options
			,	_render = this.render()
			,	t;
			if(typeof o.top!='undefined'){t=o.top}
			else{
				t = (this.height()/o.topsplit) - (_render.box.offsetHeight/2);
				t = t<20 ? 20 : t;
			}
			if(!o.fixed && !v.top){t+= this.top();}
			_render.box.style.top = t+'px'; 
			_render.box.style.left = (typeof o.left!='undefined') ? o.left+'px' : (this.width()/2) - (_render.box.offsetWidth/2)+'px';
		}
	,	top:function(){
			return document.documentElement.scrollTop || document.body.scrollTop;
		}
	,	width:function(){
			return self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		}
	,	height:function(){
			return self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
		}
	,	total:function(height){
			var b = document.body
			,	e = document.documentElement
			,	size = [ 
					Math.max(Math.max(b.scrollWidth,e.scrollWidth),Math.max(b.clientWidth,e.clientWidth))
				,	Math.max(Math.max(b.scrollHeight,e.scrollHeight),Math.max(b.clientHeight,e.clientHeight))
				]
			;
			if(arguments.length){
				if(height){return size[1];}
				return size[0];
			}
			return size;
		}
	,	size:function(width,height,animate){
			var	o = this._options
			,	_render = this.render()
			,	that = this
			;
			if(animate){
				clearInterval(this._scaleInterval);
				var wd = parseInt(_render.inner.style.width) > width ? -1:1
				,	hd = parseInt(_render.inner.style.height) > height ? -1:1;
				this._scaleInterval = setInterval(function(){
					animateSize(that,width,wd,height,hd);
				},o.scaleInterval);
			}else{
				_render.inner.style.backgroundImage='none';
				if(o.close){
					_render.inner.appendChild(_render.closeBtn);
				this._hasCloseBtn=1
				}
				_render.inner.style.width=w+'px';
				_render.inner.style.height=h+'px';
				_render.content.style.display='';
				this.pos();
				if(o.onOpen){o.onOpen();}
			}
		}
	,	alpha:function(el,direction,alpha){
			var o = this._options
			,	x
			,	that = this
			;
			clearInterval(this._alphaInterval);
			if(direction){
				el.style.opacity=0;
				el.style.filter='alpha(opacity=0)';
				el.style.display='block';
				this.pos();
			}
			this._alphaInterval = setInterval(function(){
				animateAlpha(that,el,alpha,direction);
			},o.alphaInterval);
		}
	,	title:function(t){
			var _render = this.render();
			_render.title.innerHTML = t;
			_render.title.display = 'block';
		}
	,	fill:function(content,url,post,animate,width,height){
			var o = this._options
			,	_render = this.render()
			,	maxW = width
			,	maxH = height
			,	that = this
			,	size
			;
			if(o.title){
				this.title(o.title);
			}
			if(url){
				if(o.image){
					var img = new Image();
					img.onload = function(){
						if(maxW || maxH){
							maxW-=o.imgBorders;
							maxH-=o.imgBorders;
							if(maxW < img.width || maxH < img.height){
								resizeImage(maxW,maxH,img);
							}
						}else{
							width = img.width;
							height = img.height;
						}
						that.push(img,animate,width,height)
					};
					img.src = o.image;
				}else if(o.iframe){
					width = width || o.width || 600;
					height = height || o.height || 400;
					this.push(
						'<iframe src="'+o.iframe+'" width="'+width+'" frameborder="0" height="'+height+'"></iframe>'
					,	animate
					,	width
					,	height
					)
				}else{
					x = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
					x.onreadystatechange=function(){
						if(x.readyState == 4 && x.status == 200){
							_render.inner.style.backgroundImage='';
							that.push(x.responseText,animate,width,height)}
					};
					if(post){
						x.open('POST',content,true);
						x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
						x.send(post);
					}else{
						x.open('GET',content,true);
						x.send(null);
					}
				}
			}else{
				this.push(content,animate,width,height)
			}
		}
	,	push:function(content,animate,width,height){
			var _render = this.render()
			;
			if(content.nodeType == 1){
				_render.content.appendChild(content);
			}
			else{
				_render.content.innerHTML = content;
			};
			var x = _render.inner.style.width
			,	y = _render.inner.style.height;
			if(!width || !height){
				_render.inner.style.width= width ? width +'px':'';
				_render.inner.style.height= height ? height+'px':'';
				_render.content.style.display='';
				if(!height){height = parseInt(_render.content.offsetHeight);}
				if(!width){width = parseInt(_render.content.offsetWidth);}
				_render.content.style.display='none'
			}
			_render.inner.style.width=x;
			_render.inner.style.height=y;
			this.size(width,height,animate)
		}
	,	button:function(name,fn,classes){
			var btn
			,	_r = this.render();
			;
			name = name.split('##');
			classes = classes ? classes+' ' : '';
			if(name.length){
				classes+=' '+name[1];
			}
			name = name.shift();
			btn = createCallBackButton(name,fn,classes,this);
			_r.buttons.appendChild(btn);
			return this;
		}
	,	buttons:function(buttons,classes){
			for(var n in buttons){
				this.button(n,buttons[n],classes);
			}
			return this;
		}
	}
	
	return ModalBox;
	
})