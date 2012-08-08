define(['yelo/Visible'],function(visible){

	var defaults = {
		className:'picture'
	,	loadedClass:'loaded'
	,	inViewClass:'inView'
	,	interval:500
	}
,	scrollTimer = null
,	hasScrolled = true
,	hasInit = false
,	items
,	i = 0
,	d = document
,	w = window
,	check = function(){
		var item;
		if(!hasScrolled){return;}
		hasScrolled = false;
		for(i=0;i<items.length;i++){
			item = items[i]
			if(visible(item,true)){
				item.className+=' '+defaults.inViewClass;
				showImage(item);
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
,	showImage = function(item){
		if(item.className.match(defaults.loadedClass)!=null){return;}
		item.className+=' '+defaults.loadedClass;
		item.style.backgroundImage = item.getAttribute('data-src');
	}
	;

	init.items = addItems;

	if(w.attachEvent){w.attachEvent('onscroll',onScroll)}else{w.addEventListener('scroll',onScroll);};


	return init;

});
