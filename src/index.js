import "./styles.css";
import "./searchbar.js";
import "boxicons";

const virtCrossingApiURL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const virtApiKey = "?key=GE65KAXB7DSPKN8W54WJ85E9Q";
const apiAdditions = "&include=current&unitGroup=metric";

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export const getWeather = async (country) => {
  try {
    const response = await fetch(
      virtCrossingApiURL + country + virtApiKey + apiAdditions,
      {
        mode: "cors",
      }
    );

    if (response.ok) {
      const responseJSON = await response.json();
      //console.log("OK: " + response.status);
      return await responseJSON;
    } else {
      //console.log("Status: " + response.status);
      if (response.status === 400) {
        throw new Error(
          "Couldnt find anything, make sure you type in correct Location."
        );
      } else {
        throw new Error(response.status);
      }
    }
  } catch (error) {
    //console.log("error: " + error);
    return error;
  }
};

export function updateInfo(weather) {
  const sunset = weather.currentConditions.sunset;
  const sunrise = weather.currentConditions.sunrise;
  const datetime = weather.currentConditions.datetime;

  const location = document.querySelector(".location");
  const temp = document.querySelector(".temp");
  const cond = document.querySelector(".cond");

  const icon = document.querySelector(".weatherIcon .icon");
  icon.dataset.id = weather.currentConditions.icon;
  icon.innerHTML = "";

  const dayNight = document.querySelector(".dayNight");
  dayNight.innerHTML = "";

  location.textContent = `${weather.resolvedAddress}, ${datetime}`;
  cond.textContent = weather.currentConditions.conditions;
  temp.textContent = weather.currentConditions.temp;
  temp.innerHTML += "&degC";
  document.body.classList = "";

  if (datetime > sunrise && datetime < sunset) {
    console.log("Day");
    document.body.classList.add("day");
    dayNight.innerHTML = "<i class='bx bxs-sun' ></i>";
    dayNight.classList.add("sun");
    dayNight.classList.remove("moon");
  } else {
    console.log("Night");
    document.body.classList.add("night");
    dayNight.innerHTML = "<i class='bx bxs-moon' ></i>";
    dayNight.classList.add("moon");
    dayNight.classList.remove("sun");
  }

  switch (weather.currentConditions.icon) {
    case "snow":
      icon.innerHTML = "<i class='bx bx-cloud-snow' ></i>";
      break;
    case "rain":
      icon.innerHTML = "<i class='bx bx-cloud-rain' ></i>";
      break;
    case "fog":
      icon.innerHTML = "<i class='bx bxs-cloud' ></i>";
      break;
    case "wind":
      icon.innerHTML = "<i class='bx bx-wind' ></i>";
      break;
    case "cloudy":
      icon.innerHTML = "<i class='bx bx-cloud' ></i>";
      break;
    case "partly-cloudy-day":
      icon.innerHTML = "<i class='bx bx-cloud' ></i>";
      break;
    case "partly-cloudy-night":
      icon.innerHTML = "<i class='bx bx-cloud' ></i>";
      break;
    case "clear-day":
      icon.innerHTML = "<i class='bx bx-sun' ></i>";
      break;
    case "clear-night":
      icon.innerHTML = "<i class='bx bxs-moon' ></i>";
      break;
  }
}

export function loader(open = true) {
  const loader = document.querySelector("loader");
  if (open) {
    loader.classList.add("open");
  } else {
    loader.classList.remove("open");
  }
}

export function infoAnim(open = true) {
  const loader = document.querySelector("loader");
  const info = document.querySelector("#info");
  const error = document.querySelector(".error");
  if (open) {
    info.classList.remove("scaleDown");
    loader.classList.remove("open");
  } else {
    info.classList.add("scaleDown");
    loader.classList.add("open");
  }
}

//test();
//loader(true);
