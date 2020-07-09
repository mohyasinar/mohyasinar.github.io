
import { getStandings, getTeams } from "./js/api.js";

document.addEventListener("DOMContentLoaded", function() {
    //Registration Service Worker
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
            navigator.serviceWorker.register("/service-worker.js")
            .then(function() {
                console.log("Pendaftaran ServiceWorker berhasil");
                requestPermission();
            })
            .catch(function() {
            console.log("Pendaftaran ServiceWorker gagal");
            });
        });
    } else {
      console.log("ServiceWorker belum didukung browser ini.");
    }

    //Request Push Notification
    function requestPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(function(result) {
                
                if (result === "denied") {
                    console.log("Notification permission denied by user.");
                    return;
                } else if (result === "default") {
                    console.error("User closed the request permission.");
                    return;
                } 

              navigator.serviceWorker.ready.then(() => {
                if (('PushManager' in window)) {
                    navigator.serviceWorker.getRegistration().then(function(registration) {
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array("BHQSx87Uhd9knE4V0DqjomgVYpRSBYoY7dOo3odXVBQDuhSeb3RfS4rELpiaUggXwpBvTLdiVzh24yVouMkpYzo")
                        }).then(function(subscribe) {
                            console.log('Subscribe has done with endpoint: ', subscribe.endpoint);
                            console.log('Subscribe has done with p256dh key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('p256dh'))
                            )));
                            console.log('Subscribe has done with auth key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('auth'))
                            )));
                        }).catch(function(e) {
                            console.error('Subcribe failed ', e.message);
                        });
                    });
                }
              });
            });
        }
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; i++) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    
    

    //Request API Standings
    getStandings();

    //Request API Teams
    getTeams();

    
          
});