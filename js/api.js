import {dbInsertIntoFavorite, dbGetAllFavorite, dbDeleteFromFavorite}  from "./database.js";

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
      return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}
  
const getStandings = () => {

    if ('caches' in window) {
        caches.match("https://api.football-data.org/v2/competitions/2021/standings", {
            headers: {
                'X-Auth-Token': 'aff584fc04364048b6e5ac9ad502cb1f',
              }
        }).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    let standingsHTML = "";
                    data.standings[0].table.forEach(data => {
                        standingsHTML += `
                        <tr>
                        <td>${data.position}</td>
                        <td><b>${data.team.name}</b></td>
                        <td>${data.won}</td>
                        <td>${data.draw}</td>
                        <td>${data.lost}</td>
                        <td><b>${data.points}</b></td>
                      </tr>
                        `;
                    });
                    document.getElementById("table").innerHTML = standingsHTML;
                })
            }
        })
    }
                

    fetch('https://api.football-data.org/v2/competitions/2021/standings', {
        headers: {
          'X-Auth-Token': 'aff584fc04364048b6e5ac9ad502cb1f',
        }
    })
    .then(status)
    .then(json)
    .then(function(data) {
        let standingsHTML = "";
        data.standings[0].table.forEach(data => {
            standingsHTML += `
            <tr>
            <td>${data.position}</td>
            <td><b>${data.team.name}</b></td>
            <td>${data.won}</td>
            <td>${data.draw}</td>
            <td>${data.lost}</td>
            <td><b>${data.points}</b></td>
          </tr>
            `;
        });
        document.getElementById("table").innerHTML = standingsHTML;
    })
    .catch(error);
}

const getTeams = () => {

    if ('caches' in window) {
        caches.match("https://api.football-data.org/v2/competitions/2021/teams", {
            headers: {
                'X-Auth-Token': 'aff584fc04364048b6e5ac9ad502cb1f',
              }
        }).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    let teamsHTML = "";
                    data.teams.forEach(data => {
                        teamsHTML += `
                        <div class="card">
                            <blockquote>
                            <div class="card-content ">
                                <div class="card-image">
                                    <div class="col s3 m2 l1">
                                    <img src="${data.crestUrl}" onerror="this.src='/img/img-not-found.svg'" class="responsive-img">
                                    </div>
                                </div>
                                <span class="card-title black-text"><h4>${data.name}</h4></span>
                                    <h6 class="black-text">This club founded on ${data.founded}, the jersey identical with ${data.clubColors} color and using ${data.venue} as their home.</h6>
                                    <p class="black-text">Website: ${data.website}</p><br>
                                    <span class="favorite-button"><a class="btn-floating red darken-3 btn-small favorite"><i class="material-icons"  id="favorite-button">favorite</i></a></span>
                            </div>
                            </blockquote>
                            </a>
                        </div>
                        `;
                    });
                    document.getElementById("list-team").innerHTML = teamsHTML;
                })
            }
        })
    }

    fetch('https://api.football-data.org/v2/competitions/2021/teams', {
        headers: {
          'X-Auth-Token': 'aff584fc04364048b6e5ac9ad502cb1f',
        }
    })
    .then(status)
    .then(json)
    .then(function(data) {
        let teamsHTML = "";
        data.teams.forEach(data => {
            teamsHTML += `
            <div class="card" name="${data.id}"  id="teamId" >
                <blockquote>
                <div class="card-content ">
                    <div class="card-image">
                        <div class="col s3 m2 l1">
                        <img src="${data.crestUrl}" onerror="this.src='/img/img-not-found.svg'" id="teamLogo" class="responsive-img">
                        </div>
                    </div>
                    <span class="card-title black-text"><h4 id="teamName">${data.name}</h4></span>
                        <h6 class="black-text" id="teamDesc">This club founded on ${data.founded}, the jersey identical with ${data.clubColors} color and using ${data.venue} as their home.</h6>
                        <p class="black-text" id="teamWebsite">Website: ${data.website}</p><br>
                        <span dataId="${data.id}" dataName="${data.name}" dataLogo="${data.crestUrl}" dataDesc="This club founded on ${data.founded}, the jersey identical with ${data.clubColors} color and using ${data.venue} as their home." dataWeb="${data.website}" class="favorite-button">
                            <a class="btn-floating red darken-3 btn-small favorite">
                                <i class="material-icons" id="material-icon">favorite_border</i>
                            </a>
                        </span>
                </div>
                </blockquote>
                </a>
            </div>
            `;
        });
        document.getElementById("list-team").innerHTML = teamsHTML;
        const fav = document.getElementsByClassName("favorite-button");
        for (let i = 0; i < fav.length; i++) {   
            fav[i].onclick = () => {
                const data = {
                    ID: fav[i].getAttribute('dataId'),
                    teamName: fav[i].getAttribute('dataName'),
                    teamLogo: fav[i].getAttribute('dataLogo'),
                    teamDesc: fav[i].getAttribute('dataDesc'),
                    teamWeb: fav[i].getAttribute('dataWeb'),
                }
                dbInsertIntoFavorite(data);
                M.toast({html: `${data.teamName} added to favorite.`});
                const changeFav = fav[i].querySelector("i");
                console.log(changeFav);
                changeFav.innerHTML = "favorite";
            };
        }; 
        
    })
    .catch(error);
}

const getFavoriteTeams = () => {
    dbGetAllFavorite().then(function(teams) {
        let teamsHTML = "";
        teams.forEach(data => {
            teamsHTML += `
            <div class="card" name="${data.ID}"  id="teamId" >
                <blockquote>
                <div class="card-content ">
                    <div class="card-image">
                        <div class="col s3 m2 l1">
                        <img src="${data.teamLogo}" onerror="this.src='/img/img-not-found.svg'" id="teamLogo" class="responsive-img">
                        </div>
                    </div>
                    <span class="card-title black-text"><h4 id="teamName">${data.teamName}</h4></span>
                        <h6 class="black-text" id="teamDesc">${data.teamDesc}</h6>
                        <p class="black-text" id="teamWebsite">Website: ${data.teamWeb}</p><br>
                     <span dataId="${data.ID}" dataName="${data.teamName}" class="delete-button">
                        <a class="btn-floating red darken-3 btn-small delete">
                            <i class="material-icons" id="delete-button">delete</i>
                        </a>
                    </span>
                </div>
                </blockquote>
                </a>
            </div>
            `;
        });
        document.getElementById("list-team").innerHTML = teamsHTML;
        const del = document.getElementsByClassName("delete-button");
        for (let i = 0; i < del.length; i++) { 
            del[i].onclick = () => {
                const data = {
                    ID: del[i].getAttribute('dataId'),
                    teamName: del[i].getAttribute('dataName')
                    };
                dbDeleteFromFavorite(data.ID);
                M.toast({html: `${data.teamName} deleted from favorite teams.`});
                location.reload();
            };
        } 

    })
}

export { getStandings, getTeams, getFavoriteTeams };