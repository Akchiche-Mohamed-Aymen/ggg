let countryInput = document.getElementById("countryInput"),
    cityInput = document.getElementById("cityInput"),
    country = document.getElementById("country"),
    city = document.getElementById("city"),
    times = document.querySelectorAll("#t");
let createOption = (value)=>{
        let option = document.createElement("option");
        option.value = value;
        return option;
    }
function changeCity(val = ''){
    if(countryInput.value === ''){
        cityInput.value = '';
        city.innerHTML = '';
    }
    else{

        fetch("https://countriesnow.space/api/v0.1/countries")
        .then(response => response.json())
        .then(data =>{
            let countries = data.data;
            cityInput.value = val;
            if(val !== "")
                getPrayerTimes()
            city.innerHTML = '';
            for(item of countries){
                if(item.country === countryInput.value){
                    for(state of item.cities){
                        city.appendChild(createOption(state))
                    }
                }
            }
        })
        .catch(err => alert("Error :"+ err))
    }
}
countryInput.onchange = ()=>{
    changeCity()
}
cityInput.onchange = ()=>{
    if(cityInput.value.length > 0)
        getPrayerTimes()
}

function changeCountry(){
    fetch("https://countriesnow.space/api/v0.1/countries")
.then(response => response.json())
.then(data => {
    let countries = data.data;
    console.log(data)
    for(item of countries)
        country.appendChild(createOption(item.country))
})
.catch(err => alert("error in changing country"));
}
changeCountry()

document.querySelector("button").onclick = ()=>{
    GetCurrentAddress();
}
function GetCurrentAddress(){
    navigator.geolocation.getCurrentPosition(pos=>{
        const {latitude,longitude} = pos.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        fetch(url)
        .then(res=>res.json())
        .then(data=>{
            countryInput.value = data.address.country;
            changeCity(data.address.city)
        })
        .catch(err => alert("Error "))
    })}
function getPrayerTimes(){
    let date = new Date();
    fetch(`http://api.aladhan.com/v1/calendarByCity/${date.getFullYear()}/${date.getMonth()+1}?city=${cityInput.value}&country=${cityInput.value}&method=2`)
    .then(response => response.json())
    .then(response => {
        times[0].innerHTML =  response.data[0].timings.Fajr.slice(0,6);
        times[1].innerHTML =  response.data[0].timings.Sunrise.slice(0,6);
        times[2].innerHTML =  response.data[0].timings.Dhuhr.slice(0,6);
        times[3].innerHTML =  response.data[0].timings.Asr.slice(0,6);
        times[4].innerHTML =  response.data[0].timings.Maghrib.slice(0,6);
        times[5].innerHTML =  response.data[0].timings.Isha.slice(0,6);
    })
    .catch(err => alert("sorry !! error in times "+err))
}
