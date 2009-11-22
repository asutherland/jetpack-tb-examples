/* ***** BEGIN LICENSE BLOCK *****
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/licenses/publicdomain/
 * ***** END LICENSE BLOCK ***** */

/*
 * Hello-world type app that adds a message reader panel that says hello to
 *  whomever sent the message.
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
