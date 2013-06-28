//////////////////////HTML描画//////////////////////
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
//////////////////////変数を定義//////////////////////
var table = new othelloTable();
var ai = new AI();
var phase = "black";
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

	/* 置ける場所の記憶 */
	this.memory = new Array();

	/* 石を置ける場所を網羅検索 */
	this.search = function(){

		for(var j = 1; j <= 4; j++){
			for(var i = 1; i <= 4; i++){
				if( checkPlacement(i,j) && checkReverse(i,j) ){
					this.memory[this.memory.length] = {x:i,y:j};
				}
			}
		}

		for(var i = 0; i < this.memory.length; i++){
			console.log(this.memory[i]);
		}

	}

	/* 手を選ぶ */
	this.select = function(){

		var position = {x:this.memory[0].x,y:this.memory[0].y};

		return position;
	}
	/* 忘れる */
	this.forget = function(){
		this.memory.splice(0,this.memory.length);
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
		drawTable();

		/* AIの手番 */
		setTimeout(aiAction,1000)
	}else{
		alert("石を置けません");
	}
}

function aiAction(){
	ai.search();
	put(ai.select().x,ai.select().y);
	reverse(ai.select().x,ai.select().y);
	ai.forget();
	phaseChange();
	drawTable();
}

/* 石が置けるか判定 */
function checkPlacement(x,y){
	if(table.status[x][y] == "○" || table.status[x][y] == "●"){
		return false;
	}else{
		return true;
	}
}

/* 石が裏返るか判定 */
function checkReverse(x,y){

	var result = 0;
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
		return true;
	}else{
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

/* 手番の交代 */
function phaseChange(){
	if(phase == "black"){
		phase = "white";
	}else if(phase == "white"){
		phase = "black";
	}
}

var directionCorrection = [
	{nx: 0,ny:-1},
	{nx: 1,ny:-1},
	{nx: 1,ny: 0},
	{nx: 1,ny: 1},
	{nx: 0,ny: 1},
	{nx:-1,ny: 1},
	{nx:-1,ny: 0},
	{nx:-1,ny:-1}
];

function getTableStatus(x,y,i,num){
	return table.status[x+i*directionCorrection[num].nx][y+i*directionCorrection[num].ny];
}

function setTableStatus(x,y,i,num,theFront){
	table.status[x+i*directionCorrection[num].nx][y+i*directionCorrection[num].ny] = theFront;
}