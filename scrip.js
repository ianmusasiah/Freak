/* ===================================
   Freak Stake Calculator
   script.js
=================================== */

let appData = null;

// HTML Elements
const bankInput = document.getElementById("bank");
const stakeInput = document.getElementById("stakeInput");
const percentage = document.getElementById("percentage");
const myStake = document.getElementById("myStake");
const strategyTable = document.getElementById("strategyTable");
const resetBtn = document.getElementById("resetBtn");

// --------------------
// Load JSON
// --------------------

async function loadData(){

    const saved = localStorage.getItem("stakeCalculator");

    if(saved){

        appData = JSON.parse(saved);

    }else{

        const response = await fetch("data.json");

        appData = await response.json();

        localStorage.setItem(
            "stakeCalculator",
            JSON.stringify(appData)
        );

    }

    bankInput.value = appData.bank;

    drawTable();

}

loadData();


// --------------------
// Draw Strategy Table
// --------------------

function drawTable(){

    strategyTable.innerHTML = "";

    appData.strategy.forEach(item=>{

        strategyTable.innerHTML += `
        <tr>
            <td>${item.stake}</td>
            <td>${item.percent}%</td>
        </tr>
        `;

    });

}


// --------------------
// Save Bank
// --------------------

bankInput.addEventListener("input",()=>{

    appData.bank = Number(bankInput.value);

    localStorage.setItem(
        "stakeCalculator",
        JSON.stringify(appData)
    );

});


// --------------------
// Live Calculator
// --------------------

stakeInput.addEventListener("input",()=>{

    const value = Number(stakeInput.value);

    const found = appData.strategy.find(item=>item.stake===value);

    if(!found){

        percentage.innerHTML = "Not Found";

        myStake.innerHTML = "KSh 0";

        return;

    }

    percentage.innerHTML = found.percent + "%";

    const amount =
    (appData.bank * found.percent) / 100;

    myStake.innerHTML =
    "KSh " +
    amount.toFixed(2);

});


// --------------------
// Reset
// --------------------

resetBtn.addEventListener("click",async()=>{

    if(!confirm("Reset to default strategy?"))
    return;

    const response =
    await fetch("data.json");

    appData =
    await response.json();

    localStorage.setItem(
        "stakeCalculator",
        JSON.stringify(appData)
    );

    bankInput.value = appData.bank;

    percentage.innerHTML = "-";

    myStake.innerHTML = "KSh 0";

    stakeInput.value = "";

    drawTable();

});
