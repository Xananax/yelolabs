define(function(){

	function rand(probas){
		var possibilities = [], n, i;
  		for(n in probas){
  			for(i=0;i<probas[n];i++){
  				possibilities.push(n);
  			}
  		}
  		return possibilities[Math.floor(Math.random() * possibilities.length)];
	}

	var ItemsTemplate = Handlebars.compile('{{#each items}}<div class="stackItem {{class}}"></div>{{/each}}');


	return function(Stack,template,insert){
		insert(template());
		var container = document.getElementById('ItemsContainer');
		var stack = new Stack(container,{
			width:600
		,	cellWidth:20
		,	cellHeight:20
		,	mainClassName:'stackContainer'
		,	selectorClass:'stackItem'
		,	landscape:'landscape'
		,	portrait:'portrait'
		});
		var f = document.getElementById('StackForm');
		f.onsubmit = function(){
			var data = [];
			var total = parseInt(f.lines.value) + parseInt(f.blocks.value) + parseInt(f.squares.value) + parseInt(f.boxes.value);
			if(total != 100){
				var msg = 'your values do no amount to 100%! they amount to '+total+'.\n';
				if(total > 100){msg+=' retrieve '+(total-100)+' from somwhere';}
				else{msg+=' add '+(100-total)+' from somwhere';}
				alert(msg);
				return false;
			}
			var types = {
				'landscape2 portrait1 line':parseInt(f.lines.value) || 40
			,	'landscape1 portrait2 block':parseInt(f.blocks.value) || 40
			,	'landscape1 portrait1 square':parseInt(f.squares.value) || 10
			,	'landscape2 portrait2 box':parseInt(f.boxes.value) || 10
			}
			var n = parseInt(f.number.value) || 50;
			for(var i=0; i<n;i++){
				data.push({'class':rand(types)})
			}
			container.innerHTML+=ItemsTemplate({items:data})
			container.style.height = stack.fit(true).height() + 'px';
			return false;
		}
	}

})
