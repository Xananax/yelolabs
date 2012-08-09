define(function(){
	
	var regexp = /(?:img.*?)(width)(?:\s?=\s?["'])(\d*)(?:.*?)(height)(?:\s?=\s?["'])(\d*)/ig
	,	tags = {}
	,	callbacks = {}
	,	get = function(_tag, _callback){
			_tag = _tag.toLowerCase();
			if(_callback){
				callbacks[_tag] = (function(t){
					return function(feed){
						tags[t] = feed.items;
						_callback(feed.items,t,feed)
					}
				})(_tag);
			}else{
				callbacks[_tag] = (function(t){
					return function(feed){
						tags[t] = feed.items;
					}
				})()
			}
			var s = document.createElement('script');
			s.src = 'http://flickr.com/services/feeds/photos_public.gne?tags=' + _tag + '&format=json';
			document.getElementsByTagName('head')[0].appendChild(s);
		}
	,	augmentResults = function(items){
			var desc, n, item,match, results;
			for(n in items){
				item = items[n];
				desc = item.description;
				match = regexp.exec(desc);
				results = [];
				while(match!==null){
					item[match[1]] = match[2];
					item[match[3]] = match[4];
					match = regexp.exec(desc);
				}
			}
		}
	;
	get.items = tags;
	window.jsonFlickrFeed = function(feed){
		var tag = feed.title.replace('Recent Uploads tagged ','').toLowerCase();
		augmentResults(feed.items);
		if(callbacks[tag]){
			callbacks[tag](feed);
			delete callbacks[tag];
		}
	}

	return get;

});
