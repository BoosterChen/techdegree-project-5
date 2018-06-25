let employeeArray = [];

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

// fetch employee data from api
function generateEmployees(num, nat){
    fetchData(`https://randomuser.me/api/?nat=${nat}&results=${num}&format=json`)
        .then(data => initPageHtml(data.results));
}

// generate html from employeeArray
function initPageHtml( data ) {
    if(data.length === 0) return;
    employeeArray = data;
    const profileGrid = document.querySelector(".profile-grid");
    const profileDetail = document.querySelector(".profile-detail");

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
    profileGrid.addEventListener("click", showProfileDetail);
    profileDetail.addEventListener("keyup", nextProfileDetail);
}

// show modal window of profile detail
function showProfileDetail(e) {
    console.log(e.target);
    const target = e.target;
    if(target.className !== "profile-grid"){

    }
}

// show next profile
function nextProfileDetail() {

}


// init the directory
function initDirectory(){
    generateEmployees(12,"US");
}

document.addEventListener("DOMContentLoaded", initDirectory);


