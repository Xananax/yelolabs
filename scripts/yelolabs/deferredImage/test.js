define(['deps/reqwest','yelo/flickr'],function(reqwest,flickr){

	return function(deferredImage,template,insert){
		flickr('banana', function(items,tag,feed){
			console.log(items);
			insert(template({images:items}));
			deferredImage();
		});
	}

})
