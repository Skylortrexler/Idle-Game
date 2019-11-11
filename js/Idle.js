window.onload = function(){
	InitBuildings();
	InitItems();
	InitData();
	GameSave();
}

function InitData(){
	UpdateUpgrades();
	UpdateData();
	UpdateTick();
}

//--Variables--//
var Game ={
	parts: 0,
	BQty:[],
	Upgrades:[],
	money:0,
	Items:[],
	Version:0.1,};
	
	partspersec = 0;
	buildings = [];
	BCostMul=1;
	partsprogress=0;
	canparts=0;
	sellprogress=0;
	canmoney=0;
	ProdMulti=1;
	canC1=0;
	C1progress=0;
	Items=[];
	canmoney2=0;

////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////


//--Loading Saves--//
var Game2 = JSON.parse(localStorage.getItem('IdleParts.GameSave'));
if(	localStorage.getItem('IdleParts.GameSave') !== null){
	if(Game2.Version>=Game.Version){
		Game=Game2;
	}
}
// if(localStorage.getItem('IdleParts.GameSave') == null){
	// var Game = new GameData();
// } else {
	// var Game = JSON.parse(localStorage.getItem('IdleParts.GameSave'));
// }


//--Dynamically create objects--//
function InitItems(){
	LoadItem("C1",100);
}
function LoadItem(name,value){
	var id = Items.length;
	Items[id]=new Item();
	Items[id].Name=name;
	Items[id].Value=value;
	if(localStorage.getItem('IdleParts.GameSave') == null){
	Game.Items[id] = 0;
	}
}

function InitBuildings(){//name,cost,persec
	LoadBuilding("Cheap Employee",10,0.2);
	LoadBuilding("Good Employee",100,0.5);
	LoadBuilding("Robot",1000,1);
}
function LoadBuilding(name,cost,persec){
	var id = buildings.length;
	buildings[id] = new Building();
	buildings[id].Name = name;
	buildings[id].PerSec = persec;
	buildings[id].BPerSec=persec;
	buildings[id].Cost=cost;
	buildings[id].BCost=cost;
	if(localStorage.getItem('IdleParts.GameSave') == null){
	Game.BQty[id] = 0;
	}
}

//--Updates visuals for numbers at call--//
function UpdateData(){
	document.getElementById("parts").innerHTML = Game.parts;
	document.getElementById("Building1Qty").innerHTML = buildings[0].Name +": "+ Game.BQty[0];
	document.getElementById("Building1Cost").innerHTML = "Cost: " + buildings[0].Cost;
	document.getElementById("Building1PerSec").innerHTML = "Parts/sec " + buildings[0].PerSec;
	document.getElementById("Building2Qty").innerHTML = buildings[1].Name +": "+ Game.BQty[1];
	document.getElementById("Building2Cost").innerHTML = "Cost: " + buildings[1].Cost;
	document.getElementById("Building2PerSec").innerHTML = "Parts/sec " + buildings[1].PerSec;
	document.getElementById("Building3Qty").innerHTML = buildings[2].Name +": "+ Game.BQty[2];
	document.getElementById("Building3Cost").innerHTML = "Cost: " + buildings[2].Cost;
	document.getElementById("Building3PerSec").innerHTML = "Parts/sec " + buildings[2].PerSec;
	document.getElementById("money").innerHTML = Game.money;
	document.getElementById("C1Qty").innerHTML=Game.Items[0];
}
function UpdateParts(){
	document.getElementById("parts").innerHTML = Game.parts;
	document.getElementById("money").innerHTML = Game.money;
}

function UpdateUpgrades(){
	if(Game.Upgrades[0]==1){
		document.getElementById("CostCheap").disabled=true;
		BCostMul=0.1;
	}else{
		document.getElementById("CostCheap").disabled=false;
		BCostMul=1;
	}
	for(id=0;id<buildings.length;id++){//Calculate cost of buildings
		buildings[id].Cost=round((buildings[id].BCost*BCostMul*(1.3**Game.BQty[id])),0);
	}
	
	if(Game.Upgrades[1]==1){
		document.getElementById("ProductionMulti").disabled=true;
		ProdMulti=100;
	}else{
		document.getElementById("ProductionMulti").disabled=false;
		ProdMulti=1;
	}
	for(id=0;id<buildings.length;id++){//Calculate production of parts
		buildings[id].PerSec=buildings[id].BPerSec*ProdMulti;
	}
	if(Game.Upgrades[2]==1){
		if(Game.Items[0]>=1){
				sellC1()
			};
		window.setInterval(function(){
			if(Game.Items[0]>=1){
				sellC1()
			};
		},1000);
		document.getElementById("AutoSell").disabled=true;
	}else{
		document.getElementById("AutoSell").disabled=false;
		BCostMul=1;
	}
}

//--Parents--//
function Building() {
	this.Name = "Name";
	this.Cost = 0;
	this.PerSec = 0;
}
function Item(){
	this.Name="Name";
	this.Value=0;
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


//--Build and Validity Check--//
function Build(id){
	if (Game.money >= buildings[id].Cost){
		Game.money -= buildings[id].Cost;
		Game.BQty[id] = Game.BQty[id]+1;
		buildings[id].Cost=round((buildings[id].BCost*BCostMul*(1.3**Game.BQty[id])),0);
		UpdateData();
	}
}


//--Reset--//
function reset(){
	if(window.confirm("This will wipe all of your savedata! Are you sure?")){
		localStorage.clear();
		location.reload();
	}
}


//--disable and enable classes--//
function disableitem(item){
document.getElementById(item).className = document.getElementById(item).className + " locked";
}
function enableitem(item){
document.getElementById(item).className = document.getElementById(item).className.replace(" locked","");
}


//--Save--//
//var SaveTimer = window.setInterval(function(){GameSave()}, 1000);
function GameSave(){
	window.localStorage['IdleParts.GameSave'] = JSON.stringify(Game);
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
		Game.parts += Game.BQty[MT]*buildings[MT].PerSec;
		Game.parts=round(Game.parts,1);//prevents "drift" of parts due to floating point. Alternative is Game.parts.toFixed(1) on following line
		document.getElementById("parts").innerHTML = Game.parts;
	}
}


function UpdateTick(){
	for(var UT = 0;UT < buildings.length;UT++){
		partspersec = round(partspersec+(Game.BQty[UT]*buildings[UT].PerSec),1);//multiplies all buildings by their quatites and then adds them all together
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
			};
		}, 20);
	};
};

//--Selling parts--//
function sellparts(){
	if(canmoney==0){
		canmoney=1;
		sellprogress=0;
		var progresstimer2 = window.setInterval(function(){
			sellprogress++;
			document.getElementById("money1Bar").style.width=sellprogress+"%";
			document.getElementById("money1progressspan").innerHTML=sellprogress+"%";
			if(sellprogress>=100){
				Game.money+=rounddown(Game.parts,0);
				Game.parts=0;
				clearInterval(progresstimer2);
				document.getElementById("money1Bar").style.width=sellprogress+"%";
				document.getElementById("money").innerHTML = Game.money;
				document.getElementById("parts").innerHTML = Game.parts;
				canmoney=0;
			};
		},50);
	}
};
function sellC1(){
	if(canmoney2==0){
		canmoney2=1;
		sell2progress=0;
		var progresstimer4 = window.setInterval(function(){
			sell2progress++;
			document.getElementById("money2Bar").style.width=sell2progress+"%";
			document.getElementById("money2progressspan").innerHTML=sell2progress+"%";
			if(sell2progress>=100){
				Game.money+=rounddown(Game.Items[0]*Items[0].Value,0);
				Game.Items[0]=0;
				clearInterval(progresstimer4);
				document.getElementById("money2Bar").style.width=sell2progress+"%";
				document.getElementById("money").innerHTML = Game.money;
				document.getElementById("C1Qty").innerHTML=Game.Items[0];
				canmoney2=0;
			};
		},50);
	}
};





//--Crafting C1--//
function CraftC1(){
	if(canC1==0 && Game.parts>=50){
		canC1=1;
		Game.parts-=50;
		document.getElementById("parts").innerHTML = Game.parts;
		C1progress=0;
		var progresstimer3 = window.setInterval(function(){
			C1progress++;
			document.getElementById("C1Bar").style.width=C1progress+"%";
			document.getElementById("C1Progressspan").innerHTML=C1progress+"%";
			if(C1progress>=100){
				Game.Items[0]+=1
				clearInterval(progresstimer3);
				document.getElementById("C1Bar").style.width=C1progress+"%";
				canC1=0;
				document.getElementById("C1Qty").innerHTML=Game.Items[0];
			};
		},100);
	}
};



