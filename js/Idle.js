window.onload = function(){
	InitBuildings();
	InitData();
	GameSave();
}
//--Variables--//
var partspersec = 0;
var buildings = [];
var BCost=[];
var BCostBase=[];
var BCostMul=1
var partsprogress=0
var canparts=0
////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////


//--Loading Saves--//
if(localStorage.getItem('Idle.Game') == null){
	var Game = new GameData();
} else {
	var Game = JSON.parse(localStorage.getItem('Idle.Game'));
}


//--Dynamically creates buildings--//
function InitBuildings(){//name,cost,persec
	LoadBuilding("Employee",10,0.2);
	LoadBuilding("Robot",100,5);
}
function LoadBuilding(name,cost,persec){
	var id = buildings.length;
	buildings[id] = new Building();
	buildings[id].Name = name;
	buildings[id].PerSec = persec;
	if(localStorage.getItem('Idle.Game') == null){
	Game.BQty[id] = 0;
	}
	BCost[id]=cost;
	BCostBase[id]=cost;
}


//--Updates visuals for numbers at launch--//
function InitData(){
	
	if(Game.Upgrades[0]==1){document.getElementById("MultiGain").disabled=true;}else{document.getElementById("MultiGain").disabled=false};
	if(Game.Upgrades[0]==1){BCostMul=1.5}else{BCostMul=1};
	
	for(id=0;id<buildings.length;id++){//Calculate cost of buildings
	BCost[id]=round((BCost[id]*((1.3**Game.BQty[id]))*BCostMul),0);
	}
	document.getElementById("parts").innerHTML = Game.parts;
	document.getElementById("Building1Qty").innerHTML = buildings[0].Name +": "+ Game.BQty[0];
	document.getElementById("Building1Cost").innerHTML = "Cost: " + BCost[0];
	document.getElementById("Building1PerSec").innerHTML = "Parts/sec " + buildings[0].PerSec;
	document.getElementById("Building2Qty").innerHTML = buildings[1].Name +": "+ Game.BQty[1];
	document.getElementById("Building2Cost").innerHTML = "Cost: " + BCost[1];
	document.getElementById("Building2PerSec").innerHTML = "Parts/sec " + buildings[1].PerSec;
	document.getElementById("money").innerHTML = Game.money;
	UpdateTick();
}


//--Updates visuals for numbers at call--//
function UpdateData(){
	document.getElementById("parts").innerHTML = Game.parts;
	document.getElementById("Building1Qty").innerHTML = buildings[0].Name +": "+ Game.BQty[0];
	document.getElementById("Building1Cost").innerHTML = "Cost: " + BCost[0];
	document.getElementById("Building1PerSec").innerHTML = "Parts/sec " + buildings[0].PerSec;
	document.getElementById("Building2Qty").innerHTML = buildings[1].Name +": "+ Game.BQty[1];
	document.getElementById("Building2Cost").innerHTML = "Cost: " + BCost[1];
	document.getElementById("Building2PerSec").innerHTML = "Parts/sec " + buildings[1].PerSec;
	document.getElementById("money").innerHTML = Game.money;
}
function UpdateParts(){
	document.getElementById("parts").innerHTML = Game.parts;
	document.getElementById("money").innerHTML = Game.money;
}



//--Parents--//
function GameData(){
	this.name="Idle Game"
	this.description="This is an Idle Game"
	this.parts = 0;
	this.BQty=[]
	this.Upgrades=[];
	this.money=0;
}
function Building() {
	this.Name = "Name";
	this.Cost = 0;
	this.PerSec = 0;
}


//--Rounding--//
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
function rounddown(value, decimals) {
  return Number(Math.floor(value+'e'+decimals)+'e-'+decimals);
}


//--Upgrades--//
function BuyUpgrade(id){
	Game.Upgrades[id]=1;
	InitData();
}

//--Selling parts--//
function sellparts(){
	Game.money+=rounddown(Game.parts,0);
	Game.parts=0;
	UpdateData();
}


//--Build and Validity Check--//
function Build(id){
	if (Game.money >= BCost[id]){
		Game.money -= BCost[id];
		Game.BQty[id] = Game.BQty[id]+1;
		BCost[id]=round((BCostBase[id]*((1.3**Game.BQty[id]))*BCostMul),0);
		UpdateData();
	}
}


//--Reset--//
function reset(){
	if(window.confirm("This will wipe all of your savedata! Are you sure?")){
		Game = new GameData();
		ClearBuildings();
		ClearProgressbars();
		InitData();
		GameSave();
		console.log('Wiped save')
		
	}
}
function ClearBuildings(){
	for(id=0;id<buildings.length;id++){
		Game.BQty[id] = 0;
	}
	buildings = []
	InitBuildings();
}
function ClearProgressbars(){
		partsprogress=0;
		document.getElementById("partsBar").style.width=partsprogress+"%";
		document.getElementById("partsprogressspan").innerHTML=partsprogress+"%";
}



//--disable and enable classes--//
function disableitem(item){
document.getElementById(item).className = document.getElementById(item).className + " locked";
}
function enableitem(item){
document.getElementById(item).className = document.getElementById(item).className.replace(" locked","");
}


//--Save--//
var SaveTimer = window.setInterval(function(){GameSave()}, 1000);
function GameSave(){
	window.localStorage['Idle.Game'] = JSON.stringify(Game);
}
function ManualSave(){
	GameSave();
}


//Global tick timer
var Timerparts = window.setInterval(function(){partsTick()}, 1000);
var TimerUpdate = window.setInterval(function(){UpdateTick()}, 1000);
var Timermoney = window.setInterval(function(){moneyTick()},1000);
function partsTick(){
	for (var MT = 0;MT < buildings.length;MT++) {
		Game.parts += Game.BQty[MT]* buildings[MT].PerSec;
		Game.parts=round(Game.parts,1);//prevents "drift" of parts due to floating point. Alternative is Game.parts.toFixed(1) on following line
		document.getElementById("parts").innerHTML = Game.parts;
	}
}
function UpdateTick(){
	for(var UT = 0;UT < buildings.length;UT++){
		partspersec = partspersec+(Game.BQty[UT]*buildings[UT].PerSec);//multiplies all buildings by their quatites and then adds them all together
	}
	document.getElementById("partspersec").innerHTML = partspersec;
	partspersec = 0;//reset to zero is required or it will loop on itself
}
function moneyTick(){
	document.getElementById("money").innerHTML = Game.money;
}


//--Gather parts on click--//
function Gatherparts(){
	if(canparts==0){
//		document.getElementById("moneybutton").disabled=true;
		canparts=1;
		partsprogress=0;
		var progresstimer = window.setInterval(function(){
			partsprogress++
			document.getElementById("partsBar").style.width=partsprogress+"%";
			document.getElementById("partsprogressspan").innerHTML=partsprogress+"%";
			if(partsprogress>=100){
				Game.parts++;
				clearInterval(progresstimer);
				document.getElementById("partsBar").style.width=partsprogress+"%";
				document.getElementById("parts").innerHTML = Game.parts;
				canparts=0;
//				document.getElementById("moneybutton").disabled=false;
			};
		}, 20);
	};
};
