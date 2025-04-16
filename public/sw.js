// public/sw.js
self.addEventListener("push", function (event) {
  const data = event.data?.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
    })
  );
});

// self.addEventListener("notificationclick", function (event) {
//   event.notification.close();
//   event.waitUntil(clients.openWindow("/"));
// });
