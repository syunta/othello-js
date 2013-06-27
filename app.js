var table = new othelloTable();
var phase = "black";

function drawTable(){
	var text ="";
	
	for(var y = 1; y <= 4; y++){
		for(var x = 1; x <= 4; x++){
			if(x != 1){
				text +="<div>" + table.status[x][y] + "</div>";
			}else{
				text +="<div class='topColumn'>" + table.status[x][y] + "</div>";
			}
		}
		text += "<br>";
	}
	
	document.getElementById("othelloTable").innerHTML = text;
}


//////////////////////オブジェクトを定義//////////////////////
/* オセロ盤 */

function othelloTable(){
	this.status = [
		["dummy","dummy","dummy","dummy"],
		["dummy","","","","","dummy"],
		["dummy","","○","●","","dummy"],
		["dummy","","○","○","","dummy"],
		["dummy","","●","","","dummy"],
		["dummy","dummy","dummy","dummy"]
	];
	
	this.getStatus = function(x,y,i){
		return this.status[x][y];
	}
}

//////////////////////関数//////////////////////
/* 手番の流れ */
function phaseAction(){
	var x = 0;
	var y = 0;
	x = Number(document.getElementById("X").value);
	y = Number(document.getElementById("Y").value);
	
	put(x,y);
	reverse(x,y);
	phaseChange();
	drawTable();
}

/* 石を置く */
function put(x,y){
	
	if(phase == "black"){
		table.status[x][y] = "●";
	}else if(phase == "white"){
		table.status[x][y] = "○";
	}
}
/* 手番の交代 */
function phaseChange(){
	if(phase == "black"){
		phase = "white";
	}else if(phase == "white"){
		phase = "black";
	}
}

/* 石を裏返す */
function reverse(x,y){
	
	var theBack = "";
	
	if(phase == "black"){
		theBack = "○";
	}else if(phase == "white"){
		theBack = "●";
	}
	
	/* 石を反転 */
	for(var direction = 0; direction < 8; direction++){
		var count = 0;
		var squareCount = 1;
		while(true){
			if( getTableStatus(x,y,squareCount,direction) == theBack){
				count++;
				squareCount++;
			}else if( getTableStatus(x,y,squareCount,direction) == table.status[x][y]){
				break;
			}else{
				count = 0;
				break;
			}
		}
		for(var i = 0; i <= count; i++){
			setTableStatus(x,y,i,direction);
		}
	}
}

function getTableStatus(x,y,i,num){
	var direction = [
		{nx: x    , ny: y - i},
		{nx: x + i, ny: y    },
		{nx: x    , ny: y + i},
		{nx: x - i, ny: y    },
		
		{nx: x + i, ny: y + i},
		{nx: x + i, ny: y - i},
		{nx: x - i, ny: y + i},
		{nx: x - i, ny: y - i}
	];
	
	return table.status[direction[num].nx][direction[num].ny];
}

function setTableStatus(x,y,i,num){
	var direction = [
		{nx: x    , ny: y - i},
		{nx: x + i, ny: y    },
		{nx: x    , ny: y + i},
		{nx: x - i, ny: y    },
		
		{nx: x + i, ny: y + i},
		{nx: x + i, ny: y - i},
		{nx: x - i, ny: y + i},
		{nx: x - i, ny: y - i}
	];
	
	table.status[direction[num].nx][direction[num].ny] = table.status[x][y];
}