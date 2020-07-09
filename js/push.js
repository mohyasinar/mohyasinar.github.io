var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BHQSx87Uhd9knE4V0DqjomgVYpRSBYoY7dOo3odXVBQDuhSeb3RfS4rELpiaUggXwpBvTLdiVzh24yVouMkpYzo",
    "privateKey": "0xi43uQhzvBhLVR-AFLQfhybLCflJ13BSE6EzNGPoQI"
};

webPush.setVapidDetails(
    'mailto:mohyasin2418@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/fqEaYMXSGqk:APA91bFM8oNv3J5Loa_G92LPcf-acqH5SHCJRl41RuN4T-NMcoLQVo8iNa3pf2rZWM-LZait6gyq-fpz8APy_xJeet2XPHBnc_cfy-UfquDrh2LfKwPiYmgDnvUaFRWSthMAOtMaiXhI",
    "keys": {
        "p256dh": "BFkVBLcUNDr4XaOfiG/pwIv0Z53zwc0ZHz4xyuIKrwL0U2p/T2FXMXjs31pxj+mDTHA0zihRXP6IV6ZIYtg0D6U=",
        "auth": "+HD/tEDpkfjIjdhaDclrrw=="
    }
};

var payload = 'Manchester City vs Manchester United \n7PM Today!';

var options = {
    gcmAPIKey: '1030151089725',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);