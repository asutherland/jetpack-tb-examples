/*
 * Add a slidebar that displays the author and 'to' recipients of a message
 *  when a message is displayed.  This updates as tab changes are made.
 *  It does depend on the message having been gloda indexed already; in the
 *  future we will be able to relax that requirement while still providing
 *  the gloda data-model.
 */

jetpack.future.import("slideBar");
jetpack.future.import("thunderbird.messageDisplay");

let tb = jetpack.thunderbird;

jetpack.slideBar.append({
  persist: true,
  onReady: function (slide) {
    let doc = slide.contentDocument;

    tb.messageDisplay.onMessageDisplay(function (aGlodaMsg) {
      $(doc.body).empty();
      $("<div />", doc.body)
        .text("From: " + aGlodaMsg.from.contact.name)
        .appendTo(doc.body);
      $("<div />", doc.body)
        .text("To: " + [to.contact.name for each
                          (to in aGlodaMsg.to)].join(", "))
        .appendTo(doc.body);
    }, {slideHash: slide});
  },
  html:
    <>
      <body>
      </body>
    </>
});
