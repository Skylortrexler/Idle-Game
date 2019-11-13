window.onload = function(){
	InitBuildings();
	InitItems();
	InitData();
	GameSave();
	OfflineOnLoad();
	}

function InitData(){
	UpdateUpgrades();
	UpdateData();
	UpdateTick();
}

//--Variables--//
var date = new Date();
	partspersec = 0;
	buildings = [];
	BCostMul=1;
	ProdMulti=1;
	Items=[];
	offlineprogress=0;
	PPS=0;
	canparts=0;//all of the Cans  
	canmoney=0;//are required to
	canmoney=0;//prevent the bars
	canC1=0;//from being spammed
	
	Game={
	parts:0,
	BQty:[],
	Upgrades:[],
	money:0,
	Items:[],
	Time:date.getTime(),
	Oneoff:[],};
	
////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////

//--Loading Saves--//
var Game2 = JSON.parse(localStorage.getItem('IdleParts.GameSave'));
if(	localStorage.getItem('IdleParts.GameSave') !== null){//if there is a save
	// if(Game2.Version>=Game.Version){
		offlineprogress=(Game.Time-=Game2.Time);//difference in time from last save to page load in ms
		Object.assign(Game,Game2);//copies loaded save overtop blank save ensuring all old saves get new save conent/features
	// }
}

//--offline progression--//
function OfflineOnLoad(){
	for(var A=0;A<buildings.length;A++){
		PPS=PPS+=(Game.BQty[A]*buildings[A].PerSec);
	};
	PPS=round(PPS*(offlineprogress/1000),1);//converts offlineprogress into seconds, rounds to nearest whole second, multiplies by parts per second
	let x = 0;
	let T=window.setInterval(function(){
		x++;
		document.getElementById("offlineprogress").style.opacity=x+"%";//fade in
		document.getElementById("offlineprogress-container").style.opacity=x+"%";//fade in
		if(x>=100){
			clearInterval(T);
			OfflineOnLoad2();//waits to calculate until faded in
		}
	},5);
}
function CloseOfflineWindow(){
	disableitem("offlinebutton")
	let x=100;
	let T=window.setInterval(function(){
		x--;
		document.getElementById("offlineprogress").style.opacity=x+"%";//fade out
		document.getElementById("offlineprogress-container").style.opacity=x+"%";//fade in
		if(x<=0){
			clearInterval(T);
			lockitem("offlineprogress");
			lockitem("offlineprogress-container");
		}
	},5);
	Game.parts+=PPS;
	Game.parts=rounddown(Game.parts,1);//rounds down to avoid floating
	GameSave();
	UpdateData();//updates ui after offline gains
}

function OfflineOnLoad2(){
	let x=0;
	let T=window.setInterval(function(){
		if(x<PPS-1000000){
			x+=100000;
			document.getElementById("offlinepartsnumb").innerHTML=x;
		};
		if(x<PPS-100000){
			x+=10000;
			document.getElementById("offlinepartsnumb").innerHTML=x;
		};
		if(x<PPS-10000){
			x+=1000;
			document.getElementById("offlinepartsnumb").innerHTML=x;
		};
		if(x<PPS-1000){
			x+=100;
			document.getElementById("offlinepartsnumb").innerHTML=x;
		};
		if(x<PPS-100){
			x+=10;
			document.getElementById("offlinepartsnumb").innerHTML=x;
		};
		if(x<PPS-2){
			x++;
			document.getElementById("offlinepartsnumb").innerHTML=x;
		};
		if(x<PPS-0.1){
			x+=0.1;
			document.getElementById("offlinepartsnumb").innerHTML=x.toFixed(1);
		};
		if(x==PPS.toFixed(1)){
			x=rounddown(PPS,1);
			document.getElementById("offlinepartsnumb").innerHTML=x;
			clearInterval(T);
		};
	},1);
}

//--Dynamically create objects--//
function InitItems(){//name,value
	LoadItem("C1",100);
}
function LoadItem(name,value){
	let id = Items.length;
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
	let id = buildings.length;
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
		disableitem("CostCheap");
		BCostMul=0.1;
	}else{
		enableitem("CostCheap");
		BCostMul=1;
	}
	for(id=0;id<buildings.length;id++){//Calculate cost of buildings
		buildings[id].Cost=round((buildings[id].BCost*BCostMul*(1.3**Game.BQty[id])),0);
	}
	
	if(Game.Upgrades[1]==1){
		disableitem("ProductionMulti");
		ProdMulti=100;
	}else{
		enableitem("ProductionMulti");
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
		disableitem("AutoSell");
	}else{
		enableitem("AutoSell");
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
		localStorage.clear();
		location.reload();
}
function resetconfirm(){
	unlockitem("reset-container")
}
function resetno(){
	lockitem("reset-container")
}
	

//--lock and unlock classes--//
function lockitem(item){
document.getElementById(item).className = document.getElementById(item).className + "locked";
}
function unlockitem(item){
document.getElementById(item).className = document.getElementById(item).className.replace("locked","");
}

//--disable and enable classes--//
function disableitem(item){
document.getElementById(item).disabled=true;
}
function enableitem(item){
document.getElementById(item).dsiabled=false;
}


//--Save--//
var SaveTimer = window.setInterval(function(){GameSave()}, 1000);
function GameSave(){
	var date = new Date();
	Game.Time=date.getTime()
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
		let partsprogress=0;
		let progresstimer = window.setInterval(function(){
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
		let sellprogress=0;
		let progresstimer = window.setInterval(function(){
			sellprogress++;
			document.getElementById("money1Bar").style.width=sellprogress+"%";
			document.getElementById("money1progressspan").innerHTML=sellprogress+"%";
			if(sellprogress>=100){
				Game.money+=rounddown(Game.parts,0);
				Game.parts=0;
				clearInterval(progresstimer);
				document.getElementById("money1Bar").style.width=sellprogress+"%";
				document.getElementById("money").innerHTML = Game.money;
				document.getElementById("parts").innerHTML = Game.parts;
				canmoney=0;
			};
		},50);
	}
};
function sellC1(){
	if(canmoney==0){
		canmoney=1;
		let sellprogress=0;
		let progresstimer = window.setInterval(function(){
			sellprogress++;
			document.getElementById("money2Bar").style.width=sellprogress+"%";
			document.getElementById("money2progressspan").innerHTML=sellprogress+"%";
			if(sellprogress>=100){
				Game.money+=rounddown(Game.Items[0]*Items[0].Value,0);
				Game.Items[0]=0;
				clearInterval(progresstimer);
				document.getElementById("money2Bar").style.width=sellprogress+"%";
				document.getElementById("money").innerHTML = Game.money;
				document.getElementById("C1Qty").innerHTML=Game.Items[0];
				canmoney=0;
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
		let C1progress=0;
		let progresstimer = window.setInterval(function(){
			C1progress++;
			document.getElementById("C1Bar").style.width=C1progress+"%";
			document.getElementById("C1Progressspan").innerHTML=C1progress+"%";
			if(C1progress>=100){
				Game.Items[0]+=1
				clearInterval(progresstimer);
				document.getElementById("C1Bar").style.width=C1progress+"%";
				canC1=0;
				document.getElementById("C1Qty").innerHTML=Game.Items[0];
			};
		},100);
	}
};