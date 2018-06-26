let employeeArray = [];
const stateShort = {
    "Alabama":"AL", "Alaska":"AK", "Arizona":"AZ", "Arkansas":"AR", "California":"CA", "Colorado":"CO", "Connecticut":"CT", "Delaware":"DE", "Florida":"FL", "Georgia":"GA", "Hawaii":"HI",
    "Idaho":"IA", "Illinois":"IL", "Indiana":"IN", "Iowa":"IA", "Kansas":"KS", "Kentucky":"KY", "Louisiana":"LA", "Maine":"ME", "Maryland":"MD", "Massachusetts":"MA", "Michigan":"MI", "Minnesota":"MN", "Mississippi":"MS",
    "Missouri":"MO", "Montana":"MT", "Nebraska":"NE", "Nevada":"NV", "New hampshire":"NH", "New jersey":"NJ", "New mexico":"NM", "New York":"NY", "North Carolina":"NC", "North Dakota":"ND", "Ohio":"OH", "Oklahoma":"OK",
    "Oregon":"OR", "Pennsylvania":"PA", "Rhode island":"RI", "South carolina":"SC", "South dakota":"SD", "Tennessee":"TN", "Texas":"TX", "Utah":"UT", "Vermont":"VT", "Virginia":"VA", "Washington":"WA", "West Virginia":"WV", "Wisconsin":"WI", "Wyoming":"WY",
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
    employeeArray = employeeData;
    const profileGrid = document.querySelector(".profile-grid");

    const profileListHtml = employeeArray.reduce((html, employee, index) => {
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
    console.log(employeeArray[e.currentTarget.getAttribute("data-id")]);
    if(isNaN(e.currentTarget.getAttribute("data-id"))) return;

    const selectEmployee = employeeArray[e.currentTarget.getAttribute("data-id")];
    const profileHtml =    `<img src="${selectEmployee.picture.large}">
                            <div class="info">
                                <div class="name">${selectEmployee.name.first} ${selectEmployee.name.last}</div>
                                <div class="email">${selectEmployee.email}</div>
                                <div class="city">${selectEmployee.location.city}</div>
                                <div class="seperate-line"></div>
                                <div class="more">${selectEmployee.phone}</div>
                                <div class="more">${selectEmployee.street}, ${stateShort[selectEmployee.location.state]} ${selectEmployee.location.postcode}</div>
                                <div class="more">Birthday:${}</div>
                            </div>`
}

// show next profile
function switchProfileDetail(e) {
    console.log(1111 + e.target.getAttribute("data-id"))
}

// profile filter
function profileFilter(){

}

// fetch employee data from api
function fetchEmployee(num = 12, nat = "US"){
    console.log(num);
    fetchData(`https://randomuser.me/api/?nat=${nat}&results=${num}&format=json`)
        .then(data => updateDirectory(data.results));
}

function initPage(){
    const profileDetail = document.querySelector(".profile-detail");
    const searchInput = document.getElementById("searchKeyWord");
    const searchButton = document.getElementById("searchBt");

    fetchEmployee(12, "US");
    profileDetail.addEventListener("keyup", switchProfileDetail);
    searchInput.addEventListener("keyup", profileFilter);
    searchButton.addEventListener("click", profileFilter);
}

document.addEventListener("DOMContentLoaded", initPage);


