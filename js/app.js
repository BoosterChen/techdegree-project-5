let employeeArray = [];
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

function updateDirectory(employeeData){
    if(employeeData.length === 0) return;
    const profileGrid = document.querySelector(".profile-grid");

    const profileListHtml = employeeData.reduce((html, employee, index) => {
        html += `<div class="profile" data-id="${index}">
                    <img class="pic" src="${employee.picture.large}" data-id="${index}">
                    <div class="info">
                        <div class="name">${employee.name.first} ${employee.name.last}</div>
                        <div class="email">${employee.email}</div>
                        <div class="city">${employee.location.city}</div>
                    </div>
                </div>`;
        return html;
    }, "");
    profileGrid.innerHTML = profileListHtml;
    document.querySelectorAll(".profile-grid .profile").forEach(ele => ele.addEventListener("click", showProfileDetail));
}

// show modal window of profile detail
function showProfileDetail(e) {
    if(isNaN(e.currentTarget.getAttribute("data-id"))) return;

    updateProfileDetail(e.currentTarget.getAttribute("data-id"));
    openProfileDetail();
}

function updateProfileDetail(id){
    const selectEmployee = employeeArray[id];
    const birthDayRaw = new Date(selectEmployee.dob.date);
    const birthDate = birthDayRaw.getDate().toString().length === 1? "0"+birthDayRaw.getDate() : birthDayRaw.getDate();
    const birthMonth = (birthDayRaw.getMonth() + 1).toString().length === 1? "0" + (birthDayRaw.getMonth() + 1) : birthDayRaw.getMonth() + 1;
    const birthDayStr = `${birthMonth}/${birthDate}/${birthDayRaw.getFullYear()}`;

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
    document.querySelector(".profile-detail").setAttribute("data-id", id);
    document.querySelector(".profile-detail").innerHTML = profileHtml;
}

function openProfileDetail(){
    const shadow =  document.querySelector(".shadow-background");

    document.body.style.overflow = "hidden";
    shadow.style.position = "fixed";
    shadow.hidden = false;
}

function closeProfileDetail() {
    const shadow =  document.querySelector(".shadow-background");

    document.body.style.overflow = "";
    shadow.style.position = "";
    shadow.hidden = true;
}

// show next profile
function switchProfileDetail(e) {
    console.log(1111,e.key);
    const shadow =  document.querySelector(".shadow-background");
    let id =  document.querySelector(".profile-detail").getAttribute("data-id");

    if(shadow.hidden === false && id != null && !isNaN(parseInt(id))){
        if(e.key == "ArrowRight"){
            updateProfileDetail(parseInt(id) === employeeArray.length - 1 ? 0 : parseInt(id) + 1);
        } else if (e.key == "ArrowLeft"){
            updateProfileDetail(parseInt(id) === 0 ? employeeArray.length - 1 : parseInt(id) - 1);
        }
    }
}

// profile filter
function profileFilter(){
    const searchWord = document.getElementById("searchKeyWord").value.trim();
    console.log(searchWord);
    if(searchWord === ""){
        console.log(111112222,employeeArray);
        updateDirectory(employeeArray);
    } else {
        let searchResult = employeeArray.filter(ele => ele.name.first.indexOf(searchWord) > 0 || ele.name.last.indexOf(searchWord) > 0);
        updateDirectory(searchResult);
    }
}

// fetch employee data from api
function fetchEmployee(num = 12, nat = "US"){
    console.log(num);
    fetchData(`https://randomuser.me/api/?nat=${nat}&results=${num}&format=json`)
        .then(data => {
            employeeArray = data.results;
            updateDirectory(data.results);
        });
}

function initPage(){
    const searchInput = document.getElementById("searchKeyWord");
    const searchButton = document.getElementById("searchBt");
    const closeButton = document.querySelector(".close");
    const shadow =  document.querySelector(".shadow-background");

    fetchEmployee(12, "US");
    // document.addEventListener("keyup", switchProfileDetail);
    searchInput.addEventListener("keyup", profileFilter);
    searchButton.addEventListener("click", profileFilter);
    closeButton.addEventListener("click", closeProfileDetail);
}

document.addEventListener("DOMContentLoaded", initPage);


