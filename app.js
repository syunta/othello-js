//////////////////////HTML描画//////////////////////
function drawTable(){
	var text = "";

	for(var y = 1; y <= tableArea; y++){
		for(var x = 1; x <= tableArea; x++){
			if(x != 1){
				text +="<div onclick='phaseAction("+x+","+y+")'>" + table.status[x][y] + "</div>";
			}else{
				text +="<div onclick='phaseAction("+x+","+y+")' class='topColumn'>" + table.status[x][y] + "</div>";
			}
		}
		text += "<br>";
	}

	document.getElementById("othelloTable").innerHTML = text;
}
//////////////////////変数を定義//////////////////////
var tableArea = 8;
var table = new othelloTable();
var ai = new AI();
var gamePhase = "●";
var passCount = 0;
var direction = [
	{nx: 0,ny:-1},
	{nx: 1,ny:-1},
	{nx: 1,ny: 0},
	{nx: 1,ny: 1},
	{nx: 0,ny: 1},
	{nx:-1,ny: 1},
	{nx:-1,ny: 0},
	{nx:-1,ny:-1}
];
//////////////////////オブジェクトを定義//////////////////////
/* オセロ盤 */
function othelloTable(){
	
	var defaultStatus = [];
	
	for(var x = 0; x <= tableArea+1; x++){
		defaultStatus[x] = [];
	}

	for(var y = 0; y <= tableArea+1; y++){
		for(var x = 0; x <= tableArea+1; x++){
			if(y == 0 || x == 0){
				defaultStatus[x][y] = "■";
			}else if(y == tableArea+1 || x == tableArea+1){
				defaultStatus[x][y] = "■";
			}else{
				defaultStatus[x][y] = " ";
			}
		}
	}
	var pos = tableArea/2;
	defaultStatus[pos+1][pos+1] = "○";
	defaultStatus[pos][pos] = "○";
	defaultStatus[pos][pos+1] = "●";
	defaultStatus[pos+1][pos] = "●";
	
	
	this.status = defaultStatus;
}

/* AI */
function test(){
	console.log(ai.scoreTable.join("\n"));
}

function AI(){
	/* スコアテーブル */
	var score = [];
	
	for(var x = 0; x <= tableArea+1; x++){
		score[x] = [];
	}
	
	for(var y = 0; y <= tableArea+1; y++){
		for(var x = 0; x <= tableArea+1; x++){
			if(y == 0 || x == 0){
				score[x][y] = "■";
			}else if(y == tableArea+1 || x == tableArea+1){
				score[x][y] = "■";
			}else if(x == 1 || y == tableArea){
				score[x][y] = 9;
			}else{
				score[x][y] = 0;
			}
		}
	}
	
	this.scoreTable = score;
	
//	[9,0,1,1,1,1,0,9],
//	[0,0,2,2,2,2,0,0],
//	[1,2,3,3,3,3,2,1],
//	[1,2,3,4,4,3,2,1],
//	[1,2,3,4,4,3,2,1],
//	[1,2,3,3,3,3.2,1],
//	[0,0,2,2,2,2,0,0],
//	[9,0,1,1,1,1,0,9]

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
function phaseAction(x,y){
	
	passCount = 1;
	
	if(listPossiblePositions(table.status,gamePhase).length != 0){
		passCount = 0;
	}

	if(passCount == 1){
		gamePhase = changePhase(gamePhase);
		showPhase();
		/* AIの手番 */
//		setTimeout(aiAction,1000);
	}else if(checkPlacement(table.status,x,y) && countReverse(table.status,x,y,gamePhase).length != 0){
		put(table.status,x,y,gamePhase);
		reverse(table.status,x,y,gamePhase);
		gamePhase = changePhase(gamePhase);
		drawTable();
		showPhase(gamePhase);
		
		/* AIの手番 */
//		setTimeout(aiAction,1000);
	}else{
		showWarning();
		setTimeout(erase,800);
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

/* ゲーム終了 */
function gameOver(){
	alert("ゲームセット！！");
}
/* 警告メッセージを表示 */
function showWarning(){
	document.getElementById("message").innerHTML 
			+= "<h1>石を置けません</h1>";
}
/* 手番を表示 */
function showPhase(phase){
	if(phase == "●"){
		document.getElementById("phase").innerHTML = "<h1>黒の番です</h1>";
	}else if(phase == "○"){
		document.getElementById("phase").innerHTML = "<h1>白の番です</h1>";
	}
}
/* メッセージを消す */
function erase(){
	document.getElementById("message").innerHTML 
		= "";
}

//////////////////////ツリーを生成//////////////////////
function makeRoot(){
	
	var phase = "●";
	var root = cloneArray(table.status);
	
	var depth = 4;
	var passCnt = 0;
	
	makeBranch(root,phase,depth,passCnt);
}

function makeBranch(node,phase,depth,passCnt){
	
	if(passCnt < 2 && 0 < depth){
		var branch = listPossiblePositions(node,phase);
		
		if( branch.length != 0){
			passCnt = 0;
			for(var i = 0; i < branch.length; i++){
				makeNode(cloneArray(node),branch[i].x,branch[i].y,phase,depth,passCnt);
			}
			
		}else{
			/* パスが発生した場合 */
			var nextPhase = changePhase(phase);
			depth -= 1;
			passCnt += 1;
			makeBranch(node,nextPhase,depth,passCnt)
		}
	}else{
		/* リーフを出力 */
		console.log(node.join("\n"));
	}
}

function makeNode(parentNode,x,y,phase,depth,passCnt){
	var newNode = put(parentNode,x,y,phase);
	reverse(newNode,x,y,phase);
	
	var nextPhase = changePhase(phase);
	
	depth -= 1;
	
	makeBranch(newNode,nextPhase,depth,passCnt);
	
}

/* 石を置く */
function put(tableStatus,x,y,phase){
	
	if(phase == "●"){
		tableStatus[x][y] = "●";
	}else if(phase == "○"){
		tableStatus[x][y] = "○";
	}
	return tableStatus;
}

/* 石を裏返す */
function reverse(tableStatus,x,y,phase){

	if(phase == "●"){
		theFront = "●";
		theBack = "○";
	}else if(phase == "○"){
		theFront = "○";
		theBack = "●";
	}

	/* 石を反転 */
	var reverse = countReverse(tableStatus,x,y,phase);
	
	for(var i = 0; i < reverse.length; i++){
		for(var j = 1; j <= reverse[i].count; j++){
			tableStatus
			[ x + j * direction[ reverse[i].dir ].nx ]
			[ y + j * direction[ reverse[i].dir ].ny ]
			 = theFront;
		 }
	}
	return tableStatus;
}

/* 盤が空いているか判定 */
function checkPlacement(tableStatus,x,y){
	if(tableStatus[x][y] == " "){
		return true;
	}else{
		return false;
	}
}

/* 裏返せる方向と裏返す石の数を数える */
function countReverse(tableStatus,x,y,phase){
	
	var result = [];
	
	if(phase == "●"){
		var theBack  = "○";
		var theFront = "●";
	}else if(phase == "○"){
		var theBack  = "●";
		var theFront = "○";
	}
	
	for(var i = 0; i < 8; i++){
		
		var sandwichedStone = 0;
		var squareNum = 1;
		
		while(true){
			var squareStatus = tableStatus
								[x+squareNum*direction[i].nx]
								[y+squareNum*direction[i].ny];
			if( squareStatus == theBack){
				sandwichedStone += 1;
				squareNum += 1;
			}
			else if( squareStatus == theFront)
			{
				if( 0 < sandwichedStone )
				{
					result.push({dir:i,count:sandwichedStone});
				}
				break;
			}else
			{
				break;
			}
			
		}
	}
	return result;
}

function changePhase(phase){
	if(phase == "●"){
		var nextPhase = "○";
	}else if(phase == "○"){
		var nextPhase = "●";
	}
	return nextPhase;
}

//////////////////////よく使う処理//////////////////////
/* 盤面の状態を見て置けるところを返す */
function listPossiblePositions(tableStatus,phase){
	var positions = [];
	
	for(var y = 1; y <= tableArea; y++){
		for(var x = 1; x <= tableArea; x++){
			if( checkPlacement(tableStatus,x,y) ){
				if( countReverse(tableStatus,x,y,phase).length != 0 ){
					positions.push({x:x,y:y});
				}
			}
		}
	}
	return positions;
}

/* 配列をクローン */
function cloneArray(arry){
	var newArry = [];
	for(var i = 0; i < arry.length; i++){
		if(arry[i] instanceof Array){
			newArry[i] = cloneArray(arry[i]);
		}else{
			newArry[i] = arry[i];
		}
	}
	return newArry;
}