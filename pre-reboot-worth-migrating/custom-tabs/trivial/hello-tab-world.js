jetpack.future.import("menu");
jetpack.future.import("thunderbird.tabs");

let tb = jetpack.thunderbird;

tb.tabs.defineTabType({
  name: "helloTabWorld",
  onTabOpened: function(tab, args) {
    tab.title = "Hallo Hallo";

    let doc = tab.contentDocument;

    // dynamic content injection is not actually required.
    $("<h1/>", doc)
      .text("Hello Tab World!")
      .appendTo(doc.documentElement);
  },
  html: <html>
    <head></head>
    <body>
    </body>
  </html>
});

jetpack.menu.tools.add({
  label: "Show Hello World Tab",
  command: function() tb.tabs.openTab("helloTabWorld", {})
});
