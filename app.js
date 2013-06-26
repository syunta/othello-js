var table = new othelloTable();

function drawTable(){
	var text ="";
	
	for(var y = 0; y < table.status.length; y++){
		for(var x = 0; x < table.status.length; x++){
			if(x != 0){
				text +="<div>" + table.status[x][y] + "</div>";
			}else{
				text +="<div class=topColumn>" + table.status[x][y] + "</div>";
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