// Starting values
let waterLevel=50;

let light=true;
let lightLevel=10;

let soilLevel=50;

// Grabbing elements
const waterLevelEl=document.getElementById("waterLevel");
const giveWaterBtn=document.getElementById("giveWater");

const togglelightBtn=document.getElementById("toggleLight");
const lightLevelEl=document.getElementById("lightLevel");

const replaceSoilBtn=document.getElementById("replaceSoil");
const soilLevelEl=document.getElementById("soilLevel");

const overalLevelEl=document.getElementById("overallLevel");

const plantEl=document.getElementById("plant");

// Saving game
const saved_game="plant_state";

function saveGame(){
    const state={waterLevel,light,lightLevel,soilLevel,};
    localStorage.setItem(saved_game, JSON.stringify(state));
}

function loadGame(){
    const saved=localStorage.getItem(saved_game);
    if (!saved) return;
    const state=JSON.parse(saved);

    if (typeof state.waterLevel==="number"){
        waterLevel=state.waterLevel;
    }
    if (typeof state.light==="boolean"){
        light=state.light;
    }
    if (typeof state.lightLevel==="number"){
        lightLevel=state.lightLevel;
    }
    if (typeof state.soilLevel==="number"){
        soilLevel=state.soilLevel;
    }
}

// Determine Plant Health
function calculateOverallHealth(){

    ////
    let tempOverall=Math.round((waterLevel*3+(lightLevel/2)+soilLevel*3)/6)
    
    if ((waterLevel<5 && soilLevel<5)){
        return "horrible"
    }
    if (lightLevel>90){
        return "overlit"
    }
    if (tempOverall>100 || waterLevel>100){
        return "overwatered"
    } else if (tempOverall>60){
        return "thriving"
    } else if (tempOverall>50){
        return "good"
    } else if (tempOverall>20){
        return "weak"
    } else{
        return "poor"
    }
}
// Rendering
function renderWater(){
    waterLevelEl.textContent="Water: "+waterLevel;
}
function renderLight(){
    lightLevelEl.textContent="Light: "+lightLevel;
}
function renderSoil(){
    soilLevelEl.textContent="Soil: "+soilLevel;
}

function updatePlantColor(){
    const state=calculateOverallHealth();

    plantEl.classList.remove("over-lit", "overwatered", "thriving", "good", "weak", "poor", "horrible"
    );

    plantEl.classList.add(state);
}

function updateBackground(){
    if (light) {
        plantEl.classList.add("light-on");
    } else {
        plantEl.classList.remove("light-on");
    }
}

function renderOverall(){
    overalLevelEl.textContent="Your plant is "+calculateOverallHealth();
}

// Buttons
giveWaterBtn.addEventListener("click", function () {
    waterLevel +=30;
    renderWater();
    saveGame();
});

togglelightBtn.addEventListener("click", function (){
    if (light===true){
        light=false;
        togglelightBtn.textContent="Give Light"
    } else{
        light=true;
        togglelightBtn.textContent="Give Shade"
        if (lightLevel<10){
            lightLevel=10;
        }
    }
    renderLight();
    updateBackground();
    saveGame();
});

replaceSoilBtn.addEventListener("click",function(){
    soilLevel=40;
    waterLevel=12;
    renderSoil();
    saveGame();
});

setInterval(function () {
    // Game logic
    if (light===true){
        if (waterLevel>1){
            waterLevel-=2;
        } else if(waterLevel>0){
            waterLevel-=1;
        }
        if (lightLevel<100){
            lightLevel+=1;
        }
        if (waterLevel>=50 && waterLevel<=100){
            soilLevel+=1;
        } else if(soilLevel>0){
            soilLevel-=1;
        }
    }else{
        if (waterLevel>0){
            waterLevel-=1;
        }
        if (lightLevel>10){
            lightLevel-=10;
        } else if (lightLevel>0){
            lightLevel-=1;
        }
        if (waterLevel>=75 && soilLevel>1){
            soilLevel-=2;
        } else if(soilLevel<75 && soilLevel>0){
            soilLevel-=1;
        }
    }

    // Update screen
    renderSoil();
    renderWater();
    renderLight();
    renderOverall();
    updatePlantColor();
    updateBackground();
    saveGame();
}, 1000);

// Initial load
loadGame();
renderSoil();
renderWater();
renderLight();
renderOverall();
updatePlantColor();
updateBackground();