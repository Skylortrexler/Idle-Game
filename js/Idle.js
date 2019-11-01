window.onload = function(){
	InitBuildings();
	InitData();
	GameSave();
}
//--Variables--//
var moneypersec = 0;
var buildings = [];
var BCost=[];
var BCostMul=1
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
	LoadBuilding("Sieve",10,1);
	LoadBuilding("Mine",100,5);
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
}
//--Updates visuals for numbers at launch--//
function InitData(){
	
	if(Game.Upgrades[0]==1){document.getElementById("MultiGain").disabled=true;}else{document.getElementById("MultiGain").disabled=false};
	if(Game.Upgrades[0]==1){BCostMul=1.5}else{BCostMul=1};
	
	for(id=0;id<buildings.length;id++){//Calculate idrent cost of buildings
	BCost[id]=round(BCost[id]*((1.3**Game.BQty[id])*BCostMul),0);
	}
	document.getElementById("money").innerHTML = Game.money;
	document.getElementById("Building1Qty").innerHTML = "Sieve: " + Game.BQty[0];
	document.getElementById("Building1Cost").innerHTML = "Cost: " + BCost[0];
	document.getElementById("Building2Qty").innerHTML = "Mine: " + Game.BQty[1];
	document.getElementById("Building2Cost").innerHTML = "Cost: " + BCost[1];

}
//--Updates visuals for numbers at call--//
function UpdateData(){
	document.getElementById("money").innerHTML = Game.money;
	document.getElementById("Building1Qty").innerHTML = "Sieve: " + Game.BQty[0];
	document.getElementById("Building1Cost").innerHTML = "Cost: " + BCost[0];
	document.getElementById("Building2Qty").innerHTML = "Mine: " + Game.BQty[1];
	document.getElementById("Building2Cost").innerHTML = "Cost: " + BCost[1];
}
//--Parents--//
function GameData(){
	this.name="Idle Game"
	this.description="This is an Idle Game"
	this.money = 0;
	this.BQty=[]
	this.Upgrades=[];
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

//--Upgrades--//
function BuyUpgrade(id){
	Game.Upgrades[id]=1;
	InitData();
}

//--Build and Validity Check--//
function Build(id){
	if (Game.money >= BCost[id]){
		Game.money -= BCost[id];
		Game.BQty[id] = Game.BQty[id]+1;
		BCost[id]=round(BCost[id]*((1.3**Game.BQty[id])*BCostMul),0);
		InitData();
	}
}

//--Reset--//
function ClearBuildings(){
	for(id=0;id<buildings.length;id++){
		Game.BQty[id] = 0;
	}
	buildings = []
	InitBuildings();
}
function reset(){
	if(window.confirm("This will wipe all of your savedata! Are you sure?")){
		Game = new GameData();
		ClearBuildings();
		InitData();
		GameSave();
		console.log('Wiped save')
	}
}

//--Save--//
//var SaveTimer = window.setInterval(function(){GameSave()}, 1000);
function GameSave(){
	window.localStorage['Idle.Game'] = JSON.stringify(Game);
}
function ManualSave(){
	GameSave();
}
//Global tick timer
var TimerMoney = window.setInterval(function(){MoneyTick()}, 1000);
var TimerUpdate = window.setInterval(function(){UpdateTick()}, 250);
function MoneyTick(){
	for (var MT = 0;MT < buildings.length;MT++) {
		Game.money += Game.BQty[MT]* buildings[MT].PerSec;
		document.getElementById("money").innerHTML = Game.money;
	}
}
function UpdateTick(){
	for(var UT = 0;UT < buildings.length;UT++){
		moneypersec = moneypersec+(Game.BQty[UT]*buildings[UT].PerSec);
	}
	document.getElementById("moneypersec").innerHTML = moneypersec;
	moneypersec = 0;
}
//--Gather money on click--//
function GatherMoney(){
Game.money++;
document.getElementById("money").innerHTML = Game.money;
}