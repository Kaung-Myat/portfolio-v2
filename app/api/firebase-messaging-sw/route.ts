import { NextResponse } from "next/server";

export async function GET() {
  const config = JSON.stringify({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  });

  const script = `
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

var _config = ${config};

if (_config.apiKey) {
  firebase.initializeApp(_config);
  var messaging = firebase.messaging();

  messaging.onBackgroundMessage(function(payload) {
    var title = (payload.notification && payload.notification.title) || 'New Post';
    var body = (payload.notification && payload.notification.body) || '';
    var url = (payload.data && payload.data.url) || '/blog';
    self.registration.showNotification(title, {
      body: body,
      icon: '/icons/icon-192.png',
      data: { url: url },
    });
  });

  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var url = (event.notification.data && event.notification.data.url) || '/blog';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
        for (var i = 0; i < list.length; i++) {
          var client = list[i];
          if (client.url.indexOf(url) !== -1 && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
    );
  });
}
`.trim();

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
