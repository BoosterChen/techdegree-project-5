// all employee
let employeeArray = [];
// current display employee array
let currentEmployeeArray = [];
const stateShort = {
    "alabama":"AL", "alaska":"AK", "arizona":"AZ", "arkansas":"AR", "california":"CA", "colorado":"CO", "connecticut":"CT", "delaware":"DE", "florida":"FL", "georgia":"GA", "hawaii":"HI",
    "idaho":"IA", "illinois":"IL", "indiana":"IN", "iowa":"IA", "kansas":"KS", "kentucky":"KY", "louisiana":"LA", "maine":"ME", "maryland":"MD", "massachusetts":"MA", "michigan":"MI", "minnesota":"MN", "mississippi":"MS",
    "missouri":"MO", "montana":"MT", "nebraska":"NE", "nevada":"NV", "new hampshire":"NH", "new jersey":"NJ", "new mexico":"NM", "new york":"NY", "north carolina":"NC", "north dakota":"ND", "ohio":"OH", "oklahoma":"OK",
    "oregon":"OR", "pennsylvania":"PA", "rhode island":"RI", "south carolina":"SC", "south dakota":"SD", "tennessee":"TN", "texas":"TX", "utah":"UT", "vermont":"VT", "virginia":"VA", "washington":"WA", "west virginia":"WV", "wisconsin":"WI", "wyoming":"WY"
};

// reuseable fetch function
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log("something is wrong", error));
}

function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

// update the employee grid when current employee data is change
function updateDirectory(employeeData){
    const profileGrid = document.querySelector(".profile-grid");
    // update current employy data
    currentEmployeeArray = employeeData;

    // build the profile grid html and put it in to the container
    const profileListHtml = employeeData.reduce((html, employee, index) => {
        html += `<div class="profile" data-index="${index}">
                    <img class="pic" src="${employee.picture.large}" data-index="${index}">
                    <div class="info">
                        <div class="name">${employee.name.first} ${employee.name.last}</div>
                        <div class="email">${employee.email}</div>
                        <div class="city">${employee.location.city}</div>
                    </div>
                </div>`;
        return html;
    }, "");
    profileGrid.innerHTML = profileListHtml;
    // add click event which trigger the showing of profile detail
    document.querySelectorAll(".profile-grid .profile").forEach(ele => ele.addEventListener("click", showProfileDetail));
}

// show modal window which contain the profile detail
function showProfileDetail(e) {
    if(isNaN(e.currentTarget.getAttribute("data-index"))) return;

    // update detail content and show the modal window
    updateProfileDetail(e.currentTarget.getAttribute("data-index"));
    openProfileDetail();
}

// update detail content by index of current display employee array
function updateProfileDetail(index){
    const selectEmployee = currentEmployeeArray[index];
    const birthDayRaw = new Date(selectEmployee.dob.date);
    const birthDate = birthDayRaw.getDate().toString().length === 1? "0"+birthDayRaw.getDate() : birthDayRaw.getDate();
    const birthMonth = (birthDayRaw.getMonth() + 1).toString().length === 1? "0" + (birthDayRaw.getMonth() + 1) : birthDayRaw.getMonth() + 1;
    const birthDayStr = `${birthMonth}/${birthDate}/${birthDayRaw.getFullYear()}`;

    // build profile detail html and put it into the container
    const profileHtml =    `<img src="${selectEmployee.picture.large}">
                            <div class="info">
                                <div class="name">${selectEmployee.name.first} ${selectEmployee.name.last}</div>
                                <div class="email">${selectEmployee.email}</div>
                                <div class="city">${selectEmployee.location.city}</div>
                                <div class="seperate-line"></div>
                                <div class="more">${selectEmployee.phone}</div>
                                <div class="more">${selectEmployee.location.street}, ${stateShort[selectEmployee.location.state]} ${selectEmployee.location.postcode}</div>
                                <div class="more">Birthday:${birthDayStr}</div>
                            </div>`;
    document.querySelector(".profile-detail").setAttribute("data-index", index);   //update current index here
    document.querySelector(".profile-detail").innerHTML = profileHtml;
}

// show the modal window
function openProfileDetail(){
    const shadow =  document.querySelector(".shadow-background");

    //fix the body so user can't scroll while the modal window is showing
    document.body.style.overflow = "hidden";
    shadow.style.position = "fixed";
    shadow.hidden = false;
}

// hide the modal window
function closeProfileDetail() {
    const shadow =  document.querySelector(".shadow-background");

    document.body.style.overflow = "";
    shadow.style.position = "";
    shadow.hidden = true;
}

// switch between each detail
function switchProfileDetail(e) {
    const shadow =  document.querySelector(".shadow-background");
    let index =  document.querySelector(".profile-detail").getAttribute("data-index");

    // count the next index according to the pressed key and current employee array
    if(shadow.hidden === false && index != null && !isNaN(parseInt(index))){
        if(e.key == "ArrowRight"){
            updateProfileDetail(parseInt(index) === currentEmployeeArray.length - 1 ? 0 : parseInt(index) + 1);
        } else if (e.key == "ArrowLeft"){
            updateProfileDetail(parseInt(index) === 0 ? currentEmployeeArray.length - 1 : parseInt(index) - 1);
        }
    }
}

// profile filter
function profileFilter(){
    const searchWord = document.getElementById("searchKeyWord").value.trim();
    const noResult = document.querySelector(".no-result");

    // if the input is empty string, then reset the page.
    // or filter the array and update the profile grid
    if(searchWord === ""){
        noResult.hidden = true;
        updateDirectory(employeeArray);
    } else {
        let searchResult = employeeArray.filter(ele => ele.name.first.indexOf(searchWord) >= 0 || ele.name.last.indexOf(searchWord) >= 0);

        noResult.hidden = searchResult.length !== 0;
        updateDirectory(searchResult);
    }
}

// fetch employee data from api and update the profile grid
function fetchEmployee(num = 12, nat = "US"){
    fetchData(`https://randomuser.me/api/?nat=${nat}&results=${num}&format=json`)
        .then(data => {
            employeeArray = data.results;
            updateDirectory(data.results);
        });
}

// init the page, fetch employee data and set up basic event listener
function initPage(){
    const searchInput = document.getElementById("searchKeyWord");
    const searchButton = document.getElementById("searchBt");
    const closeButton = document.querySelector(".close");

    fetchEmployee(12, "US");
    document.addEventListener("keyup", switchProfileDetail);
    searchInput.addEventListener("keyup", profileFilter);
    searchButton.addEventListener("click", profileFilter);
    closeButton.addEventListener("click", closeProfileDetail);
}

document.addEventListener("DOMContentLoaded", initPage);


