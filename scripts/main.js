var loadLab = function(name){}
require(['require','deps/domReady','deps/less'],function(require,domReady,less){

	var labs = ['deferredImage'];

	loadLab = function(name){
		var module = 'labs/'+name+'/index'
		,	path = 'labs/'+name+'/test'
		,	template = 'deps/text!labs/'+name+'/index.html'
		,	styles = 'yelo/less!labs/'+name+'/style.less'
		;
		require([module,path,template,styles],function(lab,test,template,styles){
			template = Handlebars.compile('<div class="lab '+name+' clearfix"><h1 class="labTitle">'+name+'</h1>'+template+'</div>');
			test(lab,template,function(add){document.body.innerHTML+=add;})
		});	
		return false;
	}

	domReady(function(){
		var insert = document.getElementById('TopMenu');
		var source = document.getElementById('Labs').innerHTML;	
		var template = Handlebars.compile(source);
		insert.innerHTML = template({labs:labs});
	})

});
