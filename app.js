var table = new othelloTable();
var fase = "black";

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
		["","○","●",""],
		["","○","●",""],
		["","","",""]
	];
}

//////////////////////関数//////////////////////
function put(){
	var x = 0;
	var y = 0;
	x = Number(document.getElementById("X").value);
	y = Number(document.getElementById("Y").value);
	
	if(fase == "black"){
		table.status[x-1][y-1] = "●";
	}else if(fase == "white"){
		table.status[x-1][y-1] = "○";
	}
	
	if(fase == "black"){
		fase = "white";
	}else if(fase == "white"){
		fase = "black";
	}
	drawTable();
}