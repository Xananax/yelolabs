define(['yelo/Visible'],function(visible){

	var defaults = {
		className:'picture'
	,	loadedClass:'loaded'
	,	inViewClass:'inView'
	,	invisibleClass:'forFadeIn'
	,	fadeInClass:'fadeIn'
	,	interval:500
	,	simultaneous:0
	,	fullImage:false
	,	show:function(item,src){
			item.style.backgroundImage = 'url("'+src+'")';
			//item.className = item.className.replace(' '+defaults.invisibleClass,'')
			item.className+=' '+defaults.fadeInClass;
		}
	,	load:function(item,src,show){
			var image = new Image();
			image.onload = function(){show(item,src);};
			image.src = src;
		}
	}
,	scrollTimer = null
,	hasScrolled = true
,	hasInit = false
,	items
,	i = 0
,	d = document
,	w = window
,	queue = []
,	check = function(){
		var item;
		if(!hasScrolled){return;}
		hasScrolled = false;
		for(i=0;i<items.length;i++){
			item = items[i]
			if(visible(item,defaults.fullImage)){
				if(item.className.match(defaults.inViewClass)==null){
					item.className+=' '+defaults.inViewClass;
				}
				processImage(item);
			}else{
				item.className = item.className.replace(' '+defaults.inViewClass,'');
			}
		}
	}
,	onScroll = function(){
		hasScrolled = true;
	}
,	addItems = function(newItems){
		items = newItems;
	}
,	init = function(props){
		if(props){
			for(var n in props){
				defaults[n] = props[n];
			}
		}
		if(hasInit){return true;}
		items = d.getElementsByClassName('picture');
		if(!items.length){return false;}
		hasInit = true;
		scrollTimer = setInterval(check,defaults.interval);
		check();
	}
,	processImage = function(item){
		if(item.className.match(defaults.loadedClass)!=null){return;}
		item.className+=' '+defaults.loadedClass;
		item.className+=' '+defaults.invisibleClass;
		defaults.load(item, item.getAttribute('data-src'),defaults.show);
	}
	;

	init.items = addItems;

	if(w.attachEvent){w.attachEvent('onscroll',onScroll)}else{w.addEventListener('scroll',onScroll);};


	return init;

});
