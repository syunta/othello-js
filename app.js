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
	var pos = Math.floor(tableArea/2);
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
	
	for(var x = 0; x <= tableArea+1; x++){
		scoreTable[x] = [];
	}
	
	for(var y = 0; y <= tableArea+1; y++){
		for(var x = 0; x <= tableArea+1; x++){
			if(y == 0 || x == 0){
				scoreTable[x][y] = "■";
			}else if(y == tableArea+1 || x == tableArea+1){
				scoreTable[x][y] = "■";
			}
		}
	}
	
	for(var i = 1; i <= tableArea-Math.floor(tableArea/2); i++){
		for(var y = i; y <= tableArea+1-i; y++){
			for(var x = i; x <= tableArea+1-i; x++){
				if(x==i || y==i || x==tableArea+1-i || y==tableArea+1-i){
					scoreTable[x][y] = i;
				}
			}
		}
	}
	
	for(var i = 0; i < tableArea; i += tableArea-2){
		for(var j = 0; j < tableArea; j += tableArea-2){
			for(var y = 1; y <= 2; y++){
				for(var x = 1; x <= 2; x++){
					scoreTable[x+i][y+j] = 0;
				}
			}
		}
	}
	
	for(var y = 1; y <= tableArea; y += tableArea-1){
		for(var x = 1; x <= tableArea; x += tableArea-1){
			scoreTable[x][y] = 9;
		}
	}
	
	this.scoreTable = scoreTable;

	/* 置ける場所の記憶 */
	this.memory = [];

	/* 石を置ける場所を網羅検索 */
	this.search = function(tableStatus,phase){

		this.memory = listPossiblePositions(tableStatus,phase);

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
		
		console.log(selection);
		return selection;
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
		setTimeout(aiAction,1000);
	}else if(checkPlacement(table.status,x,y) && countReverse(table.status,x,y,gamePhase).length != 0){
		put(table.status,x,y,gamePhase);
		reverse(table.status,x,y,gamePhase);
		gamePhase = changePhase(gamePhase);
		showPhase(gamePhase);
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
	var selectedPosition = {};

	ai.search(table.status,gamePhase);
	selectedPosition = ai.select();
	if(ai.memory.length != 0){
		put(table.status,selectedPosition.x,selectedPosition.y,gamePhase);
		reverse(table.status,selectedPosition.x,selectedPosition.y,gamePhase);
	}else{
		passCount += 1;
	}
	ai.forget();
	gamePhase = changePhase(gamePhase);
	showPhase(gamePhase);
	drawTable();
	erase();
	
	if(passCount == 2){
		gameOver();
	}

	if(listPossiblePositions(table.status,gamePhase).length != 0){
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
	
	for(var y = 1; y <= tableArea; y++){
		for(var x = 1; x <= tableArea; x++){
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
function showPhase(phase){
	if(phase == "●"){
		document.getElementById("phase").innerHTML = "<h1>黒の番です</h1>";
	}else if(phase == "○"){
		document.getElementById("phase").innerHTML = "<h1>白の番です</h1>";
	}else{
		document.getElementById("phase").innerHTML = "<h1>"+phase+"</h1>";
	}
}
/* メッセージを消す */
function erase(){
	document.getElementById("message").innerHTML 
		= "";
}

//////////////////////ツリーを生成//////////////////////
function makeRoot(tableStatus){
	
	var phase = "●";
	var depth = 4;
	var passCnt = 0;
	
	var putStoneChoises = listPossiblePositions(tableStatus,phase);
	
	for(var i = 0; i < putStoneChoises.length; i++){
		/* 最初に置いた石の位置を保存 */
		var root = cloneArray(tableStatus);
		root.push([putStoneChoises[i].x,putStoneChoises[i].y]);
		
		makeNode(
			cloneArray(root),
			putStoneChoises[i].x,
			putStoneChoises[i].y,
			phase,
			depth,
			passCnt
		);
	}
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
			makeBranch(node,nextPhase,depth,passCnt);
		}
	
	}else{
		/* リーフを出力 */
		return calculateScore(node);
	}
}

function makeNode(parentNode,x,y,phase,depth,passCnt){
	var newNode = put(parentNode,x,y,phase);
	reverse(newNode,x,y,phase);
	
	var nextPhase = changePhase(phase);
	
	depth -= 1;
	
	makeBranch(newNode,nextPhase,depth,passCnt);
}

function calculateScore(tableStatus){
	
	var score = 0;
	for(var y = 1; y <= tableArea; y++){
		for(var x = 1; x <= tableArea; x++){
			if(tableStatus[x][y] == "○"){
				score += ai.scoreTable[x][y];
			}
		}
	}
	
	console.log(tableStatus.join("\n"));
	console.log(score);
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