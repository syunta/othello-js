//////////////////////変数を定義//////////////////////
var othelloTable = new othelloTable();
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
//////////////////////////////////////////////////////
function makeRoot(){
	
	var phase = "●";
	var root = othelloTable.status;
	var depth = 4;
	
	makeBranch(root,phase,depth);
}

function makeBranch(node,phase,depth){
	
	var branch = listPossiblePositions(node,phase);
	
	if( branch.length != 0 && 0 < depth){
		
		for(var i = 0; i < branch.length; i++){
			makeNode(cloneArray(node),branch[i].x,branch[i].y,phase,depth);
		}
		
	}else{
		/* なにもしない */
		console.log(node.join("\n"));
	}
}

function makeNode(parentNode,x,y,phase,depth){
	var newNode = put(parentNode,x,y,phase);
	reverse(newNode,x,y,phase);
	
	var nextPhase = changePhase(phase);
	
	depth -= 1;
	
	makeBranch(newNode,nextPhase,depth);
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
//////////////////////オブジェクトを定義//////////////////////
/* オセロ盤 */

function othelloTable(){
	this.status = [
		["■","■","■","■","■","■"],
		["■"," "," "," "," ","■"],
		["■"," ","○","●"," ","■"],
		["■"," ","●","○"," ","■"],
		["■"," "," "," "," ","■"],
		["■","■","■","■","■","■"]
	];
}

//////////////////////関数ライブラリ//////////////////////
/* 盤面の状態を見て置けるところを返す */
function listPossiblePositions(tableStatus,phase){
	var positions = [];
	
	for(var y = 1; y <= 4; y++){
		for(var x = 1; x <= 4; x++){
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