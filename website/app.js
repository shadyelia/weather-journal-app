/* Global Variables */
// Personal API Key for OpenWeatherMap API
const apiKey = "<your_api_key>&units=imperial";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

const generateData = () => {
  const zipCode = document.getElementById("zip").value.trim();
  if (zipCode !== "") {
    getWeather(+zipCode);
  }
};

const generateButton = document.getElementById("generate");
generateButton.addEventListener("click", generateData);

const getWeather = (zipCode) => {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?zip=" +
      zipCode +
      "&appid=" +
      apiKey
  )
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(async function (data) {
      await setData(data);
    })
    .catch(function () {
      // catch any errors
    });
};

const setData = async (resp) => {
  const temp = resp.main.temp;
  const entry = {
    date: newDate,
    temp: temp,
    feel: document.getElementById("feelings").value.trim()
  };
  postData("http://localhost:8080/add", { entry: entry }).then(
    await retrieveData()
  );
};

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

const retrieveData = async () => {
  const request = await fetch("http://localhost:8080/all");
  try {
    // Transform into JSON
    const allData = await request.json();
    if (allData && allData.length > 0) {
      console.log(allData);
      // Write updated data to DOM elements
      const data = allData[allData.length-1]
      document.getElementById("temp").innerHTML =
        Math.round(data.temp) + " degrees";
      document.getElementById("content").innerHTML = data.feel;
      document.getElementById("date").innerHTML = data.date;
    }
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
};
