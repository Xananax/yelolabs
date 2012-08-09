define({
	version: '0.1'
,	load: function(name, req, load, config){
        req(['deps/text!' + name,'deps/less'], function(lessText){
            var styleElem;
			(new less.Parser()).parse(lessText, function (err, css) {
				if (err) {
					console.error(err);
				} else {
					styleElem = document.createElement('style');
					styleElem.type = 'text/css';
					if (styleElem.styleSheet){styleElem.styleSheet.cssText = css.toCSS();}
					else{styleElem.appendChild(document.createTextNode(css.toCSS()));}
					document.getElementsByTagName("head")[0].appendChild(styleElem);
				}
				load(styleElem);
			});
        });     
    }

});

