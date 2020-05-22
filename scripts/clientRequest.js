let catchedForecastData = false;
let navOpen = false;

window.onscroll = () => {
	if (!navOpen) {
		let navCont = document.getElementById("navContainer");
		let windowViewTop = window.scrollY;
		if (windowViewTop <= 160) {
			navCont.style.backgroundColor = `rgba(255,255,255 , ${windowViewTop/160})`;
		}
		if (windowViewTop >= 160) {
			navCont.style.backgroundColor = `rgba(255,255,255, 1)`;
		}
	}
}

function openCloseNav() {
	let navItems = document.getElementById("navItems");
	let navTitle = document.getElementById("mainTitle");
	let dropDown = document.getElementById("dropDown");
	let navBar = dropDown.getElementsByTagName("div");
	let shader = document.getElementById("shader");

	if (navOpen){
		navTitle.className = "turn-black";
		navBar[1].className = "appear";
		navBar[0].className = "rotateBackNav45";
		navBar[2].className = "rotateBackNav-45";
		shader.classList.remove("appear");
		shader.classList.add("hidden")
		navItems.classList.add("fade-out-up");
		navItems.classList.remove("fade-in-down");
		navOpen = false;

		setTimeout(()=>{
			navBar[0].style.transform = "translate(0, 0) rotate(0deg)";
			navBar[2].style.transform = "translate(0, 0) rotate(0deg)";
			navBar[0].style.backgroundColor = "black";
			navBar[2].style.backgroundColor = "black";
			navBar[1].style.opacity = 1;
			shader.style.display = "none";
			shader.style.opacity = "0";
			navTitle.style.color = "black";
		}, 400);
		
		setTimeout(()=>{
			navItems.style.top = "-260px";
		}, 500);
	
	}else {
		navTitle.className = "turn-white";
		navBar[1].className = "hidden";
		navBar[0].className = "rotateNav45";
		navBar[2].className = "rotateNav-45";
		navItems.classList.add("fade-in-down");
		navItems.classList.remove("fade-out-up");
		navOpen = true;
		shader.style.opacity = "0";
		shader.style.display = "block";
		shader.classList.remove("hidden");
		shader.classList.add("appear");

		setTimeout(()=> {
			navBar[1].style.opacity = 0;
		},200)

		setTimeout(()=>{
			navBar[0].style.transform = "translate(0, 10px) rotate(45deg)";
			navBar[2].style.transform = "translate(0, -5px) rotate(-45deg)";
			navBar[0].style.backgroundColor = "white";
			navBar[2].style.backgroundColor = "white";
			shader.style.opacity = "1";
			navTitle.style.color = "white";
		}, 400);
		setTimeout(()=>{
			navItems.style.top = "0px";
		}, 500);
	}
}

function getJson (type) {
	return new Promise ((resolve, reject)=> {
		let requestQuery;
			place = document.getElementById("mainSearchBox").value;
			
		if (type == 0) 
			requestQuery = `request.php?city=${place}&type=0`;
		else 
			requestQuery = `request.php?city=${place}&type=1`;
		try {
			fetch(requestQuery, {
				method: 'get', 
			}).then((response) => {
				//if  the response status isn't ok, don't do anything
				if (response.status >= 200 && response.status < 300) {
					//return data in JSON form
					resolve(response.json());
				}else { 
					reject (response.statusText);
				}
			})
		}catch {
			//customAlert("something went wrong!!! Please make sure you enter your city name correctly or simply try again")
			reject("Something went wrong when the server send an request to the API, Try again later");
		}
	});
}

let temperatureCont = document.getElementById("temperature"),
	weatherCont = document.getElementById("weather"),
	locationCont = document.getElementById("location"),
	feelsLikeCont = document.getElementById("feels_like"),
	maxTempCont = document.getElementById("maxTemperature"),
	minTempCont = document.getElementById("minTemperature"),
	pressureCont = document.getElementById("pressure"),
	humidityCont = document.getElementById("humidity"),
	cloudinessCont = document.getElementById("cloudiness"),
	visibilityCont = document.getElementById("visibility")
	mainWeatherIcon = document.getElementById("weatherIcon"),
	footer = document.getElementsByTagName("footer")[0];

function triggerData () {
	getForecastData();
	getJson(0).then ((message) => {
		setupData(message);
		console.log(message)
	}).catch ((err)=>{
		console.log(err);
	})	
}

function setupData (data) {
	let city = data["name"],
		country = data["sys"]["country"],
		weather = data["weather"][0]["description"],
		temp = data["main"]["temp"] - 273.15,
		maxTemp = data["main"]["temp_max"] - 273.15,
		minTemp = data["main"]["temp_min"] - 273.15,
		id = data["weather"][0]["id"],
		humidity = data["main"]["humidity"], 
		pressure = data["main"]["pressure"],
		feelsLike = data["main"]["feels_like"] - 273.15,
		visibility = data["visibility"] / 1000,
		clouds = data["clouds"]["all"],
		unix = data["dt"], 
		iconUrl, dayOrNight, currHour;

	currHour = getHour(unix)
	dayOrNight = getDayType(currHour);
	iconName = getIconsName(id, dayOrNight);
	iconUrl = `icons/${iconName}.png`
	refreshPage();

	temp = temp.toFixed(1);
	maxTemp = maxTemp.toFixed(1);
	minTemp = minTemp.toFixed(1);
	feelsLike = feelsLike.toFixed(1);
	visibility = visibility.toFixed(2);

	temperatureCont.innerHTML = `${temp} &#8451;`;
	weatherCont.innerHTML = weather;
	mainWeatherIcon.src=iconUrl;
	locationCont.innerHTML = city + ", " + country;

	feelsLikeCont.innerHTML = `${feelsLike} &#8451;`;
	maxTempCont.innerHTML = `${maxTemp} &#8451;`;
	minTempCont.innerHTML = `${minTemp} &#8451;`;
	pressureCont.innerHTML = `${pressure} hpa`;
	humidityCont.innerHTML = `${humidity} %`;
	cloudinessCont.innerHTML = `${clouds} %`;
	visibilityCont.innerHTML = `${visibility} km`;
	footer.style.position = "relative";
}

let mainPage = document.getElementById("mainPage")
	weatherDetails = document.getElementById("weatherDisplay");

function refreshPage () {
	catchedForecastData =false;
	mainPage.classList.remove("fade-in-left");
	mainPage.classList.add("fade-out");
	setTimeout(()=>{
		mainPage.style.display = "none";
	},1000);
	weatherDetails.style.display = "block";
	weatherDetails.classList.add("fade-in-left");
}

function getIconsName (id, DON) {
	let icon;
	if (id <300 && id>=200) {
		icon = "thunderstorm_" + DON;
	}else if (id>=300 && id<400) {
		icon = "drizzle";
	}else if (id>=500 && id<600) {
		icon = "rain_" + DON;
	}else if (id>=600 && id <700) {
		icon = "snow";
	}else if (id >700 && id<800) {
		icon = "atmosphere";
	}else if (id == 800) {
		icon = "clear_" + DON;
	}else if (id==801) {
		icon = "broken_clouds_"+DON;
	}else if (id>801) {
		icon = "cloud_scattered";
	}
	return icon;
}

function openPage () {
	openCloseNav();
}