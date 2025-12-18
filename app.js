const BASE_URL = "https://open.er-api.com/v6/latest";


const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }

    const from = fromCurr.value;
    const to = toCurr.value;

    const URL = `${BASE_URL}/${from}`;
    console.log("Fetching:", URL);

    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Network response failed");
    }

    let data = await response.json();
    let rate = data.rates[to];

    if (!rate) {
      msg.innerText = "Exchange rate not available";
      return;
    }

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Failed to fetch exchange rate";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

const swapIcon = document.querySelector(".dropdown i");

swapIcon.addEventListener("click", () => {
  // swap currency values
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // update flags
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // animation
  swapIcon.classList.add("rotate");
  setTimeout(() => swapIcon.classList.remove("rotate"), 300);

  updateExchangeRate();
});

const themeBtn = document.querySelector(".theme-toggle");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

