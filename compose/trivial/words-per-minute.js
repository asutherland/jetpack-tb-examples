/* ***** BEGIN LICENSE BLOCK *****
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/licenses/publicdomain/
 * ***** END LICENSE BLOCK ***** */

/*
 * Add a words-per-minute display to the compose window.
 */

jetpack.future.import("thunderbird.compose");
jetpack.thunderbird.compose.appendComposePanel({
  onReady: function (panel, composeContext) {
    let doc = panel.contentDocument;
    let msgNode = $("<span />", doc.body).appendTo(doc.body);

    let started = Date.now();
    setInterval(function() {
        let words = composeContext.getPlaintextContents().split(/\s+/);
        let secs = Math.ceil((Date.now() - started) / 1000);
        let wordsPerMinute = Math.floor((words.length * 60) / secs);
        msgNode.text(wordsPerMinute + " words per minute.");
      }, 1000);

    panel.show();
  },
  html: <><body style="overflow: hidden"></body></>
});
