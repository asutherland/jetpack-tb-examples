/* ***** BEGIN LICENSE BLOCK *****
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/licenses/publicdomain/
 * ***** END LICENSE BLOCK ***** */

/*
 * Add a slidebar that displays the author and 'to' recipients of a message
 *  when a message is displayed.  This updates as tab changes are made.
 *  It does depend on the message having been gloda indexed already; in the
 *  future we will be able to relax that requirement while still providing
 *  the gloda data-model.
 */

jetpack.future.import("thunderbird.messageDisplay");

let tb = jetpack.thunderbird;

tb.messageDisplay.appendReaderPanel({
  onReady: function (panel) {
    let doc = panel.contentDocument;

    tb.messageDisplay.onMessageDisplay(function (aGlodaMsg) {
      $(doc.body).empty();
      $("<span />", doc.body)
        .text("Hello, " + aGlodaMsg.from.contact.name)
        .appendTo(doc.body);
      // We need to request to be shown.
      panel.show();
    }, {window: panel.window});
  },
  html:
    <>
      <body style="overflow: hidden">
      </body>
    </>
});
