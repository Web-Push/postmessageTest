self.addEventListener('push', function(event) {
  console.log('Received a push message', event);

  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = '/images/icon-192x192.png';
  var tag = 'simple-push-demo-notification-tag';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
  console.log('scope:' + self.registration.scope);
  self.registration.pushManager.getSubscription().then(function(subscription) {
      console.log('getSubscription');
      if (!subscription) {
        console.log('getSubscription result not subscibed');
        return;
      }
      console.log('endpoint:' + subscription.endpoint);
    })
    .catch(function(err) {
      console.log('Error during getSubscription()');
    });
});

self.addEventListener('install', function(event) {
  console.log('install');
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('pushsubscriptionchange', function() {
  console.log('pushsubscriptionchange');
});
self.addEventListener('activate', function(event) {
  console.log('activate');
});
