var loadLab = function(name){}
require(['require','deps/domReady','deps/less'],function(require,domReady,less){

	var labs = ['deferredImage'];

	loadLab = function(name){
		var module = 'yelolabs/'+name+'/'+name
		,	path = 'yelolabs/'+name+'/test'
		,	template = 'deps/text!yelolabs/'+name+'/index.html'
		,	styles = 'yelo/less!yelolabs/'+name+'/style.less'
		;
		require([module,path,template,styles],function(lab,test,template,styles){
			template = Handlebars.compile('<div class="lab '+name+'"><h1 class="labTitle">'+name+'</h1>'+template+'</div>');
			test(lab,template,function(add){document.body.innerHTML+=add;})
		});	
	}

	domReady(function(){
		var insert = document.getElementsByTagName('body')[0];
		var source = document.getElementById('Labs').innerHTML;	
		var template = Handlebars.compile(source);
		insert.innerHTML = template({labs:labs});
	})

});
