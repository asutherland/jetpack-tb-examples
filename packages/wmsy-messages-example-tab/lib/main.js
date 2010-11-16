var $simpleFeature = require("tbprime/opc/simple-feature");
var $tabs = require("tbprime/ui/tabs/tab-api");
var $example = require("wmsy/examples/messages-simple");

$tabs.defineTabType({
  name: "wmsy-messages-simple",
  onTabOpened: function(tab) {
    tab.title = "Messages!";
    $example.main(packaging.options.packageData["wmsy"] + "examples/simple/",
                  tab.contentDocument);
  },
});

var feature = new $simpleFeature.SimpleFeature("Wmsy Messages Example",
  function() {
    $tabs.openTab("wmsy-messages-simple", {});
  });

exports.main = function() {
  // meh, don't actually do anything.
};
