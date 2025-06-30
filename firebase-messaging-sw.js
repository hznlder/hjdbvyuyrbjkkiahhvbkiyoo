// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon || '/images/icon-192x192.png',
        badge: '/images/icon-192x192.png',
        tag: 'code-forge-notification',
        requireInteraction: true,
        actions: [
            {
                action: 'view',
                title: 'View Codes'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ],
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        // Open the app
        event.waitUntil(
            clients.openWindow(event.notification.data?.url || '/')
        );
    }
    // 'dismiss' action or clicking the notification body will just close it
});

