define(function(){

	var d = document
	,	w = window
	,	isStyleVisible = function(obj){
			if (obj == d) return true

			if (!obj) return false
			if (!obj.parentNode) return false
			if (obj.style) {
				if (obj.style.display == 'none') return false
				if (obj.style.visibility == 'hidden') return false
			}

			//Try the computed style in a standard way
			if (w.getComputedStyle) {
				var style = w.getComputedStyle(obj, "")
				if (style.display == 'none') return false
				if (style.visibility == 'hidden') return false
			}

			//Or get the computed style using IE's silly proprietary way
			var style = obj.currentStyle
			if (style) {
				if (style['display'] == 'none') return false
				if (style['visibility'] == 'hidden') return false
			}
			return isStyleVisible(obj.parentNode)
		}
	,	getViewport = function(){
			return {
				top:0
			,	left:0
			,	bottom: (w.innerHeight ||  document.body.clientHeight)
			,	right:(w.innerWidth || document.body.clientWidth)
			};
		}
	,	getPosition = function(el){
			var sqr = el.getBoundingClientRect();	
			return {
				top:sqr.top
			,	left:sqr.left
			,	bottom:sqr.bottom
			,	right:sqr.right
			}
		}
	,	isElementInViewport = function(elem, totally){
			var r = getPosition(elem), v = getViewport();
			return totally ?
				(
					r.top >= v.top &&
					r.left >= v.left &&
					r.bottom <= v.bottom &&
					r.right <= v.right
				)
			:
				(
					r.top > v.top &&
					r.left > v.left &&
					r.top < v.bottom &&
					r.left < v.right
				)
			;
		}
	,	isVisible = function(el,totally){
			return isStyleVisible(el) && isElementInViewport(el,totally);
		}
	;

	isVisible.scroll = isElementInViewport;
	isVisible.position = getPosition;
	isVisible.viewport = getViewport;
	isVisible.style = isStyleVisible;

	return isVisible;

})
