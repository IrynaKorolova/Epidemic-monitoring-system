let lang = "en";
let type = "world";
let DATA = {}; //DATA = {ukraine: [{}...], world: [{}...]}
let dashboardData = [];
const dashboardEl = document.getElementById("dashboard");
const dashboardBodyEl = document.getElementById("dashboardBody");
const searchFormEl = document.getElementById("searchForm");
const switcherEl = document.getElementById("switcher");
const totalsEl = document.getElementById("totals");
const totalCounters = {
  ukraine: {
    confirmed: 0,
    delta_confirmed: 0,
    deaths: 0,
    delta_deaths: 0,
    recovered: 0,
    delta_recovered: 0,
    existing: 0,
    delta_existing: 0,
  },
  world: {
    confirmed: 0,
    delta_confirmed: 0,
    deaths: 0,
    delta_deaths: 0,
    recovered: 0,
    delta_recovered: 0,
    existing: 0,
    delta_existing: 0,
  },
};

//numbers formatting
const formatter = new Intl.NumberFormat("uk", {
  useGrouping: "true",
});

//"точка входа приложения", получение данных с сервера"
getData();

//tabs switcher
switcherEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".switcher__tab");
  if (btn) {
    const isActive = btn.classList.contains("switcher__tab_active");
    if (!isActive) {
      const key = btn.dataset.key;
      type = key;
      dashboardData = DATA[type];
      render(createDashboardRows(dashboardData), dashboardBodyEl);
      renderTotals();
      const btns = Array.from(switcherEl.children);
      btns.forEach((btn) => btn.classList.toggle("switcher__tab_active"));
    }
  }
});

function createDashboardRows(dataArray) {
  //console.log(dataArray.map((data) => createDashboardRow(data)).join(''));
  return dataArray.map((data) => createDashboardRow(data)).join("");
}

function createDashboardRow(data) {
  return `
    <div class="dashboard__item row">
        <div class="col country">${data.label[lang]}</div>
        <div class="col confirmed">
        <span>${formatter.format(data.confirmed)}</span>
        <span>${formatDeltaValue(data.delta_confirmed)}</span>
        </div>
        <div class="col deaths">
        <span>${formatter.format(data.deaths)}</span>
        <span>${formatDeltaValue(data.delta_deaths)}</span>
        </div>
        <div class="col recovered">
        <span>${formatter.format(data.recovered)}</span>
        <span>${formatDeltaValue(data.delta_recovered)}</span>
        </div>
        <div class="col existing">
        <span>${formatter.format(data.existing)}</span>
        <span>${formatDeltaValue(data.delta_existing)}</span>
        </div>
    </div>
    `;
}

function formatDeltaValue(delta = 0) {
  if (delta > 0) {
    return `&#9650; ${formatter.format(delta)}`;
  } else if (delta < 0) {
    return `&#9660; ${formatter.format(delta)}`;
  } else {
    return "-";
  }
} // return "up"number || "down"-number || "-"

function render(htmlStr, htmlEl, insertTo) {
  if (insertTo) {
    htmlEl.insertAdjacentHTML(insertTo, htmlStr);
  } else {
    htmlEl.innerHTML = htmlStr;
  }
}

async function getData() {
  //получить дату в JSON виде ('yyyy-mm-dd')
  const now = new Date().toJSON().split("T")[0];
  //блок обработки ошибок запроса на получение данных
  try {
    const res = await fetch(`https://api-covid19.rnbo.gov.ua/data?to=${now}`);
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }
    const data = await res.json(); //data = {ukraine: [{}...], world: [{}...]}
    // console.log('DATA (Object)', data);
    DATA = data;
    dashboardData = DATA[type];
    summarize(DATA);
    // console.log('dashboardData (Array)', dashboardData);
    render(createDashboardRows(dashboardData), dashboardBodyEl);
  } catch (error) {
    alert(error);
    console.warn(error);
  }
}

//Search by user input
searchFormEl.addEventListener("input", (e) => {
  const searchRegion = e.target.value.trim().toLowerCase();
  const filteredRegion = dashboardData.filter((region) => {
    return region.label[lang].toLowerCase().includes(searchRegion);
  });
  render(createDashboardRows(filteredRegion), dashboardBodyEl);
});

function renderTabs() {
  switcherEl.innerHTML = `
    <button class="switcher__tab" data-key="ukraine">
    <span>Ukraine</span>
    <span class="total-confirmed">${formatter.format(
      totalCounters.ukraine.confirmed
    )}</span>
  </button>
  <button class="switcher__tab switcher__tab_active" data-key="world">
    <span>World</span>
    <span class="total-confirmed">${formatter.format(
      totalCounters.world.confirmed
    )}</span>
  </button>
  `;
}

//render total sum of diseased
function renderTotals() {
  totalsEl.innerHTML = `
  <div>
  <div>Confirmed:</div>
  <div class="total__item confirmed">
  <span>${formatter.format(
    totalCounters[type].confirmed
  )}</span>
  <span>${formatDeltaValue(totalCounters[type].delta_confirmed)}</span>
  </div>
  </div>
<div>
  <div>Deaths:</div>
  <div class="total__item deaths">
  <span>${formatter.format(totalCounters[type].deaths)}</span>
  <span>${formatDeltaValue(totalCounters[type].delta_deaths)}</span>
  </div>
  </div>
  <div>
  <div>Recovered:</div>
  <div class="total__item recovered">
  <span>${formatter.format(
    totalCounters[type].recovered
  )}</span>
  <span>${formatDeltaValue(totalCounters[type].delta_recovered)}</span>
  </div>
  </div>
  <div>
  <div>Existing:</div>
  <div class="total__item existing">
  <span>${formatter.format(
    totalCounters[type].existing
  )}</span>
  <span>${formatDeltaValue(totalCounters[type].delta_existing)}</span>
  </div>
  </div>
  `;
}

//counting total sum of diseased
function summarize(dataObj) {
  const types = ["world", "ukraine"];
  types.forEach((key) => {
    const total = dataObj[key].reduce(
      (acc, data, i) => {
        return {
          confirmed: acc.confirmed + data.confirmed,
          delta_confirmed: acc.delta_confirmed + data.delta_confirmed,
          deaths: acc.deaths + data.deaths,
          delta_deaths: acc.delta_deaths + data.delta_deaths,
          recovered: acc.recovered + data.recovered,
          delta_recovered: acc.delta_recovered + data.delta_recovered,
          existing: acc.existing + data.existing,
          delta_existing: acc.delta_existing + data.delta_existing,
        };
      },
      {
        confirmed: 0,
        delta_confirmed: 0,
        deaths: 0,
        delta_deaths: 0,
        recovered: 0,
        delta_recovered: 0,
        existing: 0,
        delta_existing: 0,
      }
    );
    totalCounters[key] = total;
  });
  renderTabs();
  renderTotals();
}
