define(['deps/reqwest','yelo/flickr','yelo/Loader'],function(reqwest,flickr,Loader){

	var l = Loader({
		concurrent:1
	,	timeOut:60	
	})
	l.stop();

	return function(deferredImage,template,insert){
		flickr('banana', function(items,tag,feed){
			insert(template({images:items}));
			deferredImage({
				load:function(item,src,show){
					l.add(src,function(src,data){
						show(item,src);
					})
				}
			});
			l.resume();
		});
	}

})
