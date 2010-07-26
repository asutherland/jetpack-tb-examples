jetpack.future.import("menu");

const Cc = Components.classes;
const Ci = Components.interfaces;

let activityMgr =  Cc["@mozilla.org/activity-manager;1"]
                     .getService(Ci.nsIActivityManager);

const nsActEvent = Components.Constructor("@mozilla.org/activity-event;1",
                                          "nsIActivityEvent", "init");

let nextActivityNum = 1;
function addActivities(aCount) {
  let now = Date.now();
  for (let i = 0; i < aCount; i++) {
    activityMgr.addActivity(new nsActEvent(
      "Bogus activity " + (nextActivityNum++),
      "activitest", "Bogusing", now, now));
  }
}

let menu = new jetpack.Menu([
  {
    label: "Add 10",
    command: function() addActivities(10)
  },
  {
    label: "Add 100",
    command: function() addActivities(100)
  },
  {
    label: "Add 1000",
    command: function() addActivities(1000)
  }
]);
jetpack.menu.tools.add({
  label: "Activitest",
  menu: menu,
});
