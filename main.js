const timeel = document.getElementById("time");
const dateel = document.getElementById("date");
const loc = document.getElementById("location");
const tempe = document.getElementById("temp-value");
const climate = document.getElementById("climate");
const search = document.getElementById("search");
const icon = document.getElementById("temp-icon");
const Humi = document.getElementById("humi");
const pre = document.getElementById("pre");
const wind = document.getElementById("wind");
const rise = document.getElementById("rise");
const set = document.getElementById("set");
const form = document.querySelector("form");
const button = document.getElementById("search-button");
const preacution = document.getElementById("caution");
var load=document.getElementById('load');
const future=document.getElementById('future');

//for loading animation
function myload(){
  load.style.display='none';
}

//for blank text
function validt(){
  if(search.value==''){
    alert('Please Enter City Name');
  }
}

const APIKEY = `12119b971e02c90bbd9bb525247376ee`;
//api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={API key}

//for time ,day & date
setInterval(() => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const time = new Date();
  const hours = time.getHours();
  const min = time.getMinutes();
  const day = time.getDay();
  const date = time.getDate();
  const mon = time.getMonth();
  const y = time.getFullYear();
  const am = hours >= 12 ? 'PM' : 'AM';
  const hour = hours > 12 ? (hours % 12) : hours;
  const h = hour < 10 ? ('0' + hour) : hour;
  const m = min < 10 ? ('0' + min) : min;
  timeel.innerHTML = h + ':' + m + ' '+ am;
  dateel.innerHTML = days[day] + ',' + ' ' + date + ' ' + months[mon] + ' ' + y;
}, 1000);

//for getting user location
window.addEventListener('load', async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const long = position.coords.longitude;
      const lat = position.coords.latitude;
      console.log(position);
      //for fetching the api for current location
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=12119b971e02c90bbd9bb525247376ee&units=metric`
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      //Displaying data into web
      const { name } = data;
      const { temp, humidity, pressure } = data.main;
      let { id, description } = data.weather[0];
      const { speed } = data.wind;
      const { sunrise, sunset } = data.sys;
      loc.textContent = name;
      futureweather(name);
      tempe.textContent = Math.round(temp);
      climate.textContent = description;
      Humi.innerHTML = humidity + "%";
      pre.innerHTML = pressure + "hPa";
      wind.innerHTML = speed + "m/s";
      rise.innerHTML = window.moment(sunrise * 1000).format('HH:mm a');
      set.innerHTML = window.moment(sunset * 1000).format('HH:mm a');
      if (id < 300 && id >= 200) {
        icon.src = "img/thunderstormf.png";
        document.body.style.backgroundImage="url('img/thunderstorming.png')";
        caution.innerHTML = ` 
      <p>1. Get inside as quickly as possiblep</p>
      <p>2. Avoid bodies of water.</p>
      <p>3. Tents and pavilions are not good options.</p>`
      } else if (id < 500 && id >= 300) {
        icon.src = "img/drizzlef.png";
        document.body.style.backgroundImage="url('img/drizzle.png')";
        caution.innerHTML = `
      <p>1.Be a mindful driver</p>
      <p>2.Do not brake or turn the wheels during a hydroplane</p>
      <p>3. Drink boiled or filtered water</p>`
      } else if (id < 600 && id >= 500) {
        icon.src = " img/rainf.png";
        document.body.style.backgroundImage="url('img/raining.png')";
        caution.innerHTML = `
      <p>1. Do not stand near billboards, trees, electricity poles and transfromers.</p>
      <p>2. Don't touch electrical appliances when you are barefoot or wet hands.</p>
      <p>3. Keep away from trees, poles & broken wires.</p>
      <p>4 Carry an umbrella or plastic coat to protect from getting wet.</p>
      <p>5 Drink boiled water</p  >`
      } else if (id <= 700 && id >= 600) {
        icon.src = " img/snowfallf.png";
        document.body.style.backgroundImage="url('img/snowfall.png')";
        caution.innerHTML = `
           <p>1 Keeping your hands warm and dry is important because fingers are very sensitive to the cold.</p>
                      <p>2 Dress properly for the weather, including a hat, scarf, coat, gloves, socks and water-resistant shoes or boots.</p>
                      <p>3 Extra food and water. High-energy food, such as dried fruit or candy, and food requiring no cooking or refrigeration are best.</p>
                      `
      } else if (id < 800 && id > 700) {
        icon.src = " img/hazef.png";
        document.body.style.backgroundImage="url('img/haze.png')";
        caution.innerHTML = `
                      <p>1 Keep Your Headlights On—Always.</p>
                      <p>2 Maintain A Safe Speed.</p>
                      <p>3 Keep Your Windshield And Windows Clear.</p>`
      }else if (id <=802 && id>=800) {
        icon.src = " img/clear-skyf.png";
        document.body.style.backgroundImage="url('img/clearsky.png')";
        caution.innerHTML = `
                      <p>1 Use sunscreen.</p>
                      <p>2 Drink plenty of cool liquids, especially water, before you feel thirsty to decrease your risk of dehydration.</p>
                      <p>3Limit your time in the sun especially between 11:00 a.m. to 4:00 p.m.</p>`
      } else if (id > 802) {
        icon.src = " img/cloudyf.png";
        document.body.style.backgroundImage="url('img/clouds.png')";
        caution.innerHTML = `
                            <p>1 Equip yourself with an umbrella or a raincoat.</p>
                            <p>2 Shut down your windows  properly.</p>
                            <p>3 Eat and drink healthy.</p>`
      } 
   });
  }
});

//for avoiding reloading of webpage
form.addEventListener("submit", function(event) {
  getweather(search.value);
  futureweather(search.value);
  event.preventDefault();
});

button.addEventListener("click", function(event) {
  getweather(search.value);
  futureweather(search.value);
  event.preventDefault();
});

//function to get weather data for desired city
const getweather = async (city) => {

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  if (data.cod == "404") {
    window.alert("City Not Found");
  }
  const { name } = data;
  const { temp, humidity, pressure } = data.main;
  let { id, description } = data.weather[0];
  const { speed } = data.wind;
  const { sunrise, sunset } = data.sys;
  loc.textContent = name;
  tempe.textContent = Math.round(temp);
  climate.textContent = description;
  Humi.innerHTML = humidity + "%";
  pre.innerHTML = pressure + "hPa";
  wind.innerHTML = speed + "m/s";
  rise.innerHTML = window.moment(sunrise * 1000).format('HH:mm a');
  set.innerHTML = window.moment(sunset * 1000).format('HH:mm a');
  if (id < 300 && id >= 200) {
        icon.src = "img/thunderstormf.png";
        document.body.style.backgroundImage="url('img/thunderstorming.png')";
        caution.innerHTML = ` 
      <p>1. Get inside as quickly as possiblep</p>
      <p>2. Avoid bodies of water.</p>
      <p>3. Tents and pavilions are not good options.</p>`
      } else if (id < 500 && id >= 300) {
        icon.src = "img/drizzlef.png";
        document.body.style.backgroundImage="url('img/drizzle.png')";
        caution.innerHTML = `
      <p>1.Be a mindful driver</p>
      <p>2.Do not brake or turn the wheels during a hydroplane</p>
      <p>3. Drink boiled or filtered water</p>`
      } else if (id < 600 && id >= 500) {
        icon.src = " img/rainf.png";
        document.body.style.backgroundImage="url('img/raining.png')";
        document.body.backdropfilter='blur(0px)'
        caution.innerHTML = `
      <p>1. Do not stand near billboards, trees, electricity poles and transfromers.</p>
      <p>2. Don't touch electrical appliances when you are barefoot or wet hands.</p>
      <p>3. Keep away from trees, poles & broken wires.</p>
      <p>4 Carry an umbrella or plastic coat to protect from getting wet.</p>
      <p>5 Drink boiled water</p  >`
      } else if (id <= 700 && id >= 600) {
        icon.src = " img/snowfallf.png";
        document.body.style.backgroundImage="url('img/snowfall.png')";
        caution.innerHTML = `
           <p>1 Keeping your hands warm and dry is important because fingers are very sensitive to the cold.</p>
                      <p>2 Dress properly for the weather, including a hat, scarf, coat, gloves, socks and water-resistant shoes or boots.</p>
                      <p>3 Extra food and water. High-energy food, such as dried fruit or candy, and food requiring no cooking or refrigeration are best.</p>
                     `
      } else if (id < 800 && id > 700) {
        icon.src = "img/hazef.png";
        document.body.style.backgroundImage="url('img/haze.png')";
        caution.innerHTML = `
                      <p>1 Keep Your Headlights On—Always.</p>
                      <p>2 Maintain A Safe Speed.</p>
                      <p>3 Keep Your Windshield And Windows Clear.</p>`
      } else if (id > 801) {
        icon.src = " img/cloudyf.png";
        document.body.style.backgroundImage="url('img/clouds.png')";
        caution.innerHTML = `
                      <p>1 Equip yourself with an umbrella or a raincoat.</p>
                      <p>2 Shut down your windows  properly.</p>
                      <p>3 Eat and drink healthy.</p>`
      } else  {
        icon.src = " img/clear-skyf.png";
        document.body.style.backgroundImage="url('img/clearsky.png')";
        caution.innerHTML = `
                       <p>1 Use sunscreen.</p> 
                       <p>2 Drink plenty of cool liquids, especially water, before you feel thirsty to decrease your risk of dehydration. </p> 
                       <p>3 Limit your time in the sun especially between 11: 00 a.m.to 4: 00 p.m. </p>`
      }  
}

//for future forecasting 
const futureweather=async(city)=>{
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day= new Date().getDay();
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  future.innerHTML=
  ` <div class="a">
      <div class="day">${days[(day+1)%7]}</div>
      <div class="item">
      <img src="http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png" alt="icon" class="b">
         <div> <center>${data.list[0].weather[0].description}</center></div>
         <div class="t"><center>${Math.round(data.list[0].main.temp)} &#176C</center></div>
      </div>
    </div> 
    <div class = "a">
   <div class="day">${days[(day+2)%7]}</div>
   <div class = "item" >
   <img src="http://openweathermap.org/img/wn/${data.list[8].weather[0].icon}@2x.png" alt="icon" class="b">
         <div> <center>${data.list[8].weather[0].description}</center></div>
         <div class="t"><center>${Math.round(data.list[8].main.temp)} &#176C</center></div>
      </div>
    </div>
    <div class="a">
      <div class="day">${days[(day+3)%7]}</div>
       <div class="item">
         <img src="http://openweathermap.org/img/wn/${data.list[16].weather[0].icon}@2x.png" alt="icon" class="b">
         <div> <center>${data.list[16].weather[0].description}</center></div>
         <div class="t"><center>${Math.round(data.list[16].main.temp)} &#176C</center></div>
       </div>
    </div>
    <div class="a">
      <div class="day">${days[(day+4)%7]}</div>
       <div class="item">
         <img src="http://openweathermap.org/img/wn/${data.list[24].weather[0].icon}@2x.png" alt="icon" class="b">
         <div> <center>${data.list[24].weather[0].description}</center></div>
         <div class="t"><center>${Math.round(data.list[24].main.temp)} &#176C</center></div>
       </div>
    </div>
    <div class="a">
      <div class="day">${days[(day+5)%7]}</div>
       <div class="item">
         <img src="http://openweathermap.org/img/wn/${data.list[32].weather[0].icon}@2x.png" alt="icon" class="b">
         <div> <center>${data.list[32].weather[0].description}</center></div>
         <div class="t"><center>${Math.round(data.list[32].main.temp)} &#176C</center></div>
       </div>
    </div>
`
}