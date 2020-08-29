'use strict'
let navOpen = false,
	pageOpen = false,
	navDisabled = false,
	pageDisabled = false,
	isSearchMain = false;

//used for mobile design.
//when user scrolled down from a specific range, 
//change the color of the navigation menu
window.onscroll = () => {
	if (window.innerWidth < 800) adjustNavCont();
}

//used as the funcion to be invoked when enter is pressed in
//main search and secondary search field.
function isEnterSecondary (event) {
	if (event.key === "Enter") {
		getNewData();
		insertValue ("");
	}else {
		//if the key entered is not enter, it might be a text character
		//so start to the autocomplete item list
		//specify that it's not triggered by the main search box
		isSearchMain = false; 
		checkCityList();
	}
}

function isEnterMain (event) {
	if (event.key === "Enter") {
		triggerData();
		insertValue ("");
	}else {
		isSearchMain = true;
		checkCityList();
	}
}

//showing and closing the about page for the app
function openClosePage () {
	//to close the search list
	insertValue("");
	const page = document.getElementById("aboutPage");
	if (!pageDisabled) {
		if (pageOpen) {
			pageOpen = false;
			page.classList.remove("fade-in-left-03");
			page.classList.add("fade-out-03");
			
			//locking the page so that the page animation could be finished first before user could interact
			//with the about page close button
			lockPage(300);
			setTimeout(() => {
				page.style.display = "none";
			}, 300);
		}else {
			if (navOpen) openCloseNav();
			pageOpen = true;
			lockPage(300);
			page.style.display = "block";
			page.classList.remove("fade-out-03");
			page.classList.add("fade-in-left-03");
		}
	}
}

//used to lock the navigation bar so that the animation won't be chuncky 
//in case user clicked the trigger for opening and closing of nav bar too fast.
function lockNav (time) {
	navDisabled = true;
	setTimeout(() => {
		navDisabled = false;
	}, time);
}

function lockPage (time) {
	pageDisabled = true;
	setTimeout(() => {
		pageDisabled = false;
	}, time);
}

//incease the value of the opacity of the white background of nav bar
//as user scroll down the app
function adjustNavCont () {
	if (!navOpen) {
		let navCont = document.getElementById("navBg");
		let navShadow = document.getElementById("navContainer");
		let windowViewTop = window.scrollY;
		if (windowViewTop <= 160) {
			navCont.style.backgroundColor = `rgba(255,255,255 , ${windowViewTop/160})`;
			navShadow.style.boxShadow = `0px 1px 10px rgba(128, 128, 128 , ${windowViewTop/80})`;
		}
		if (windowViewTop >= 160) {
			navCont.style.backgroundColor = `rgba(255,255,255, 1)`;
			navShadow.style.boxShadow = `0px 1px 10px rgba(128, 128, 128 , 1)`;
		}
	}
}

let navItems = document.getElementById("navItems"),
	navTitle = document.getElementById("mainTitle").getElementsByTagName("a")[0],
	dropDown = document.getElementById("dropDown"),
	navBar = dropDown.getElementsByTagName("div"),
	shader = document.getElementById("shader"),
	navShadow = document.getElementById("navContainer");

//handling and animating nav opening and closing
function openCloseNav() {
	//to close search list
	isSearchMain = false;
	insertValue("");

	if (!navDisabled) {
		if (navOpen){
			closeNav();
		}else {
			openNav();
		}
	}
}

//close navigation menu
function closeNav () {
	adjustNavCont();
	navTitle.className = "turn-black";
	navBar[1].className = "appear";
	navBar[0].className = "rotateBackNav45";
	navBar[2].className = "rotateBackNav-45";
	shader.classList.remove("appear");
	shader.classList.add("hidden")
	navItems.classList.add("fade-out-up");
	navItems.classList.remove("fade-in-down");
	navOpen = false;

	let windowViewTop = window.scrollY;
	navShadow.style.boxShadow = `0px 1px 10px rgba(128, 128, 128 , ${windowViewTop/80})`;

	lockNav(400);

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
}

//open navigation menu
function openNav () {
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

	lockNav(400);

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
		navShadow.style.boxShadow = `0px 1px 10px rgba(128, 128, 128 , 1)`;
	}, 400);
	setTimeout(()=>{
		navItems.style.top = "0px";
	}, 500);
}

//handling error pop up
let errorShown = false, invalidCity = false;
function openCloseError (message) {
    
    let container = document.getElementById("errorPopUp");
    let msgCont = document.getElementById("message");
    let shader = document.getElementById("shader2");

    if (!errorShown) {
        openError(message);
    }else {
        closeError(message);
    }
}

//open the error window
function openError (message) {
	errorShown = true;
	msgCont.innerHTML = message;

	container.style.opacity = "0";
	container.style.display = "block";
	container.classList.remove("hidden");
	container.classList.add("appear");

	shader.style.opacity = "0";
	shader.style.display = "block";
	shader.classList.remove("hidden");
	shader.classList.add("appear");

	setTimeout(() => {
		shader.style.opacity = "1";
		container.style.opacity = "1";
	}, 400);
}

//close the error window
function closeError (message) {
	errorShown = false;     
	container.classList.remove("appear");
	container.classList.add("hidden");

	shader.classList.remove("appear");
	shader.classList.add("hidden");
	
	setTimeout(()=>{
		shader.style.display = "none";
		shader.style.opacity = "0";
		container.style.display = "none";
		container.style.opacity = "0";
	}, 400);
}