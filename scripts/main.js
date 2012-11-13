var loadLab = function(name){}
require(['require','deps/domReady','deps/less'],function(require,domReady,less){

	var labs = ['deferredImage','grid','stack','polledEvent','snap','modal'];
	var labsLoaded = [];
	var container = document.getElementById('Wrapper');

	var gotoLab = function(name){
		document.getElementById(name).scrollIntoView(true);
	}

	loadLab = function(name){
		if(labsLoaded.indexOf(name)==-1){
			labsLoaded.push(name);
			var modulePath = 'labs/'+name+'/index'
			,	path = 'labs/'+name+'/test'
			,	template = 'deps/text!labs/'+name+'/index.html'
			,	styles = 'yelo/less!labs/'+name+'/style.less'
			,	description = 'deps/text!labs/'+name+'/description.html'
			;
			require([modulePath,path,template,styles,description],function(lab,test,template,styles,description){
				template = Handlebars.compile(
					'<div id="'+name+'" class="lab '+name+' clearfix"><h1 class="labTitle"><a href="'+modulePath+'.js">'
					+	name
					+'</a></h1><p class="labDescription">'
					+	description
					+'</p>'
					+template
					+'</div>'
				);
				test(lab,template,function(add){
					container.innerHTML+=add;
					gotoLab(name);
				})
			});	
		}else{
			gotoLab(name);
			return false;
		}
	}

	domReady(function(){
		var insert = document.getElementById('TopMenu');
		var source = document.getElementById('Labs').innerHTML;	
		var template = Handlebars.compile(source);
		insert.innerHTML = template({labs:labs});
	})

});
