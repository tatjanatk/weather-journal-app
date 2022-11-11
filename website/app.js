/* Global Variables */
const baseURL = "https://api.openweathermap.org/data/2.5/weather?q="
const apiKey = "&appid=4498bf2d9522e36b8f93a405bd0b5712&units=metric";
const button = document.getElementById("generate");

const server = "http://localhost:8000"

const cityName = document.getElementById("cityName");
const date = document.getElementById("date");
const icon = document.getElementById("icon");
const temp = document.getElementById("temp");
const content = document.getElementById("content");
const feels = document.getElementById("feels");

// Create a new date instance dynamically with JS
let d = new Date();
let month = d.getMonth() + 1;
let newDate = d.getDate()+"."+month+"."+d.getFullYear();

//get data when click on button
button.addEventListener("click", performAction);

//function to get Data
function performAction(e) {
    const city = document.getElementById("city").value;
    const feelings = document.getElementById("feelings").value;
    getWeather(baseURL, city, apiKey)

    .then(function(data) {
        console.log(data);
        const info = {
            date: newDate, 
            city: data["name"],
            icon: data["weather"][0]["icon"], 
            temp: data["main"]["temp"], 
            content: data["weather"][0]["description"], 
            feelings: feelings
        }
        postData("/add", info);
        updateUI();
    })
};

// Get weather data from API
const getWeather = async (baseURL, city, apiKey) => {
    const res = await fetch(baseURL+city+apiKey)
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        alert("Error: "+ error);
    }
};

//new entry in projectData
const postData = async ( url = "", info = {}) => {
    console.log(info);
    const res = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
    });

    try {
        const newData = await res.json();
        console.log(newData);
        return newData;
    } catch(error) {
        alert("Error: "+ error);
        }
};

// Update UI
const updateUI = async () => {
    const req = await fetch("/all");

    try {
        const allData = await req.json();
        console.log(allData);
        let i = allData.length-1;

        date.innerHTML = allData[i].date;
        cityName.innerHTML = "<b>" + allData[i].city + "</b>";
        icon.src = "http://openweathermap.org/img/w/"+ allData[i].icon + ".png";
        temp.innerHTML = allData[i].temp + " C°";
        content.innerHTML =  allData[i].content;
        document.getElementById("divider").style.visibility = "visible";
        feels.innerHTML = "<b>Feelings:</b> " + allData[i].feelings;

    }catch(error){
        alert("Error: "+ error);
    }
}