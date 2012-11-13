define(function(){

	return function(Snap,template,insert){
		insert(template());
		var container = document.getElementById('SnapContainer');
		var snapBox1 = document.getElementById('Snapper1')
		var snapBox2 = document.getElementById('Snapper2')
		new Snap({
			element: snapBox1
		,	container: container
		,	interval: 200
		,	size: 10
		});
		new Snap({
			element: snapBox2
		,	container: container
		,	interval: 300
		,	size: 10
		});
	}

})