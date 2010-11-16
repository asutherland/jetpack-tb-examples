var $tabs = require("tbprime/ui/tabs/tab-api");
var $wmsy = require("wmsy/wmsy");

var $simpleFeature = require("tbprime/opc/simple-feature");

var wy = new $wmsy.WmsyDomain({id: "hello-world",
                               domain: "hello-world"});

wy.defineWidget({
  name: "hello-world",
  doc: "I am sure this all seems like overkill.",
  constraint: {
    type: "hello",
  },
  structure: {
    message: ["Hello, ", wy.bind("helloTo"), "!"],
  },
});

$tabs.defineTabType({
  name: "wmsy-hello-world",
  onTabOpened: function(tab) {
    tab.title = "Heya!";
    var emitter = wy.wrapElement(tab.contentDocument.getElementById("content"));
    var helloObj = {
      helloTo: "World",
    };
    emitter.emit({type: "hello", obj: helloObj});
  },
});

var feature = new $simpleFeature.SimpleFeature("Hello World", function() {
  $tabs.openTab("wmsy-hello-world", {});
});

exports.main = function() {
  // meh, don't actually do anything.
};
