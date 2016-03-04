'use strict';

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);

  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = '/images/icon-192x192.png';
  var tag = 'simple-push-demo-notification-tag';

  event.waitUntil(
//    self.registration.showNotification(title, {
//      body: body,
//      icon: icon,
//      tag: tag
//  })
 );

  self.registration.getNotifications().then(function(NotificationList) {
      NotificationList.forEach(function(notification) {
          console.log('title:' + notification.title);
          console.log('title:' + notification.title);
          console.log('body:' + notification.body);
          console.log('title:' + notification.tag);
      });
  });


  var promise = self.clients.matchAll({includeUncontrolled:true})
  .then(function(clientList) {
    // event.source.id contains the ID of the sender of the message.
    // `event` in Chrome isn't an ExtendableMessageEvent yet (https://slightlyoff.github.io/ServiceWorker/spec/service_worker/#extendablemessage-event-interface),
    // so it doesn't have the `source` property.
    // https://code.google.com/p/chromium/issues/detail?id=543198
    var senderID = event.source ? event.source.id : 'unknown';

    // We'll also print a warning, so users playing with the demo aren't confused.
    if (!event.source) {
      console.log('event.source is null; we don\'t know the sender of the ' +
                  'message');
    }

    clientList.forEach(function(client) {
      // Skip sending the message to the client that sent it.
      if (client.id === senderID) {
        return;
      }
      client.postMessage({
        client: senderID,
        message: event.data
      });
    });
  });

  // If event.waitUntil is defined (not yet in Chrome because of the same issue detailed before),
  // use it to extend the lifetime of the Service Worker.
  if (event.waitUntil) {
    event.waitUntil(promise);
  }

});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/');
    }
  }));
});

self.addEventListener('install', function(event) {
  console.log('install');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  console.log('activate');
  event.waitUntil(self.clients.claim());
});
