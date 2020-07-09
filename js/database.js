var dbPromised = idb.open("football-now", 1, function(upgradeDb) {
    var articlesObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "ID"
    });
    articlesObjectStore.createIndex("team_name", "team_name", { unique: false });
});

const dbInsertIntoFavorite = team => {
        dbPromised.then(function(db) {
        var tx = db.transaction("teams", "readwrite");
        var store = tx.objectStore("teams");
        console.log(team);
        store.put(team);
        return tx.complete;
    })
    .then(function() {
        console.log("Team succesfully added to favorite.")
    })
    .catch(function() {
         console.log("Team not succesfully added.")
    })
    
};

const dbGetAllFavorite = () => {
    return new Promise(function(resolve, reject) {
        dbPromised.then(function(db) {
            var tx = db.transaction("teams", "readonly");
            var store = tx.objectStore("teams");
            return store.getAll();
        })
        .then(function(teams) {
            resolve(teams);
        });
    });
};

const dbDeleteFromFavorite = ID => {
    dbPromised.then(function(db) {
    var tx = db.transaction("teams", "readwrite");
    var store = tx.objectStore("teams");
    console.log(ID);
    store.delete(ID);
    return tx.complete;
})
.then(function() {
    console.log("Team succesfully deleted.")
})
.catch(function() {
     console.log("Team not succesfully added.")
})

};

export { dbInsertIntoFavorite, dbGetAllFavorite, dbDeleteFromFavorite }