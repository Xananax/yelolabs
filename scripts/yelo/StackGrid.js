define(function(){

	var newFilledArray = function(length, val) {
		var array = [];
		var i = 0;
		while (i < length) {
			array[i++] = val;
		}
		return array;
	}

	var StackGrid = function(cols, rows, defaultVal){
		this.grid = [];
		this.cols = cols || 10;
		this.defaultVal = defaultVal || false;
		if(rows){
			for(var n=0; n<rows;n++){
				this.grid.push(newFilledArray(cols,this.defaultVal));
			}
		}
	}

	StackGrid.prototype = {
		constructor:StackGrid
	,	setCols:function(cols){
			this.cols = cols;
		}
	,	getCell:function(coordX,coordY){
			if(!this.grid[coordY] || !this.grid[coordY][coordX]){return false;}
			return this.grid[coordY][coordX];
		}
	,	getCellRange:function(start,end,val){
			var currX
			,	maxX = Math.max(start[0],end[0])
			,	minX = Math.min(start[0],end[0])
			,	maxY = Math.max(start[1],end[1])
			,	minY = Math.min(start[1],end[1])
			,	answer = {}
			;
			if(maxX==minX && maxY==minY){return this.getCell(maxX,maxY);}
			while(minY<=maxY){
				answer[minY] = {};
				currX = minX;
				while(currX<=maxX){
					answer[minY][currX] = this.getCell(currX,minY,val);
					currX++;
				}
				answer[minY].length = maxX;
				minY++;
			}
			answer.lengh = minY;
			return answer;		
		}
	,	isEmptyCellRange:function(start,end){
			var currX
			,	maxX = Math.max(start[0],end[0])
			,	minX = Math.min(start[0],end[0])
			,	maxY = Math.max(start[1],end[1])
			,	minY = Math.min(start[1],end[1])
			,	answer = true
			;
			if(maxX==minX && maxY==minY){
				return this.getCell(maxX,maxY) !== false ? false : true;
			}
			while(minY<=maxY){
				currX = minX;
				while(currX<=maxX){
					answer = this.getCell(currX,minY);
					if(answer !== false){return false;}
					currX++;
				}
				minY++;
			}
			return true;	
		}
	,	getNextEmptyCellRange:function(sizeX,sizeY){
			var currX
			,	g = this.grid
			,	row = 0
			,	rows = g.length
			,	col = 0
			,	cols
			;
			for(row=0;row<rows;row++){
				if(!g[row]){break;}
				cols = g[row].length
				for(col = 0; col < cols;col++){
					if(col+sizeX>cols){break;}
					//console.log('finding next empty range: start',col,row,'end',col+sizeX-1,row+sizeY-1,'size',sizeX,sizeY)
					if(this.isEmptyCellRange([col,row],[col+sizeX-1,row+sizeY-1])){
						//console.log('found! start',col,row,'end',col+sizeX,row+sizeY,'size',sizeX,sizeY)
						return [col,row];
					}
				}
				col = 0;
			}
			return [col,row];
		}
	,	setNextEmptyCellRange:function(sizeX,sizeY,val){
			var next = this.getNextEmptyCellRange(sizeX,sizeY);
			this.setCellRange(next,[next[0]+sizeX-1,next[1]+sizeY-1],val);
			return next;
		}
	,	setCell:function(coordX,coordY,val){
			if(!val){val = true;}
			while(this.grid.length<=coordY){
				this.grid.push(newFilledArray(this.cols,this.defaultVal));
			}
			this.grid[coordY][coordX] = val || false;
			return this;
		}
	,	setCellRange:function(start,end,val){
			var currX
			,	maxX = Math.max(start[0],end[0])
			,	minX = Math.min(start[0],end[0])
			,	maxY = Math.max(start[1],end[1])
			,	minY = Math.min(start[1],end[1])
			;
			if(maxX==minX && maxY==minY){this.setCell(maxX,maxY,val);return this;}
			while(minY<=maxY){
				currX = minX
				while(currX<=maxX){
					this.setCell(currX,minY,val);
					currX++;
				}
				minY++;
			}
		}
	,	valAsString:function(val){
			if(val === true){return '1';}
			if(val === false){return '';}
			return val;
		}
	,	toString:function(html,g){
			var str = html ? '<table>' : ''
			,	bol = html? '<tr>' : ''
			,	eol = html? '</tr>' : '\n'
			,	boc = html? '<td style="border:1px solid black;">':''
			,	eoc = html? '</td>':'\t'
			,	boch = html ? '<th>' : ''
			,	eoch = html ? '</th>' : '\t'
			,	bolh = html ? '<thead><tr>':''
			,	eolh = html ? '</tr></thead><tbody>':'\n'
			,	strEnd = html ? '</tbody></table>':''
			,	g = g || this.grid
			,	i,n,h
			;
			str+=bolh+boch+'&nbsp;'+eoch;
			for(h=0;h< this.cols;h++){
				str+=boch+h+eoch;
			}
			str+=eolh;
			for(i = 0;i<g.length;i++){
				str+=bol+boch+i+eoch;
				for(n=0;n< g[i].length ; n++){
					str+=boc+this.valAsString(g[i][n])+eoc;
				}
				str+=eol;
			}
			str+=strEnd;
			return str;
		}
	}

	return StackGrid;

})