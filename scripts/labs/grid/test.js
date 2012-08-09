define(function(){

	return function(StackGrid,template,insert){
		var s = new StackGrid(10,10);
		//s.setCellRange([2,2],[3,3]);
		insert(template(s.toString(true)));
		var f = document.getElementById('GridAdder');
		var gridContainer = document.getElementById('GridContainer');
		var adder = document.getElementById('Adder');
		adder.onclick = function(){
			s.setNextEmptyCellRange(parseInt(f.x.value),parseInt(f.y.value),f.val.value);
			gridContainer.innerHTML = s.toString(true);
			var tds = gridContainer.getElementsByTagName('td');
			for(var i = 0; i<tds.length;i++){
				if(tds[i].innerHTML){
					tds[i].className+=' contains';
				}
				else{
					tds[i].className = tds[i].className.replace(' contains','');
				}
			}
			return false;
		}
	}

})
