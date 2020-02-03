window.onload = function(){
	initBuildings();
	initItems();
	initData();
	initStats();
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
	canMoney3=0;
	canC1=0;//from being spammed
	canC2=0;
	canSpin=0;
	stats=[];
	
	
	game={
	parts:0,
	bQty:[],
	upgrades:[],
	money:0,
	items:[],
	time:date.getTime(),
	firstLaunchOneOff:0,
	rollingJackpot:1000000,
	stats:[]
	};
	
	
	//--Loading Saves--//
var game2 = JSON.parse(localStorage.getItem('idleParts.gameSave'));
if(	localStorage.getItem('idleParts.gameSave') !== null){//if there is a save
		offlineProgress=(game.time-=game2.time);//difference in time from last save to page load in ms
		Object.assign(game,game2);//copies loaded save overtop blank save ensuring all old saves get new save conent/features
		
}
////////////////////////////////////////////////////////////////////////////
function buySlot(){
	if(game.items[0]>=10 && game.items[1]>=10 && game.parts>=100){
		buyUpgrade(4);
		game.items[0]-=10;
		game.items[1]-=10;
		game.parts-=100;
	}else{
		let text=document.getElementById("floatingText");
		text.innerHTML="You need 100 Parts, 10 C1 and 10 C2";
		text.style.opacity=1;
		text.style.left="10%";
		text.style.top="50";
		let x=100;
		let T=window.setInterval(function(){
		x--;
		text.style.opacity=x+"%";
		text.style.top=150-x;
			if(x<=0){
			clearInterval(T);
			lockItem("offlineProgressContainer");
			}
		},15);
	}
}
////////////////////////////////////////////////////////////////////////////



//--First Launch--//
function firstLaunch(){
	if(game.firstLaunchOneOff==0){//Only displays this message on new game
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
			game.firstLaunchOneOff=1;
		}
	},5);
}

//--slot machine--//
function spinSlots(){
	if (canSpin==0 && game.money>=10){
		game.money-=10;
		game.rollingJackpot+=100;
		game.stats[1]+=1;
		game.stats[5]-=10;
		// document.getElementById("oddsD1").innerHTML = "$"+game.rollingJackpot.toLocaleString();
		document.getElementById("jackpotContainer").innerHTML = "$"+game.rollingJackpot.toLocaleString();
		document.getElementById("money").innerHTML = game.money.toLocaleString();
		canSpin=1;
		disableItem("slotButton");
		let a=100;
		let T=window.setInterval(function(){
		a--;
		document.getElementById("costToPlay").style.opacity= a+"%";
		if(document.getElementById("extraBitsBottom").classList.contains("extraBitsBottomExtended")==true){
			document.getElementById("costToPlay").style.bottom=a+130;
		}else{
			document.getElementById("costToPlay").style.bottom=a-100;
		}
		if(a<=0){
			clearInterval(T);
		}
	},30);
		let slot1Seed=randomInt(20,40);
		slot2Seed=randomInt(40,60);
		slot3Seed=randomInt(60,100);
		s1=0;
		s2=0;
		s3=0;
		trueSeed=randomInt(0,999);
		ts1=0;
		ts2=0;
		ts3=0;
		
		switch(true){
			case trueSeed>=0 && trueSeed<=4:
				ts1=1;ts2=1;ts3=1;
			break;
			case trueSeed>=5 && trueSeed<=14:
				ts1=2;ts2=2;ts3=2;
			break;
			case trueSeed>=15 && trueSeed<34:
				ts1=3;ts2=3;ts3=3;
			break;
			case trueSeed>=35 && trueSeed<=69:
				ts1=4;ts2=4;ts3=4;
			break;
			case trueSeed>=70 && trueSeed<=119:
				ts1=5;ts2=5;ts3=5;
			break;
			case trueSeed>=120 && trueSeed<=189:
				ts1=6;ts2=6;ts3=6;
			break;
			case trueSeed>=190 && trueSeed<=269:
				ts1=7;ts2=7;ts3=7;
			break;
			case trueSeed>=270 && trueSeed<=369:
				ts1=8;ts2=8;ts3=8;
			break;
			case trueSeed>=370 && trueSeed<=419:
				ts1=8;ts2=8;ts3=randomInt(1,7);
			break;
			case trueSeed>=420 && trueSeed<=469:
				ts1=8;ts2=randomInt(1,7);ts3=8;
			break;
			case trueSeed>=470 && trueSeed<=519:
				ts1=randomInt(1,7);ts2=8;ts3=8;
			break;
			case trueSeed>=520 && trueSeed<=579:
				ts1=8;ts2=randomInt(1,7);ts3=randomInt(1,7);
			break;
			case trueSeed>=580 && trueSeed<=639:
				ts1=randomInt(1,7);ts2=randomInt(1,7);ts3=8;
			break;
			case trueSeed>=640 && trueSeed<=699:
				ts1=randomInt(1,7);ts2=8;ts3=randomInt(1,7);
			break;
			case trueSeed>=700 && trueSeed<=799:
				ts1=randomInt(1,5);ts2=randomInt(1,5);ts3=randomInt(6,7);
			break;
			case trueSeed>=800 && trueSeed<=899:
				ts1=randomInt(1,5);ts2=randomInt(6,7);ts3=randomInt(1,5);
			break;
			case trueSeed>=900 && trueSeed<=999:
				ts1=randomInt(6,7);ts2=randomInt(1,5);ts3=randomInt(1,5);
			break;
		}
		
		console.log("s1:"+slot1Seed,"s2:"+slot2Seed,"s3:"+slot3Seed,"trueseed:"+trueSeed);
		console.log(ts1,ts2,ts3);
		
		s1T=setInterval(function(){
			s1++;
			let slotTile = document.getElementById("slot1");
			if (slotTile.className=="a8"){
				slotTile.className = "a1";
			}
			if (s1>=slot1Seed){
				clearInterval(s1T);
				slotTile.className = "a"+(ts1-1)
			}
			slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
		},50);
		s2T=setInterval(function(){
			s2++;
			let slotTile = document.getElementById("slot2");
			if (slotTile.className=="a8"){
				slotTile.className = "a1";
			}
			if (s2>=slot2Seed){
				clearInterval(s2T);
				slotTile.className = "a"+(ts2-1)
			}
			slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
		},50);
		s3T=setInterval(function(){
			s3++;
			let slotTile = document.getElementById("slot3");
			if (slotTile.className=="a8"){
				slotTile.className = "a1";
			}
			if (s3>=slot3Seed){
				clearInterval(s3T);
				slotTile.className = "a"+(ts3-1)
				enableItem("slotButton");
				canSpin=0;
				winCheck(ts1,ts2,ts3);
			}
			slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
		},50);

	}
}
function winCheck(x,y,z){
	switch(true){
		case x==1&&y==1&&z==1:
			document.getElementById("spinnerWinningsText").innerHTML="SUPER JACKPOT!!!";
			document.getElementById("spinnerWinningsValue").innerHTML="+$"+game.rollingJackpot.toLocaleString();
			game.money+=game.rollingJackpot;
			game.stats[5]+=game.rollingJackpot;
			game.rollingJackpot=1000000;
			document.getElementById("money").innerHTML = game.money.toLocaleString();
			document.getElementById("jackpotContainer").innerHTML = "$"+game.rollingJackpot.toLocaleString();
			let n=0;
			let m=window.setInterval(function(){
				n++;
				let potColor = document.getElementById("jackpotContainer");
				potColor2 = document.getElementById("jackpotTitle");
				potColor3 = document.getElementById("spinnerContainer");
				if (potColor.className=="jC4"){
					potColor.className = "jC0";
				}
				if (potColor2.className=="jC4"){
					potColor2.className = "jC0";
				}
				if (potColor3.className=="jC4"){
					potColor3.className = "jC0";
				}
				potColor.className = "jC"+(parseInt(potColor.className.substring(2))+1)
				potColor2.className = "jC"+(parseInt(potColor2.className.substring(2))+1)
				potColor3.className = "jC"+(parseInt(potColor3.className.substring(2))+1)
				if(n>=80){
					clearInterval(m);
					potColor.className="jC1";
					potColor2.className="jC1";
					potColor3.className="jC1";
					}
			},50);
			coinFall(100);
		break;
		case x==2&&y==2&&z==2:
			document.getElementById("spinnerWinningsText").innerHTML="JACKPOT!";
			document.getElementById("spinnerWinningsValue").innerHTML="+$10,000";
			game.money+=10000;
			game.stats[5]+=10000;
			document.getElementById("money").innerHTML = game.money.toLocaleString();
			let a=0;
			let b=window.setInterval(function(){
				a++;
				let potColor3 = document.getElementById("spinnerContainer");
				if (potColor3.className=="jC4"){
					potColor3.className = "jC0";
				}
				potColor3.className = "jC"+(parseInt(potColor3.className.substring(2))+1)
				if(a>=60){
					clearInterval(b);
					potColor3.className="jC1";
					}
			},50);
			coinFall(100);
		break;
		case x==3&&y==3&&z==3:
			document.getElementById("spinnerWinningsText").innerHTML="Mini Jackpot!";
			document.getElementById("spinnerWinningsValue").innerHTML="+$1,000";
			game.money+=1000;
			game.stats[5]+=1000;
			document.getElementById("money").innerHTML = game.money.toLocaleString();
			coinFall(50);
		break;
		case x==4&&y==4&&z==4:
			document.getElementById("spinnerWinningsText").innerHTML="Big Bills!";
			document.getElementById("spinnerWinningsValue").innerHTML="+$500";
			game.money+=500;
			game.stats[5]+=500;
			document.getElementById("money").innerHTML = game.money.toLocaleString();
			coinFall(35);
		break;
		case x==5&&y==5&&z==5:
			document.getElementById("spinnerWinningsText").innerHTML="Small Bills!";
			document.getElementById("spinnerWinningsValue").innerHTML="+$100";
			game.money+=100;
			game.stats[5]+=100;
			document.getElementById("money").innerHTML = game.money.toLocaleString();
			coinFall(25);
		break;
		case x==6&&y==6&&z==6:
			document.getElementById("spinnerWinningsText").innerHTML="Pile of Coins!";
			document.getElementById("spinnerWinningsValue").innerHTML="+$50";
			game.money+=50;
			game.stats[5]+=50;
			document.getElementById("money").innerHTML = game.money.toLocaleString();
			coinFall(15);
		break;
		case x==7&&y==7&&z==7:
			document.getElementById("spinnerWinningsText").innerHTML="Fistful of Coins";
			document.getElementById("spinnerWinningsValue").innerHTML="+$30";
			game.money+=30;
			game.stats[5]+=30;
			document.getElementById("money").innerHTML = game.money.toLocaleString();
			coinFall(10);
		break;
		case x==8&&y==8&&z==8:
			document.getElementById("spinnerWinningsText").innerHTML="A Few Coins";
			document.getElementById("spinnerWinningsValue").innerHTML="+$10";
			game.money+=10;
			game.stats[5]+=10;
			document.getElementById("money").innerHTML = game.money.toLocaleString();
			coinFall(5);
		break;
		// case x==7&&y==7&&z==8||x==7&&y==7&&z==6||x==7&&y==8&&z==7||x==7&&y==8&&z==8||x==7&&y==8&&z==6||x==7&&y==6&&z==7||x==7&&y==6&&z==8||x==7&&y==6&&z==6||x==8&&y==7&&z==7||x==8&&y==7&&z==8||x==8&&y==7&&z==6||x==8&&y==8&&z==7||x==8&&y==8&&z==6||x==8&&y==6&&z==7||x==8&&y==6&&z==8||x==8&&y==6&&z==6||x==6&&y==7&&z==7||x==6&&y==7&&z==8||x==6&&y==7&&z==6||x==6&&y==8&&z==7||x==6&&y==8&&z==8||x==6&&y==8&&z==6||x==6&&y==6&&z==7||x==6&&y==6&&z==8:
			// document.getElementById("spinnerWinningsText").innerHTML=" ";
			// document.getElementById("spinnerWinningsValue").innerHTML="+$5";
			// game.money+=5;
			// game.stats[5]+=5;
			// document.getElementById("money").innerHTML = game.money.toLocaleString();
			// coinFall(1);
		// break;
		case x==8&&y==8||y==8&&z==8||x==8&&z==8:
			document.getElementById("spinnerWinningsText").innerHTML="Two Coins";
			document.getElementById("spinnerWinningsValue").innerHTML="+$6";
			game.money+=6;
			game.stats[5]+=6;
			game.rollingJackpot+=1000;
			document.getElementById("money").innerHTML = game.money.toLocaleString();
			document.getElementById("jackpotContainer").innerHTML = "$"+game.rollingJackpot.toLocaleString();
			// document.getElementById("oddsD1").innerHTML = "$"+game.rollingJackpot.toLocaleString();
			coinFall(2);
		break;
		case x==8||y==8||z==8:
			document.getElementById("spinnerWinningsText").innerHTML="One Coin";
			document.getElementById("spinnerWinningsValue").innerHTML="+$3";
			game.money+=3;
			game.stats[5]+=3;
			game.rollingJackpot+=500;
			document.getElementById("money").innerHTML = game.money.toLocaleString();
			document.getElementById("jackpotContainer").innerHTML = "$"+game.rollingJackpot.toLocaleString();
			// document.getElementById("oddsD1").innerHTML = "$"+game.rollingJackpot.toLocaleString();
			coinFall(1);
		break;
		default:
			document.getElementById("spinnerWinningsText").innerHTML=" ";
			document.getElementById("spinnerWinningsValue").innerHTML="Try again!";
		break;
	}
	let a=100;
	let T=window.setInterval(function(){
		a--;
		document.getElementById("spinnerWinningsContainer").style.opacity=a+"%";
		document.getElementById("spinnerWinningsContainer").style.top=a-50;
		if(a<=0){
			clearInterval(T);
		}
	},30);

}
function coinFall(amount){ 
	let y=0;
	coinPos2=0;
	for(x=1;x<=amount;x++){
		let coinDiv = document.createElement("div");
		coinDiv.classList="coin";
		coinDiv.id="coin"+x;
		document.getElementById("payoutCoinsContainer").appendChild(coinDiv);
		let coin=document.getElementById("coin"+x);	
		coinPos=randomInt(0,275);
		coinPos2=400-coinPos;
		coin.style.left=randomInt(10,290);
		coin.style.top=coinPos;
		coin.style.opacity=(coinPos2+100)/100;
	}
	let q=window.setInterval(function(){
		y++;
		for(x=1;x<=amount;x++){
			if(document.getElementById("coin"+x)!==null){
				let coin=document.getElementById("coin"+x);	
				coin.style.marginTop=y;
				coin.style.opacity-=0.01;
				if(coin.style.opacity<=0){
					coin.classList="locked";
				}
			}
		}
		
	},1);
	setTimeout(function(){
		let coin=document.getElementById("payoutCoinsContainer");	
			while (coin.firstChild){
				coin.removeChild(coin.firstChild)
			}
			window.clearInterval(q);
	},2000);
}
function toggleOdds(){
	let x=document.getElementById("oddsChart");
	y=document.getElementById("extraBitsBottom");
	x.classList.toggle("locked");
	y.classList.toggle("extraBitsBottomRetracted");
	y.classList.toggle("extraBitsBottomExtended");	
}

//--Toggle Stat Page--//
function toggleStats(){
	document.getElementById("playerStatsOuterContainer").classList.toggle("locked");
}

//--offline progression--//
function offlineOnLoad(){
	if(game.firstLaunchOneOff==1){//Wont fire offline progress unless the user has played before
		unlockItem("offlineProgressContainer");
		for(var A=0;A<buildings.length;A++){
			PPS=PPS+=(game.bQty[A]*buildings[A].perSec);
		};
		PPS=PPS*(offlineProgress/1000);//converts offlineProgress into seconds, rounds to nearest whole second, multiplies by parts per second and adds a decimal if one doesn't exist
		let x = 0;
		let T=window.setInterval(function(){
		x++;
		document.getElementById("offlineProgressContainer").style.opacity=x+"%";//fade in
		if(x>=100){
				clearInterval(T);
				offlineOnLoad2();//waits to calculate until faded in
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

function offlineOnLoad2(){
	let x=0;
	let T=window.setInterval(function(){
		switch(true){
		case x<PPS/100000:
			x+=PPS/1000000;
			document.getElementById("offlinePartsNumb").innerHTML=x.toLocaleString();
		break;
		case x<PPS/10000:
			x+=PPS/100000;
			document.getElementById("offlinePartsNumb").innerHTML=x.toLocaleString();
		break;
		case x<PPS/1000:
			x+=PPS/10000;
			document.getElementById("offlinePartsNumb").innerHTML=x.toLocaleString();
		break;
		case x<PPS/100:
			x+=PPS/1000;
			document.getElementById("offlinePartsNumb").innerHTML=x.toLocaleString();
		break;
		case x<PPS:
			x+=PPS/100
			document.getElementById("offlinePartsNumb").innerHTML=x.toLocaleString();
		break;
		case x>=PPS:
			x=rounddown(PPS,1);
			document.getElementById("offlinePartsNumb").innerHTML=x.toLocaleString();
			clearInterval(T);
		break;
		};
	},10);
}
//--Dynamically create objects--//
function initStats(){
	loadStat("Parts Crafted",0);
	loadStat("Times Gambled",0);
	loadStat("Parts Sold",0);
	loadStat("C1 Crafted",0);
	loadStat("C1 Sold",0);
	loadStat("Gambling Profits",0);
	loadStat("C2 Crafted",0);
	loadStat("C2 Sold",0);
}

function loadStat(name,value){
	let id=stats.length;
	stats[id]=new Stat();
	stats[id]=name;
	if(localStorage.getItem('idleParts.gameSave') == null){
		game.stats[id]=value;	
	}
}

function initItems(){//name,value
	loadItem("C1",50);
	loadItem("C2",500);
}
function loadItem(name,value){
	let id = items.length;
	items[id]=new Item();
	items[id].value=value;
	items[id].name=name;
	if(localStorage.getItem('idleParts.gameSave') == null){//sets owned items to zero for all items to prevent NaN
		game.items[id] = 0;
	}
}

function initBuildings(){//name,cost,persec
	loadBuilding("Cheap Robot",10,0.2);
	loadBuilding("Robot",100,0.5);
	loadBuilding("Good Robot",1000,1);
}
function loadBuilding(name,cost,persec){
	let id = buildings.length;
	buildings[id] = new building();
	buildings[id].name = name;
	buildings[id].perSec = persec;
	buildings[id].bPerSec=persec;
	buildings[id].cost=cost;
	buildings[id].bCost=cost;
	if(localStorage.getItem('idleParts.gameSave') == null){//sets owned buildings to zero for all items to prevent NaN
	game.bQty[id] = 0;
	}
}

//--Updates visuals for numbers at call--//
function updateData(){
	document.getElementById("parts").innerHTML = game.parts.toLocaleString();
	document.getElementById("building1Qty").innerHTML = buildings[0].name +": "+ game.bQty[0];
	document.getElementById("building1Cost").innerHTML = "cost: " + buildings[0].cost.toLocaleString();
	document.getElementById("building1PerSec").innerHTML = "Parts/sec " + buildings[0].perSec;
	document.getElementById("building2Qty").innerHTML = buildings[1].name +": "+ game.bQty[1];
	document.getElementById("building2Cost").innerHTML = "cost: " + buildings[1].cost.toLocaleString();
	document.getElementById("building2PerSec").innerHTML = "Parts/sec " + buildings[1].perSec;
	document.getElementById("building3Qty").innerHTML = buildings[2].name +": "+ game.bQty[2];
	document.getElementById("building3Cost").innerHTML = "cost: " + buildings[2].cost.toLocaleString();
	document.getElementById("building3PerSec").innerHTML = "Parts/sec " + buildings[2].perSec;
	document.getElementById("money").innerHTML = game.money.toLocaleString();
	document.getElementById("c1Qty").innerHTML=game.items[0].toLocaleString();
	document.getElementById("c2Qty").innerHTML=game.items[1].toLocaleString();
	// document.getElementById("oddsD1").innerHTML = "$"+game.rollingJackpot.toLocaleString();
	document.getElementById("jackpotContainer").innerHTML ="$"+game.rollingJackpot.toLocaleString();
}
function updateParts(){
	document.getElementById("parts").innerHTML = game.parts.toLocaleString();
	document.getElementById("money").innerHTML = game.money.toLocaleString();
}
function updateStats(){
	document.getElementById("partsClicked").innerHTML=stats[0]+": "+game.stats[0];
	document.getElementById("timesGambled").innerHTML=stats[1]+": "+game.stats[1];
	document.getElementById("partsSold").innerHTML=stats[2]+": "+game.stats[2];
	document.getElementById("c1Crafted").innerHTML=stats[3]+": "+game.stats[3];
	document.getElementById("c1Sold").innerHTML=stats[4]+": "+game.stats[4];
	document.getElementById("c2Crafted").innerHTML=stats[6]+": "+game.stats[6];
	document.getElementById("c2Sold").innerHTML=stats[7]+": "+game.stats[7];
	document.getElementById("gambleProfit").innerHTML=stats[5]+": "+game.stats[5].toLocaleString();
}

function updateUpgrades(){
	if(game.upgrades[0]==1){
		disableItem("costCheap");
		bCostMul=0.001;
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
			buildings[id].perSec=buildings[id].bPerSec*prodMulti;
		}
	}else{
		enableItem("productionMulti");
		prodMulti=1;
		for(id=0;id<buildings.length;id++){//Calculate production of parts
			buildings[id].perSec=buildings[id].bPerSec*prodMulti;
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
	if(game.upgrades[4]==1){
		lockItem("unlockSlot");
		unlockItem("spinnerOuterContainer");		
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
function Stat(){
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
document.getElementById(item).className = document.getElementById(item).className + " locked";
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
//var SaveTimer = window.setInterval(function(){gameSave()}, 1000);
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
var TimerUpdate = window.setInterval(function(){updateTick();updateData();}, 1000);
var Timermoney = window.setInterval(function(){moneyTick()},1000);


function partsTick(){
	for (var MT = 0;MT < buildings.length;MT++) {
		game.parts += game.bQty[MT]*buildings[MT].perSec;
		game.parts=round(game.parts,1);//prevents "drift" of parts due to floating point. Alternative is game.parts.toFixed(1) on following line
		document.getElementById("parts").innerHTML = game.parts.toLocaleString();
	}
}


function updateTick(){
	for(var UT = 0;UT < buildings.length;UT++){
		partsPerSec = round(partsPerSec+(game.bQty[UT]*buildings[UT].perSec),1);//multiplies all buildings by their quatites and then adds them all together
	}
	document.getElementById("partsPerSec").innerHTML = partsPerSec.toLocaleString();
	partsPerSec = 0;//reset to zero is required or it will loop on itself
}
function moneyTick(){
	document.getElementById("money").innerHTML = game.money.toLocaleString();
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
				game.stats[0]+=1;
				clearInterval(progresstimer);
				document.getElementById("partsBar").style.width=partsProgress+"%";
				document.getElementById("parts").innerHTML = game.parts.toLocaleString();
				canParts=0;
			};
		}, 10);// x/10=sec to craft
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
				game.stats[2]+=rounddown(game.parts,0);
				game.parts=0;
				clearInterval(progresstimer);
				document.getElementById("money1Bar").style.width=sellprogress+"%";
				document.getElementById("money").innerHTML = game.money.toLocaleString();
				document.getElementById("parts").innerHTML = game.parts.toLocaleString();
				canMoney=0;
			};
		},50);
	}
};

//--Selling C--//
function sellC1(){
	if(canMoney2==0){
		canMoney2=1;
		let sellprogress=0;
		let progresstimer = window.setInterval(function(){
			sellprogress++;
			document.getElementById("money2Bar").style.width=sellprogress+"%";
			document.getElementById("money2ProgressSpan").innerHTML=sellprogress+"%";
			if(sellprogress>=100){
				game.money+=rounddown(game.items[0]*items[0].value,0);
				game.stats[4]+=rounddown(game.items[0],0);
				game.items[0]=0;
				clearInterval(progresstimer);
				document.getElementById("money2Bar").style.width=sellprogress+"%";
				document.getElementById("money").innerHTML = game.money.toLocaleString();
				document.getElementById("c1Qty").innerHTML=game.items[0];
				canMoney2=0;
			};
		},50);
	}
};
function sellC2(){
	if(canMoney3==0){
		canMoney3=1;
		let sellprogress=0;
		let progresstimer = window.setInterval(function(){
			sellprogress++;
			document.getElementById("money3Bar").style.width=sellprogress+"%";
			document.getElementById("money3ProgressSpan").innerHTML=sellprogress+"%";
			if(sellprogress>=100){
				game.money+=rounddown(game.items[1]*items[1].value,0);
				game.stats[7]+=rounddown(game.items[1],0);
				game.items[1]=0;
				clearInterval(progresstimer);
				document.getElementById("money3Bar").style.width=sellprogress+"%";
				document.getElementById("money").innerHTML = game.money.toLocaleString();
				document.getElementById("c1Qty").innerHTML=game.items[1];
				canMoney3=0;
			};
		},50);
	}
};

//--Crafting C--//
function craftC1(){
	if(canC1==0 && game.parts>=10){
		canC1=1;
		game.parts-=10;
		document.getElementById("parts").innerHTML = game.parts.toLocaleString();
		let C1progress=0;
		let progresstimer = window.setInterval(function(){
			C1progress++;
			document.getElementById("c1Bar").style.width=C1progress+"%";
			document.getElementById("c1ProgressSpan").innerHTML=C1progress+"%";
			if(C1progress>=100){
				game.items[0]+=1;
				game.stats[3]+=1;
				clearInterval(progresstimer);
				document.getElementById("c1Bar").style.width=C1progress+"%";
				canC1=0;
				document.getElementById("c1Qty").innerHTML=game.items[0];
			};
		},50);
	}else{
		null
	}
};
function craftC2(){
	if(canC2==0 && game.parts>=10 && game.items[0]>=5){
		canC1=1;
		game.parts-=10;
		game.items[0]-=5;
		document.getElementById("parts").innerHTML = game.parts.toLocaleString();
		document.getElementById("c1Qty").innerHTML=game.items[0];
		let C2progress=0;
		let progresstimer = window.setInterval(function(){
			C2progress++;
			document.getElementById("c2Bar").style.width=C2progress+"%";
			document.getElementById("c2ProgressSpan").innerHTML=C2progress+"%";
			if(C2progress>=100){
				game.items[1]+=1;
				game.stats[6]+=1;
				clearInterval(progresstimer);
				document.getElementById("c2Bar").style.width=C2progress+"%";
				canC2=0;
				document.getElementById("c2Qty").innerHTML=game.items[1];
			};
		},50);
	}
};

//--code stolen from stackoverflow--//
function getDigitCount(number) {
  return Math.max(Math.floor(Math.log10(Math.abs(number))), 0) + 1;
}
function getDigit(number, n, fromLeft) {
	const location = fromLeft ? getDigitCount(number) + 1 - n : n;
	return Math.floor((number / Math.pow(10, location - 1)) % 10);
}
function randomInt(min, max){
	return Math.floor((Math.random()*(max-min+1)) + min);
}
