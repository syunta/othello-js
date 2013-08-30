var BOARD_SIZE = 8;

//////////////////////HTML描画//////////////////////
function drawTable(){
	var text = "";

	for(var y = 1; y <= BOARD_SIZE; y++){
		for(var x = 1; x <= BOARD_SIZE; x++){
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
var table = new othelloTable();
var ai = new AI();
var currentPlayer = "●";
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
	
	for(var x = 0; x <= BOARD_SIZE+1; x++){
		defaultStatus[x] = [];
	}

	for(var y = 0; y <= BOARD_SIZE+1; y++){
		for(var x = 0; x <= BOARD_SIZE+1; x++){
			if(y == 0 || x == 0){
				defaultStatus[x][y] = "■";
			}else if(y == BOARD_SIZE+1 || x == BOARD_SIZE+1){
				defaultStatus[x][y] = "■";
			}else{
				defaultStatus[x][y] = " ";
			}
		}
	}
	var pos = Math.floor(BOARD_SIZE/2);
	defaultStatus[pos+1][pos+1] = "○";
	defaultStatus[pos][pos] = "○";
	defaultStatus[pos][pos+1] = "●";
	defaultStatus[pos+1][pos] = "●";
	
	
	this.status = defaultStatus;
}

/* AI */
function AI(){
	/* スコアテーブル */
	var scoreTable = [];
	
	for(var x = 0; x <= BOARD_SIZE+1; x++){
		scoreTable[x] = [];
	}
	
	for(var y = 0; y <= BOARD_SIZE+1; y++){
		for(var x = 0; x <= BOARD_SIZE+1; x++){
			if(y == 0 || x == 0){
				scoreTable[x][y] = "■";
			}else if(y == BOARD_SIZE+1 || x == BOARD_SIZE+1){
				scoreTable[x][y] = "■";
			}
		}
	}
	
	for(var i = 1; i <= BOARD_SIZE-Math.floor(BOARD_SIZE/2); i++){
		for(var y = i; y <= BOARD_SIZE+1-i; y++){
			for(var x = i; x <= BOARD_SIZE+1-i; x++){
				if(x==i || y==i || x==BOARD_SIZE+1-i || y==BOARD_SIZE+1-i){
					scoreTable[x][y] = i;
				}
			}
		}
	}
	
	for(var i = 0; i < BOARD_SIZE; i += BOARD_SIZE-2){
		for(var j = 0; j < BOARD_SIZE; j += BOARD_SIZE-2){
			for(var y = 1; y <= 2; y++){
				for(var x = 1; x <= 2; x++){
					scoreTable[x+i][y+j] = -5;
				}
			}
		}
	}
	
	for(var y = 1; y <= BOARD_SIZE; y += BOARD_SIZE-1){
		for(var x = 1; x <= BOARD_SIZE; x += BOARD_SIZE-1){
			scoreTable[x][y] = 10;
		}
	}
	
	this.scoreTable = scoreTable;

	/* 置ける場所の記憶 */
	this.memory = [];

	/* 石を置ける場所を網羅検索 */
	this.search = function(tableStatus,player){
	
		this.memory = makeTreeAndReturnLeaf(tableStatus,player);
	
	}
	
	/* スコアを計算する */
	this.calculateScore = function(tableStatus,player){
		
//		console.log(tableStatus.join("\n"));
		
		var score = 0;
		for(var y = 1; y <= BOARD_SIZE; y++){
			for(var x = 1; x <= BOARD_SIZE; x++){
				if(tableStatus[x][y] == player){
					score += this.scoreTable[x][y];
				}
			}
		}
		return score;
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
	
	if(listPossiblePositions(table.status,currentPlayer).length != 0){
		passCount = 0;
	}

	if(passCount == 1){
		currentPlayer = changePhase(currentPlayer);
		showPhase();
		/* AIの手番 */
		setTimeout(aiAction,1000);
	}else if(checkPlacement(table.status,x,y) && countReverse(table.status,x,y,currentPlayer).length != 0){
		put(table.status,x,y,currentPlayer);
		reverse(table.status,x,y,currentPlayer);
		currentPlayer = changePhase(currentPlayer);
		showPhase(currentPlayer);
		drawTable();
		
		/* AIの手番 */
		showMessage("(AIターン)");
		setTimeout(aiAction,1000);
	}else{
		showMessage("石を置けません");
		setTimeout(erase,800);
	}
}

function aiAction(){
	showMessage("AIターン");
	
	var gameEndFlag = true;
	
	ai.search(table.status,currentPlayer);
	
	var maxScore = 0;
	var selectedPosition = {};
	var currentScore = 0;
	for(var i = 0; i < ai.memory.length; i++){
		currentScore = ai.calculateScore(ai.memory[i],currentPlayer);
		if(maxScore < currentScore){
			maxScore = currentScore;
			selectedPosition.x = ai.memory[i][BOARD_SIZE+2][0];
			selectedPosition.y = ai.memory[i][BOARD_SIZE+2][1];
		}
	}
	
	if(ai.memory.length != 0){
		put(table.status,selectedPosition.x,selectedPosition.y,currentPlayer);
		reverse(table.status,selectedPosition.x,selectedPosition.y,currentPlayer);
	}else{
		passCount += 1;
	}
	ai.forget();
	currentPlayer = changePhase(currentPlayer);
	showPhase(currentPlayer);
	drawTable();
	erase();
	
	if(passCount == 2){
		gameOver();
	}

	if(listPossiblePositions(table.status,currentPlayer).length != 0){
		gameEndFlag = false;
	}

	if(gameEndFlag){
		gameOver();
	}
}

/* ゲーム終了 */
function gameOver(){
	var countBlack = 0;
	var countWhite = 0;
	
	for(var y = 1; y <= BOARD_SIZE; y++){
		for(var x = 1; x <= BOARD_SIZE; x++){
			if(table.status[x][y]=="●"){
				countBlack += 1;
			}
			else if(table.status[x][y]=="○")
			{
				countWhite += 1;
			}
		}
	}
	showPhase("ゲームセット");
	showMessage("黒:"+countBlack+"<br>白:"+countWhite);
}
/* メッセージを表示 */
function showMessage(messege){
	document.getElementById("message").innerHTML 
			+= "<h1>"+messege+"</h1>";
}
/* 手番を表示 */
function showPhase(player){
	if(player == "●"){
		document.getElementById("headMessage").innerHTML = "<h1>黒の番です</h1>";
	}else if(player == "○"){
		document.getElementById("headMessage").innerHTML = "<h1>白の番です</h1>";
	}else{
		document.getElementById("headMessage").innerHTML = "<h1>"+player+"</h1>";
	}
}
/* メッセージを消す */
function erase(){
	document.getElementById("message").innerHTML 
		= "";
}

//////////////////////ツリーを生成//////////////////////
function makeTreeAndReturnLeaf(tableStatus,player){
	
	var depth = 4;
	var passCnt = 0;
	var leafList = [];
	
	var putStoneChoises = listPossiblePositions(tableStatus,player);
	
	for(var i = 0; i < putStoneChoises.length; i++){
		/* 最初に置いた石の位置を保存 */
		var root = cloneArray(tableStatus);
		root.push([putStoneChoises[i].x,putStoneChoises[i].y]);
		
		makeNode(
			cloneArray(root),
			putStoneChoises[i].x,
			putStoneChoises[i].y,
			player,
			depth,
			passCnt,
			leafList
		);
	}
	
	return leafList;
}

function makeBranch(node,player,depth,passCnt,leafList){
	
	if(passCnt < 2 && 0 < depth){
		var branch = listPossiblePositions(node,player);
		
		if( branch.length != 0){
			passCnt = 0;
			for(var i = 0; i < branch.length; i++){
				makeNode(cloneArray(node),branch[i].x,branch[i].y,player,depth,passCnt,leafList);
			}
			
		}else{
			/* パスが発生した場合 */
			var nextPhase = changePhase(player);
			depth -= 1;
			passCnt += 1;
			makeBranch(node,nextPhase,depth,passCnt,leafList);
		}
	
	}else{
		/* リーフを出力 */
		return leafList.push(node);
	}
}

function makeNode(parentNode,x,y,player,depth,passCnt,leafList){
	var newNode = put(parentNode,x,y,player);
	reverse(newNode,x,y,player);
	
	var nextPhase = changePhase(player);
	
	depth -= 1;
	
	makeBranch(newNode,nextPhase,depth,passCnt,leafList);
}

/* 石を置く */
function put(tableStatus,x,y,player){
	
	if(player == "●"){
		tableStatus[x][y] = "●";
	}else if(player == "○"){
		tableStatus[x][y] = "○";
	}
	return tableStatus;
}

/* 石を裏返す */
function reverse(tableStatus,x,y,player){

	if(player == "●"){
		theFront = "●";
		theBack = "○";
	}else if(player == "○"){
		theFront = "○";
		theBack = "●";
	}

	/* 石を反転 */
	var reverse = countReverse(tableStatus,x,y,player);
	
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
function countReverse(tableStatus,x,y,player){
	
	var result = [];
	
	if(player == "●"){
		var theBack  = "○";
		var theFront = "●";
	}else if(player == "○"){
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

function changePhase(player){
	if(player == "●"){
		var nextPhase = "○";
	}else if(player == "○"){
		var nextPhase = "●";
	}
	return nextPhase;
}

//////////////////////よく使う処理//////////////////////
/* 盤面の状態を見て置けるところを返す */
function listPossiblePositions(tableStatus,player){
	var positions = [];
	
	for(var y = 1; y <= BOARD_SIZE; y++){
		for(var x = 1; x <= BOARD_SIZE; x++){
			if( checkPlacement(tableStatus,x,y) ){
				if( countReverse(tableStatus,x,y,player).length != 0 ){
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