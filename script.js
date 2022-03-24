// get the DOM
const coinName = document.querySelector(".card-title");
const coinImg = document.querySelector(".logo");
const coinIsFavorite = document.getElementById("custom-control-input");
const coinInUsd = document.getElementById(".coinInUsd");
const coinInEur = document.getElementById(".coinInEur");
const coinInIls = document.getElementById(".coinInIls");
const loader = document.getElementById("loader");
const aboutMe = document.getElementById("about-me");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
let headline = document.querySelector(".headline");
let bodyDiv = document.querySelector(".bodyDiv");
let aboutDiv = document.querySelector("#aboutDiv");
let graphDiv = document.querySelector("#chartContainer");
getCoinInfo();

// Arr
let coinArr = [];
let searchArr = [];
let favoritesArr = [];
let favorGraph = favoritesArr.map(function (item) {
  return item['coinSymbol'];
});

// Search
searchButton.addEventListener("click", function searchResults(e) {
  e.preventDefault();
  for (let i = 0; i < coinArr.length; i++) {
    const inputValue = searchInput.value;
    if (inputValue === "") {
      document.getElementById(`coinCard${coinArr[i].id}`).style.display = "block";
    }
    else if (coinArr[i].name !== inputValue) {
      console.log(document.getElementById(`coinCard${coinArr[i].id}`));
      document.getElementById(`coinCard${coinArr[i].id}`).style.display = "none";
    }

  }

});

// Top Menu

document.getElementById("home").addEventListener("click", homePage);
document
  .getElementById("liveReports")
  .addEventListener("click", liveReportsPage);
document.getElementById("about").addEventListener("click", aboutPage);

// Favorites

function addToFavorites(coin, coinFavorite) {
  console.log(coin);
  if (coinFavorite.checked == false) {
    removeFavorite(coin);
  } else if (favoritesArr.length < 5) {
    if ($('#myModal').is(':visible')) {
      document.getElementById(`fav-switch-${coin.id}`).checked = true;
    }
    favoritesArr.push(coin);

  } else {
    coinFavorite.checked = false;
    getFavInfo();
  }

  console.log(favoritesArr);
}
function removeFavorite(coinFavorite) {
  favoritesArr = favoritesArr.filter((coin) => {
    if ($('#myModal').is(':visible')) {
      document.getElementById(`fav-switch-${coinFavorite.id}`).checked = false;
    }

    return coin.id !== coinFavorite.id;
  });
}


// Get Info

function getCoinInfo() {
  loader.removeAttribute("hidden");
  let url = `https://api.coingecko.com/api/v3/coins/list`;
  fetch(url)
    .then((res) => res.json())
    .then((coins) => {
      for (let i = 1000; i < 1020; i++) {
        let coin = {
          id: coins[i].id,
          name: coins[i].name,
          symbol: coins[i].symbol,
        };
        createCoinCard(coin, i);
        setTimeout(() => {
          loader.setAttribute("hidden", "");
        }, 2000);
      }

    });
}



function createCoinCard(coin, i) {
  let headline = document.querySelector(".headline");
  headline.innerHTML = "Cryptocurrencies";
  let coinDiv = document.createElement("div");
  coinDiv.className = "card";
  coinDiv.id = `coinCard${coin.id}`;
  let coinBody = document.createElement("div");
  coinBody.className = "card-body";
  coinBody.id = `coinBody${i}`;
  let coinName = document.createElement("h5");
  coinName.innerHTML = coin.name;
  let buttonFavoriteDiv = document.createElement("div");
  buttonFavoriteDiv.className = "custom-control custom-switch custom-switch-lg";
  let coinFavorite = document.createElement("input");
  coinFavorite.type = "checkbox";
  coinFavorite.id = `switch-${coin.id}`;
  coinFavorite.className = "custom-control-input";
  coinFavorite.addEventListener("change", () =>
    addToFavorites(coin, coinFavorite));
  let coinFavoriteLabel = document.createElement("label");
  coinFavoriteLabel.className = "custom-control-label";
  coinFavoriteLabel.htmlFor = `switch-${coin.id}`;
  coinFavoriteLabel.innerHTML = "Favorite";
  let cardFooter = document.createElement("div");
  cardFooter.className = "card-footer";
  cardFooter.id = `customFooter${i}`;
  let moreInfoBtn = document.createElement("button");
  moreInfoBtn.className = "btn btn-primary collapsed";
  moreInfoBtn.type = "button";
  moreInfoBtn.id = `infoBtn${i}`;
  moreInfoBtn.setAttribute("data-toggle", "collapse");
  moreInfoBtn.setAttribute("aria-expanded", false);
  moreInfoBtn.innerHTML = "<span>More Info</span>";
  moreInfoBtn.addEventListener("click", () => moreInfoClicked(i, coin.id, moreInfoBtn));
  document.getElementById("card-deck").appendChild(coinDiv);
  coinDiv.appendChild(coinBody);
  coinBody.appendChild(coinName);
  coinBody.appendChild(buttonFavoriteDiv);
  buttonFavoriteDiv.appendChild(coinFavorite);
  buttonFavoriteDiv.appendChild(coinFavoriteLabel);
  coinDiv.appendChild(cardFooter);
  cardFooter.appendChild(moreInfoBtn);
  getMoreInfo(i, coin.id);

}

function searchCoins(id) {
  coinArr = coinArr.filter((coinArr) => {
    return coinArr.id !== id;
  });
  document.getElementById("coinCard" + id).remove();
}

// More Info Collapse
function moreInfoClicked(i, coinId, moreInfoBtn) {
  let url = `https://api.coingecko.com/api/v3/coins/${coinId}`;

  if (moreInfoBtn.innerText === "More Info") {
    moreInfoBtn.innerText = "Less Info";
  }
  else if (moreInfoBtn.innerText === "Less Info") {
    moreInfoBtn.innerText = "More Info";
  }
  const coin = coinArr.find(c => c.coinId == coinId);
  if ($(`#infoBtn${i}`).hasClass("collapsed")) {
    $(`#moreInfo${i}`).toggle();
    $(`#moreInfo${i}`).removeClass("collapsed");
  } else {
    $(`#moreInfo${i}`).toggle();
    $(`#moreInfo${i}`).addClass("collapsed");
  }

  if (coin?.dataLoaded) {
    createMoreInfoElem(coin, i);
    return;
  }

  fetch(url)
    .then((res) => res.json())
    .then((c) => {
      createMoreInfoElem(c, i);
      coinArr.forEach(co => {
        if (co.coinId == coinId) {
          co.dataLoaded = true;
        }
      });
      updateDataLoaded(coinId, 120000);
    });
}

function getMoreInfo(i, coinId) {
  let url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
  fetch(url)
    .then((res) => res.json())
    .then((coin) => {
      createMoreInfoElem(coin, i);
      coin.coinId = coin.id;
      coinArr.push(coin);
      localStorage.setItem("coins", JSON.stringify(coinArr));
    });
}

function updateDataLoaded(coinId, time) {
  setTimeout(() => {
    coinArr.forEach(coin => {
      if (coin.id === coinId) {
        coin.dataLoaded = false;
        console.log(coin.dataLoaded);
      }
    });
  }, time);
}

function createMoreInfoElem(coin, i) {
  let coinBody = document.getElementById(`coinBody${i}`);
  let cardFooter = document.getElementById(`customFooter${i}`);
  let moreInfoDiv = document.getElementById(`moreInfo${i}`);
  if (moreInfoDiv) {
    Array.from(moreInfoDiv?.children)?.forEach(c => c.remove());
  } else {
    moreInfoDiv = document.createElement("div");
    let coinImg = document.createElement("img");
    coinImg.className = "logo";
    coinImg.src = coin.image.small;
    coinBody.appendChild(coinImg);
  }
  moreInfoDiv.className = "collapse";
  moreInfoDiv.id = `moreInfo${i}`;
  let moreInfoList = document.createElement("ul");
  let priceInUsd = document.createElement("li");
  priceInUsd.className = "priceInUsd";
  priceInUsd.innerHTML = `Price in USD : $${financial(
    coin.market_data.current_price.usd
  )}`;
  let priceInEur = document.createElement("li");
  priceInEur.className = "priceInEur";
  priceInEur.innerHTML = `Price in EUR : $${financial(
    coin.market_data.current_price.eur
  )}`;
  let priceInIls = document.createElement("li");
  priceInIls.className = "priceInIls";
  priceInIls.innerHTML = `Price in ILS : $${financial(
    coin.market_data.current_price.ils
  )}`;
  cardFooter.appendChild(moreInfoDiv);
  moreInfoDiv.appendChild(moreInfoList);
  moreInfoList.appendChild(priceInUsd);
  moreInfoList.appendChild(priceInEur);
  moreInfoList.appendChild(priceInIls);
}

// Coin Price Fix

function financial(x) {
  if (x > 1) {
    return Number.parseFloat(x)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return Number.parseFloat(x).toFixed(5);
  }
}


// About Page

function aboutPage() {
  pageLoader();
  aboutDiv.removeAttribute("hidden");
  graphDiv.setAttribute("hidden", "");
  document.querySelector(".bodyDiv").style.display = "none";
  document.querySelector(".card-deck").style.display = "none";
  headline.innerHTML = "About";
}


// Live Report Page

function liveReportsPage() {
  pageLoader();
  graphDiv.removeAttribute("hidden");
  aboutDiv.setAttribute("hidden", "");
  document.querySelector(".bodyDiv").style.display = "none";
  document.querySelector(".card-deck").style.display = "none";
  
  headline.innerHTML = "Live Reports";
  drawGraph()
  window.setInterval(updateCharts, 2000);
}


// Home Page

function homePage() {
  aboutDiv.setAttribute("hidden", "");
  for (let i = 0; i < coinArr.length; i++) {
    document.getElementById(`coinCard${coinArr[i].id}`).style.display = "block";
  }
  if (document.querySelector(".card-deck").style.display == "none") {
    pageLoader();
    graphDiv.setAttribute("hidden", "");
    document.querySelector(".card-deck").style.display = "flex";
    headline.innerHTML = "Cryptocurrencies";

  }

}


// Page Loader

function pageLoader() {
  loader.removeAttribute("hidden");
  setTimeout(() => {
    loader.setAttribute("hidden", "");
  }, 500);

}


// Modal

function favModal(coin, i) {
  const favoriteList = document.querySelector(".favorites-list");
  let coinBody = document.createElement("div");
  coinBody.className = "card-body";
  coinBody.id = `coinBody${i}`;
  let coinName = document.createElement("h5");
  coinName.innerHTML = coin.name;
  let buttonFavoriteDiv = document.createElement("div");
  buttonFavoriteDiv.className = "custom-control custom-switch custom-switch-lg";
  let coinFavorite = document.createElement("input");
  coinFavorite.type = "checkbox";
  coinFavorite.checked = true;
  coinFavorite.id = `fav-switch-${coin.id}`;
  coinFavorite.className = "custom-control-input";
  coinFavorite.addEventListener("change", () =>
    addToFavorites(coin, coinFavorite)
  );
  let coinFavoriteLabel = document.createElement("label");
  coinFavoriteLabel.className = "custom-control-label";
  coinFavoriteLabel.htmlFor = `switch-${coin.id}`;
  coinFavoriteLabel.innerHTML = "Favorite";
  favoriteList.appendChild(coinBody);
  coinBody.appendChild(coinName);
  coinBody.appendChild(buttonFavoriteDiv);
  buttonFavoriteDiv.appendChild(coinFavorite);
  buttonFavoriteDiv.appendChild(coinFavoriteLabel);
}

function getFavInfo() {
  document.querySelector(".favorites-list").innerHTML = "";
  for (let i = 0; i < favoritesArr.length; i++) {
    favModal(favoritesArr[i], i);
  }
  $("#myModal").modal("show");
}



//The Graph

window.setInterval(drawGraph, 2000);

let dps1=[];
let dps2=[];
let dps3=[];
let dps4=[];
let dps5=[];


let graphCoins = [];
function check(){

for (let j = 0; j < favoritesArr.length; j++) {
   graphCoins.push(favoritesArr[j].symbol)
  console.log(graphCoins)
}
graphCoins= graphCoins;
}

 function updateCharts(){ 

   let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=MKR,ETH,PAXG,BCH,BNB&tsyms=USD`;
    fetch(url)
      .then((res) => res.json())
      .then((datax) => {

        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        dps1.push({x:today.getTime(), y: datax.MKR.USD})
        dps2.push({x:today.getTime(), y: datax.ETH.USD})
        dps3.push({x:today.getTime(), y: datax.PAXG.USD})
        dps4.push({x:today.getTime(), y: datax.BCH.USD})
        dps5.push({x:today.getTime(), y: datax.BNB.USD})

})

 }


function drawGraph () {

  let chart = new CanvasJS.Chart("chartContainer",{
    title :{
      text: ""
    },		
    	
    data: [
      {  type: "line",
            xValueType: "dateTime",
            yValueFormatString: "$####.00",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: true,
            name: "MKR",
            dataPoints: dps1 
          },
          {  type: "line",
          xValueType: "dateTime",
          yValueFormatString: "$####.00",
          xValueFormatString: "hh:mm:ss TT",
          showInLegend: true,
          name: "ETH",
          dataPoints: dps2 
        },
        {  type: "line",
        xValueType: "dateTime",
        yValueFormatString: "$####.00",
        xValueFormatString: "hh:mm:ss TT",
        showInLegend: true,
        name: "PAXG",
        dataPoints: dps3 
      },
      {  type: "line",
      xValueType: "dateTime",
      yValueFormatString: "$####.00",
      xValueFormatString: "hh:mm:ss TT",
      showInLegend: true,
      name: "BCH",
      dataPoints: dps4 
    },
      { type: "line",
      xValueType: "dateTime",
      yValueFormatString: "$####.00",
      xValueFormatString: "hh:mm:ss TT",
      showInLegend: true,
      name: "BNB",
       dataPoints: dps5 }
  ]
  });
chart.render()
}
 