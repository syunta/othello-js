var table = new othelloTable();
var ai = new AI();
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

/* AI */
function AI(){
	this.select = function(){
		var position = {x:1,y:1};
		return position;
	}
}

//////////////////////関数//////////////////////
/* 手番の流れ */
function phaseAction(){
	var x = 0;
	var y = 0;
	x = Number(document.getElementById("X").value);
	y = Number(document.getElementById("Y").value);
	
	if( checkPlacement(x,y) && checkReverse(x,y) ){
		put(x,y);
		reverse(x,y);
		phaseChange();
	}
	
	/* AIの手番 */
	put(ai.select().x,ai.select().y);
	reverse(ai.select().x,ai.select().y);
	phaseChange();
	
	drawTable();
}

/* 石が置けるか判定 */
function checkPlacement(x,y){
	if(table.status[x][y] == "○" || table.status[x][y] == "●"){
		alert("すでに石が置いてあります");
		return false;
	}else{
		return true;
	}
}

/* 石が裏返るか判定 */
function checkReverse(x,y){
	
	var result = 0;
	console.log(result);
	var theBack = "";
	
	if(phase == "black"){
		theFront = "●";
		theBack = "○";
	}else if(phase == "white"){
		theFront = "○";
		theBack = "●";
	}
	
	for(var direction = 0; direction < 8; direction++){
		var count = 0;
		var squareCount = 1;
		while(true){
			console.log(result);
			if( getTableStatus(x,y,squareCount,direction) == theBack){
				count++;
				squareCount++;
			}else if( getTableStatus(x,y,squareCount,direction) == theFront){
				if(count != 0){
					result++;
				}
				break;
			}else{
				count = 0;
				break;
			}
		}
	}
	
	if(result != 0){
		console.log(result);
		return true;
	}else{
		alert("石を置けません");
		return false;
	}
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
		theFront = "●";
		theBack = "○";
	}else if(phase == "white"){
		theFront = "○";
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
			}else if( getTableStatus(x,y,squareCount,direction) == theFront){
				break;
			}else{
				count = 0;
				break;
			}
		}
		for(var i = 0; i <= count; i++){
			setTableStatus(x,y,i,direction,theFront);
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

function setTableStatus(x,y,i,num,theFront){
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

	table.status[direction[num].nx][direction[num].ny] = theFront;
}