define(function(){

	return function(Modal,template,insert){
		insert(template());
		//var n = Modal('Yeeeey##assets/banana_small.jpg',{
		//	'yes it\'s cool##cmip cmap':function(){console.log('a');}
		//,	'no':function(){console.log('b');}
		//}).show();
		var c = document.getElementById('ModalContent');
		var b = document.getElementById('ModalButtons');
		var s = document.getElementById('ModalSize');
		document.getElementById('ModalForm').onsubmit = function(e){
			var content = c.value;
			var buttons = b.value;
			var sizes = s.value.split(',');
			var n = Modal(content);
			if(buttons){
				buttons = buttons.split(',');
				var btns = {};
				var btnName;
				for(var i=0; i<buttons.length; i++){
					btnName = buttons[i];
					btns[btnName] = (btnName == 'close' || btnName == 'cancel') ? 
					function(name,box,classes){
						box.hide();
						alert('you clicked '+name+', which closed the box');
					}
					:
					function(name,box,classes){
						alert('you clicked '+name);
					}
					;
				}
				n.buttons(btns);
			}
			n._options.width = sizes[0] || '';
			n._options.height = sizes[1] || '';
			n.show();
			e.returnValue = false; 
			return false;
		}
	}

})
