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
var phase = "●";
var passCount = 0;;

function test(){
	
	console.log(makeGameTree(table.status,phase));
	
}

function makeGameTree(tableStatus,phase){
	return{
		tableStatus:tableStatus,
		phase:phase,
		positions:makeTreeChild(tableStatus,phase)
	};
}

function makeTreeChild(tableStatus,phase){
	var positions = [];
	
	for(var y = 1; y <= 4; y++){
		for(var x = 1; x <= 4; x++){
			if( checkPlacement(x,y) && checkReverse(x,y) ){
				positions.push(
					makeGameTree(
						makeNextTable(tableStatus,phase,x,y),
						nextPhase(phase)
					)
				);
			}
		}
	}
	
	return positions;
}

function makeNextTable(tableStatus,phase,x,y){
	
	tableStatus[x][y] = phase;
	
}
function nextPhase(phase){
	var nextPhase = "";
	if(phase == "●"){
		nextPhase = "○";
	}else if(phase == "○"){
		nextPhase = "●";
	}
	
	return nextPhase;
}

//////////////////////オブジェクトを定義//////////////////////
/* オセロ盤 */

function othelloTable(){
	this.status = [
		["dummy","dummy","dummy","dummy","dummy","dummy"],
		["dummy","","","","","dummy"],
		["dummy","","○","●","","dummy"],
		["dummy","","●","○","","dummy"],
		["dummy","","","","","dummy"],
		["dummy","dummy","dummy","dummy","dummy","dummy"]
	];
}

/* AI */
function AI(){
	/* スコアテーブル */
	this.scoreTable = [
		[-1,-1,-1,-1,-1,-1],
		[-1, 9, 0, 0, 9,-1],
		[-1, 0, 1, 1, 0,-1],
		[-1, 0, 1, 1, 0,-1],
		[-1, 9, 0, 0, 9,-1],
		[-1,-1,-1,-1,-1,-1]
	];
	
	/* 置ける場所の記憶 */
	this.memory = [];
	
	/* 石を置ける場所を網羅検索 */
	this.search = function(){
		
		this.memory = listPossiblePositions();
		
	}
	
	/* 手を選ぶ */
	this.select = function(){
		
		var selection ={};
		var highScore = 0;
		
		for(var i = 0; i < this.memory.length; i++){
			if(highScore <= this.scoreTable[this.memory[i].x][this.memory[i].y]){
				selection = {x:this.memory[i].x,y:this.memory[i].y};
				highScore = this.scoreTable[this.memory[i].x][this.memory[i].y];
			}
		}
		
		var position = {x:selection.x,y:selection.y};
		console.log(position);
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
	
	passCount = 1;
	
	var x = 0;
	var y = 0;
	x = Number(document.getElementById("X").value);
	y = Number(document.getElementById("Y").value);
	
	if(listPossiblePositions().length != 0){
		passCount = 0;
	}
	
	if(passCount == 1){
		phaseChange();
		/* AIの手番 */
		setTimeout(aiAction,1000);
	}else if( checkPlacement(x,y) && checkReverse(x,y) ){
		put(x,y);
		reverse(x,y);
		phaseChange();
		drawTable();

		/* AIの手番 */
		setTimeout(aiAction,1000);
	}else{
		alert("石を置けません");
	}
	
}

function aiAction(){
	var gameEndFlag = true;
	var selectedPosition = {};
	
	ai.search();
	selectedPosition = ai.select();
	if(ai.memory.length != 0){
		put(selectedPosition.x,selectedPosition.y);
		reverse(selectedPosition.x,selectedPosition.y);
	}else{
		passCount += 1;
	}
	ai.forget();
	phaseChange();
	drawTable();
	
	if(passCount == 2){
		gameOver();
	}
	
	if(listPossiblePositions().length != 0){
		gameEndFlag = false;
	}
	
	if(gameEndFlag){
		gameOver();
	}
	
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

	if(phase == "●"){
		theFront = "●";
		theBack = "○";
	}else if(phase == "○"){
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
	if(phase == "●"){
		table.status[x][y] = "●";
	}else if(phase == "○"){
		table.status[x][y] = "○";
	}
}

/* 石を裏返す */
function reverse(x,y){

	var theBack = "";

	if(phase == "●"){
		theFront = "●";
		theBack = "○";
	}else if(phase == "○"){
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
	if(phase == "●"){
		phase = "○";
	}else if(phase == "○"){
		phase = "●";
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

/* ゲーム終了 */
function gameOver(){
	alert("ゲームセット！！");
}

//////////////////////関数ライブラリ//////////////////////
/* 盤面の状態を見て置けるところを返す */
function listPossiblePositions(){
	var positions = [];

	for(var y = 1; y <= 4; y++){
		for(var x = 1; x <= 4; x++){
			if( checkPlacement(x,y) && checkReverse(x,y) ){
				positions.push({x:x,y:y});
			}
		}
	}
	
	return positions;
}
