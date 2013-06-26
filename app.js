var table = new othelloTable();
var phase = "black";

function drawTable(){
	var text ="";
	
	for(var y = 0; y < table.status.length; y++){
		for(var x = 0; x < table.status.length; x++){
			if(x != 0){
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
		["","","",""],
		["","○","",""],
		["","○","",""],
		["","●","",""]
	];
}

//////////////////////関数//////////////////////
/* 石を置く */
function put(){
	var x = 0;
	var y = 0;
	x = Number(document.getElementById("X").value);
	y = Number(document.getElementById("Y").value);
	
	if(phase == "black"){
		table.status[x][y] = "●";
	}else if(phase == "white"){
		table.status[x][y] = "○";
	}
	
	reverse(x,y);
	
	if(phase == "black"){
		phase = "white";
	}else if(phase == "white"){
		phase = "black";
	}
	
	drawTable();
}

/* 石を裏返す */
function reverse(x,y){
	
	var count = 0;
	var theBack = "";
	
	if(phase == "black"){
		theBack = "○";
	}else if(phase == "white"){
		theBack = "●";
	}
	
	/* 右方向反転 */
	for(var i = 1; table.status[x+i][y] == theBack; i++){
		count = i;
	}
	for(var i = 0; i <= count; i++){
		table.status[x+i][y] = table.status[x][y];
	}
}