define(function(){

	var currN = -1;
	var globN = 1;

	function rand(possibilities,exact){
		currN++;
		return exact ? possibilities[currN] : possibilities[Math.floor(Math.random() * possibilities.length)];
	}

	function createPossibilities(probas){
		var possibilities = [], n, i;
		for(n in probas){
			for(i=0;i<probas[n];i++){
				possibilities.push(n);
			}
		}
		return shuffle(possibilities);
	}

	shuffle = function(o){
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};

	var ItemsTemplate = Handlebars.compile('{{#each items}}<div class="stackItem {{class}}"><span>{{number}}</span></div>{{/each}}');


	return function(Stack,template,insert){
		insert(template());
		var container = document.getElementById('ItemsContainer');
		var ghostContainer = document.getElementById('ItemsGhostContainer');
		var stack = new Stack(container,{
			cellWidth:193
		,	cellHeight:151
		,	mainClassName:'stackContainer'
		,	selectorClass:'stackItem'
		,	landscape:'landscape'
		,	portrait:'portrait'
		});
		var f = document.getElementById('StackForm');
		f.onsubmit = function(){
			var data = [];
			var total = parseInt(f.lines.value) + parseInt(f.blocks.value) + parseInt(f.squares.value) + parseInt(f.boxes.value);
			var exact = f.exact.checked;
			if(!exact && total != 100){
				var msg = 'your values do no amount to 100%! they amount to '+total+'.\n';
				if(total > 100){msg+=' retrieve '+(total-100)+' from somwhere';}
				else{msg+=' add '+(100-total)+' from somewhere';}
				msg+=', or check "exact numbers"';
				alert(msg);
				return false;
			}
			var types = {
					'landscape1 portrait1 square': 	parseInt(f.squares.value) 	|| 0
				,	'landscape1 portrait2 block': 	parseInt(f.blocks.value) 	|| 0
				,	'landscape2 portrait1 line': 	parseInt(f.lines.value) 	|| 0
				,	'landscape2 portrait2 box': 	parseInt(f.boxes.value) 	|| 0
			}
			var n = exact ? total : parseInt(f.number.value) || 50;
			var possibilities = createPossibilities(types);
			for(var i=0; i<n;i++){
				data.push({'class':rand(possibilities,exact),'number':globN})
				globN++;
			}
			currN=-1;
			container.innerHTML+=ItemsTemplate({items:data});
			ghostContainer.innerHTML+=ItemsTemplate({items:data});
			container.style.height = stack.fit(true).height() + 'px';
			return false;
		}
	}

})
