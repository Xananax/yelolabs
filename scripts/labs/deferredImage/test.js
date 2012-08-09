define(['deps/reqwest','yelo/flickr','yelo/Loader'],function(reqwest,flickr,Loader){

	var l = Loader({
		concurrent:5
	,	timeOut:60	
	})
	l.stop();

	var loadTag = function(tag,template,insert, deferredImage,btn){
		l.stop();
		flickr(tag, function(items,tag,feed){
			insert.innerHTML+=template({images:items});
			deferredImage();
			btn.value = 'go';
			l.resume();
		})
	}

	var ImageTemplate  = Handlebars.compile('{{#each images}}'
					+	'<div class="deferred">'
					+		'<div class="picture" data-src="{{media.m}}" title="{{title}}" style="width:{{width}}px;height:{{height}}px;background-repeat:no-repeat;background-position:0 0;"></div>'
					+		'<noscript>'
					+			'<img src="{{media.m}}.jpg" alt="{{title}}" width="{{width}}" height="{{height}}"/>'
					+		'</noscript>'
					+	'</div>'
					+'{{/each}}')

	return function(deferredImage,template,insert){
		insert(template({tag:'banana'}));
		var f = document.getElementById('FlickrLoader');
		var container = document.getElementById('FlickrContainer');
		f.onsubmit = function(){
			var val = f.tag.value;
			f.go.value = 'wait...';
			if(val){
				loadTag(val,ImageTemplate,container,deferredImage,f.go);
			}
			return false;
		}
		loadTag('banana',ImageTemplate,container, deferredImage,f.go);
	}

})
