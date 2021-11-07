let lang = "en";
let type = "world";
let DATA = {}; //DATA = {ukraine: [{}...], world: [{}...]}
let dashboardData = [];
const dashboardEl = document.getElementById("dashboard");
const dashboardBodyEl = document.getElementById("dashboardBody");
const searchFormEl = document.getElementById("searchForm");

//"точка входа приложения", получение данных с сервера"
getData();

function createDashboardRows(dataArray) {
  //console.log(dataArray.map((data) => createDashboardRow(data)).join(''));
  return dataArray.map((data) => createDashboardRow(data)).join("");
}

function createDashboardRow(data) {
  return `
    <div class="dashboard__item row">
        <div class="col country">${data.label[lang]}</div>
        <div class="col confirmed">
        <span>${data.confirmed}</span>
        <span>${formatDeltaValue(data.delta_confirmed)}</span>
        </div>
        <div class="col deaths">
        <span>${data.deaths}</span>
        <span>${formatDeltaValue(data.delta_deaths)}</span>
        </div>
        <div class="col recovered">
        <span>${data.recovered}</span>
        <span>${formatDeltaValue(data.delta_recovered)}</span>
        </div>
        <div class="col existing">
        <span>${data.existing}</span>
        <span>${formatDeltaValue(data.delta_existing)}</span>
        </div>
    </div>
    `;
}
function formatDeltaValue(delta) {
  if (delta > 0) {
    return `&#9650; ${delta}`;
  } else if (delta < 0) {
    return `&#9660; ${delta}`;
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
    // console.log('dashboardData (Array)', dashboardData);
    render(createDashboardRows(dashboardData), dashboardBodyEl);
  } catch (error) {
    alert(error);
    console.warn(error);
  }
}

//Search by user input
searchFormEl.addEventListener("input", (e) => {
  e.preventDefault();
  const searchRegion = e.target.value.trim().toLowerCase();
  const filteredRegion = dashboardData.filter((region) => {
    return region.label[lang].toLowerCase().includes(searchRegion);
  });
  render(createDashboardRows(filteredRegion), dashboardBodyEl);
});
