let lang = 'en';
let type = 'ukraine'
let DATA = {}
let dashboardData = []
const dashboardEl = document.getElementById('dashboard');

//"точка входа приложения", получение данных с сервера"
getData();


function createDashboardRow(data) {
  
  return `
    <div class="dashboard__item row">
        <div class="col">${data.label[lang]}</div>
        <div class="col">
        <span>${data.confirmed}</span>
        <span>${delta_confirmed}</span>
        </div>
        <div class="col">
        <span>${data.deaths}</span>
        <span>${delta_deaths}</span>
        </div>
        <div class="col">
        <span>${data.recovered}</span>
        <span>${delta_recovered}</span>
        </div>
        <div class="col">
        <span>${data.existing}</span>
        <span>${delta_existing}</span>
        </div>
    </div>
    `;
}


function render(htmlStr, htmlEl, insertTo) {
  if (insertTo) {
    htmlEl.insertAdjacentHTML(insertTo, htmlStr);
  } else {
    htmlEl.innerHTML = htmlStr;
  }
}


async function getData() {
  //получить дату в JSON виде (yyyy-mm-dd)
  const now = new Date().toJSON().split('T')[0];
  //блок обработки ошибок запроса на получение данных
  try {
    const res = await fetch(`https://api-covid19.rnbo.gov.ua/data?to=${now}`);
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }
    const data = await res.json();
    console.log('DATA', data);
    DATA = data
    dashboardData = DATA[type]
    //render!!!dashboardData
  } catch (error) {
    alert(error);
  }
}

// confirmed: 45971267
// country: "US"
// deaths: 745837
// delta_confirmed: 4899
// delta_deaths: 41
// delta_existing: 4858
// delta_recovered: 0
// delta_suspicion: 0
// id: 32976
// label: {en: 'USA', uk: 'США'}
// lat: 39.05488
// lng: -96.570178
// recovered: 0
// suspicion: 0
// existing: 45225430
