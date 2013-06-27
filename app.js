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
		["dummy","","●","○","","dummy"],
		["dummy","","","","","dummy"],
		["dummy","dummy","dummy","dummy"]
	];
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
	
	/* 反転チェック */
	var num = 0;
	var i = 1;
	var test = "";
	test = setDirection(x,y,num,i);
	console.log(test);
	
	for(var num = 0; num < 4; num++){
		
		var count = reverseCheck(x,y,num,theBack);
		
		console.log(count);
		
		//for(var i = 0; i <= count; i++){
		//	var reversedStone = setDirection(x,y,num,i) 
		//	reversedStone = table.status[x][y];
		//}
	}
}

function reverseCheck(x,y,num,theBack){
	
	var count = 0;
	
		for(var i = 0; setDirection(x,y,num,i) == theBack; i++){
			
			count++;
			
			if(table.status[x][y+i] != table.status[x][y]){
				count = 0;
			}
		}
	return count;
}

function setDirection(x,y,num,i){
	var direction = [
		table.status[x][y-i],
		table.status[x+i][y],
		table.status[x][y+i],
		table.status[x-i][y]
	];
	
	console.log(direction[num]);
	
	return direction[num];
}