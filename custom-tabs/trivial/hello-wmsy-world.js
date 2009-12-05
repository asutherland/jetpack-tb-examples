jetpack.future.import("menu");
jetpack.future.import("thunderbird.tabs");
jetpack.future.import("thunderbird.wmsy");

let tb = jetpack.thunderbird;

tb.wmsy.defineWidget({
  name: "hello-world",
  constraint: {
    helloTo: "world",
  },
  structure: "Hello Wmsy World!",
  style: {
    root: <>
      font-size: 200%;
    </>
  }
});

tb.tabs.defineTabType({
  name: "helloWmsyWorld",
  onTabOpened: function(tab, args) {
    tab.title = "Wmsy says Hello";

    let doc = tab.contentDocument;
    tb.wmsy.wrapElement(doc.documentElement)
      .emit({helloTo: "world"});
  },
  html: <html>
    <head></head>
    <body>
    </body>
  </html>
});

jetpack.menu.tools.add({
  label: "Show Hello Wmsy Tab",
  command: function() tb.tabs.openTab("helloWmsyWorld", {})
});
