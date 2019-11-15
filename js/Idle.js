window.onload = function(){
	initBuildings();
	initItems();
	initData();
	gameSave();
	offlineOnLoad();
	firstLaunch();
	}

function initData(){
	updateUpgrades();
	updateData();
	updateTick();
}

//--Variables--//
var date = new Date();
	partsPerSec = 0;
	buildings = [];
	bCostMul=1;
	prodMulti=1;
	items=[];
	offlineProgress=0;
	PPS=0;
	canParts=0;//all of the Cans  
	canMoney=0;//are required to
	canMoney2=0;//prevent the bars
	canC1=0;//from being spammed
	
	game={
	parts:0,
	bQty:[],
	upgrades:[],
	money:0,
	items:[],
	time:date.getTime(),
	oneOff:[0],};
	
////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////

//--First Launch--//
function firstLaunch(){
	if(game.oneOff[0]==0){//Only displays this message on new game
		unlockItem("firstLaunchContainer");
		let x = 0;
		let T=window.setInterval(function(){
			x++;
			document.getElementById("firstLaunchContainer").style.opacity=x+"%";//fade in
			if(x>=100){
				clearInterval(T);
			}
		},5);
	}
}

function closeFLWindow(){
	disableItem("FLButton")
	let x=100;
	let T=window.setInterval(function(){
		x--;
		document.getElementById("firstLaunchContainer").style.opacity=x+"%";//fade out
		if(x<=0){
			clearInterval(T);
			lockItem("firstLaunchContainer");
			game.oneOff[0]=1;
		}
	},5);
}

//--Loading Saves--//
var Game2 = JSON.parse(localStorage.getItem('idleParts.gameSave'));
if(	localStorage.getItem('idleParts.gameSave') !== null){//if there is a save
	// if(Game2.Version>=game.Version){
		offlineProgress=(game.time-=Game2.time);//difference in time from last save to page load in ms
		Object.assign(game,Game2);//copies loaded save overtop blank save ensuring all old saves get new save conent/features
	// }
}

//--offline progression--//
function offlineOnLoad(){
	if(game.oneOff[0]==1){//Wont fire offline progress unless the user has played before
		unlockItem("offlineProgressContainer");
		for(var A=0;A<buildings.length;A++){
			PPS=PPS+=(game.bQty[A]*buildings[A].perSec);
		};
		PPS=round(PPS*(offlineProgress/1000),1);//converts offlineProgress into seconds, rounds to nearest whole second, multiplies by parts per second
		let x = 0;
		let T=window.setInterval(function(){
		x++;
		document.getElementById("offlineProgressContainer").style.opacity=x+"%";//fade in
		if(x>=100){
				clearInterval(T);
				OfflineOnLoad2();//waits to calculate until faded in
			}
		},5);
	}
}
function closeOfflineWindow(){
	disableItem("offlineButton")
	let x=100;
	let T=window.setInterval(function(){
		x--;
		document.getElementById("offlineProgressContainer").style.opacity=x+"%";//fade out
		if(x<=0){
			clearInterval(T);
			lockItem("offlineProgressContainer");
		}
	},5);
	game.parts+=PPS;
	game.parts=rounddown(game.parts,1);//rounds down to avoid floating
	gameSave();
	updateData();//updates ui after offline gains
}

function OfflineOnLoad2(){
	let x=0;
	let T=window.setInterval(function(){
		if(x<PPS-1000000){
			x+=100000;
			document.getElementById("offlinePartsNumb").innerHTML=x;
		};
		if(x<PPS-100000){
			x+=10000;
			document.getElementById("offlinePartsNumb").innerHTML=x;
		};
		if(x<PPS-10000){
			x+=1000;
			document.getElementById("offlinePartsNumb").innerHTML=x;
		};
		if(x<PPS-1000){
			x+=100;
			document.getElementById("offlinePartsNumb").innerHTML=x;
		};
		if(x<PPS-100){
			x+=10;
			document.getElementById("offlinePartsNumb").innerHTML=x;
		};
		if(x<PPS-2){
			x++;
			document.getElementById("offlinePartsNumb").innerHTML=x;
		};
		if(x<PPS-0.1){
			x+=0.1;
			document.getElementById("offlinePartsNumb").innerHTML=x.toFixed(1);
		};
		if(x==PPS.toFixed(1)){
			x=rounddown(PPS,1);
			document.getElementById("offlinePartsNumb").innerHTML=x;
			clearInterval(T);
		};
	},1);
}

//--Dynamically create objects--//
function initItems(){//name,value
	LoadItem("C1",100);
}
function LoadItem(name,value){
	let id = items.length;
	items[id]=new Item();
	items[id].name=name;
	items[id].value=value;
	if(localStorage.getItem('idleParts.gameSave') == null){
	game.items[id] = 0;
	}
}

function initBuildings(){//name,cost,persec
	loadBuilding("Cheap Employee",10,0.2);
	loadBuilding("Good Employee",100,0.5);
	loadBuilding("Robot",1000,1);
}
function loadBuilding(name,cost,persec){
	let id = buildings.length;
	buildings[id] = new building();
	buildings[id].name = name;
	buildings[id].perSec = persec;
	buildings[id].BPerSec=persec;
	buildings[id].cost=cost;
	buildings[id].bCost=cost;
	if(localStorage.getItem('idleParts.gameSave') == null){
	game.bQty[id] = 0;
	}
}

//--Updates visuals for numbers at call--//
function updateData(){
	document.getElementById("parts").innerHTML = game.parts;
	document.getElementById("building1Qty").innerHTML = buildings[0].name +": "+ game.bQty[0];
	document.getElementById("building1Cost").innerHTML = "cost: " + buildings[0].cost;
	document.getElementById("building1PerSec").innerHTML = "Parts/sec " + buildings[0].perSec;
	document.getElementById("building2Qty").innerHTML = buildings[1].name +": "+ game.bQty[1];
	document.getElementById("building2Cost").innerHTML = "cost: " + buildings[1].cost;
	document.getElementById("building2PerSec").innerHTML = "Parts/sec " + buildings[1].perSec;
	document.getElementById("building3Qty").innerHTML = buildings[2].name +": "+ game.bQty[2];
	document.getElementById("building3Cost").innerHTML = "cost: " + buildings[2].cost;
	document.getElementById("building3PerSec").innerHTML = "Parts/sec " + buildings[2].perSec;
	document.getElementById("money").innerHTML = game.money;
	document.getElementById("c1Qty").innerHTML=game.items[0];
}
function updateParts(){
	document.getElementById("parts").innerHTML = game.parts;
	document.getElementById("money").innerHTML = game.money;
}

function updateUpgrades(){
	if(game.upgrades[0]==1){
		disableItem("costCheap");
		bCostMul=0.1;
		for(id=0;id<buildings.length;id++){//Calculate cost of buildings
			buildings[id].cost=round((buildings[id].bCost*bCostMul*(1.3**game.bQty[id])),0);
		}
	}else{
		enableItem("costCheap");
		bCostMul=1;
		for(id=0;id<buildings.length;id++){//Calculate cost of buildings
			buildings[id].cost=round((buildings[id].bCost*bCostMul*(1.3**game.bQty[id])),0);
		}
	}	
	if(game.upgrades[1]==1){
		disableItem("productionMulti");
		prodMulti=100;
		for(id=0;id<buildings.length;id++){//Calculate production of parts
			buildings[id].perSec=buildings[id].BPerSec*prodMulti;
		}
	}else{
		enableItem("productionMulti");
		prodMulti=1;
		for(id=0;id<buildings.length;id++){//Calculate production of parts
			buildings[id].perSec=buildings[id].BPerSec*prodMulti;
		}
	}
	if(game.upgrades[2]==1){
		if(game.items[0]>=1){
				sellC1()
			};
		window.setInterval(function(){
			if(game.items[0]>=1){
				sellC1()
			};
		},1000);
		disableItem("autoSell");
	}else{
		enableItem("autoSell");
		bCostMul=1;
	}
	if(game.upgrades[3]==1){
		game.upgrades=[];
		updateUpgrades();
	}
}

//--Parents--//
function building() {
	this.name = "name";
	this.cost = 0;
	this.perSec = 0;
}
function Item(){
	this.name="name";
	this.value=0;
}


//--Rounding--//
function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
function rounddown(value, decimals) {
	return Number(Math.floor(value+'e'+decimals)+'e-'+decimals);
}

//--upgrades--//
function buyUpgrade(id){
	game.upgrades[id]=1;
	initData();
}


//--build and Validity Check--//
function build(id){
	if (game.money >= buildings[id].cost){
		game.money -= buildings[id].cost;
		game.bQty[id] = game.bQty[id]+1;
		buildings[id].cost=round((buildings[id].bCost*bCostMul*(1.3**game.bQty[id])),0);
		updateData();
	}
}


//--Reset--//
function reset(){
		localStorage.clear();
		location.reload();
}
function resetConfirm(){
	unlockItem("resetContainer")
}
function resetNo(){
	lockItem("resetContainer")
}
	

//--lock and unlock classes--//
function lockItem(item){
document.getElementById(item).className = document.getElementById(item).className + "locked";
}
function unlockItem(item){
document.getElementById(item).className = document.getElementById(item).className.replace("locked","");
}

//--disable and enable classes--//
function disableItem(item){
document.getElementById(item).disabled=true;
}
function enableItem(item){
document.getElementById(item).disabled=false;
}


//--Save--//
var SaveTimer = window.setInterval(function(){gameSave()}, 1000);
function gameSave(){
	var date = new Date();
	game.time=date.getTime()
	window.localStorage['idleParts.gameSave'] = JSON.stringify(game);
}
function manualSave(){
	gameSave();
}


//Global tick timer
var Timerparts = window.setInterval(function(){partsTick()}, 1000);
var TimerUpdate = window.setInterval(function(){updateTick()}, 1000);
var Timermoney = window.setInterval(function(){moneyTick()},1000);


function partsTick(){
	for (var MT = 0;MT < buildings.length;MT++) {
		game.parts += game.bQty[MT]*buildings[MT].perSec;
		game.parts=round(game.parts,1);//prevents "drift" of parts due to floating point. Alternative is game.parts.toFixed(1) on following line
		document.getElementById("parts").innerHTML = game.parts;
	}
}


function updateTick(){
	for(var UT = 0;UT < buildings.length;UT++){
		partsPerSec = round(partsPerSec+(game.bQty[UT]*buildings[UT].perSec),1);//multiplies all buildings by their quatites and then adds them all together
	}
	document.getElementById("partsPerSec").innerHTML = partsPerSec;
	partsPerSec = 0;//reset to zero is required or it will loop on itself
}
function moneyTick(){
	document.getElementById("money").innerHTML = game.money;
}

//--Gather parts on click--//
function gatherParts(){
	if(canParts==0){
		canParts=1;
		let partsProgress=0;
		let progresstimer = window.setInterval(function(){
			partsProgress++
			document.getElementById("partsBar").style.width=partsProgress+"%";
			document.getElementById("partsProgressSpan").innerHTML=partsProgress+"%";
			if(partsProgress>=100){
				game.parts++;
				clearInterval(progresstimer);
				document.getElementById("partsBar").style.width=partsProgress+"%";
				document.getElementById("parts").innerHTML = game.parts;
				canParts=0;
			};
		}, 20);
	};
};

//--Selling parts--//
function sellParts(){
	if(canMoney==0){
		canMoney=1;
		let sellprogress=0;
		let progresstimer = window.setInterval(function(){
			sellprogress++;
			document.getElementById("money1Bar").style.width=sellprogress+"%";
			document.getElementById("money1ProgressSpan").innerHTML=sellprogress+"%";
			if(sellprogress>=100){
				game.money+=rounddown(game.parts,0);
				game.parts=0;
				clearInterval(progresstimer);
				document.getElementById("money1Bar").style.width=sellprogress+"%";
				document.getElementById("money").innerHTML = game.money;
				document.getElementById("parts").innerHTML = game.parts;
				canMoney=0;
			};
		},50);
	}
};
function sellC1(){
	if(canMoney==0){
		canMoney2=1;
		let sellprogress=0;
		let progresstimer = window.setInterval(function(){
			sellprogress++;
			document.getElementById("money2Bar").style.width=sellprogress+"%";
			document.getElementById("money2ProgressSpan").innerHTML=sellprogress+"%";
			if(sellprogress>=100){
				game.money+=rounddown(game.items[0]*items[0].value,0);
				game.items[0]=0;
				clearInterval(progresstimer);
				document.getElementById("money2Bar").style.width=sellprogress+"%";
				document.getElementById("money").innerHTML = game.money;
				document.getElementById("c1Qty").innerHTML=game.items[0];
				canMoney=0;
			};
		},50);
	}
};





//--Crafting C1--//
function craftC1(){
	if(canC1==0 && game.parts>=50){
		canC1=1;
		game.parts-=50;
		document.getElementById("parts").innerHTML = game.parts;
		let C1progress=0;
		let progresstimer = window.setInterval(function(){
			C1progress++;
			document.getElementById("c1Bar").style.width=C1progress+"%";
			document.getElementById("c1ProgressSpan").innerHTML=C1progress+"%";
			if(C1progress>=100){
				game.items[0]+=1
				clearInterval(progresstimer);
				document.getElementById("c1Bar").style.width=C1progress+"%";
				canC1=0;
				document.getElementById("c1Qty").innerHTML=game.items[0];
			};
		},100);
	}
};