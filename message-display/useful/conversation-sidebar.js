/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MIT
 *
 * Copyright (c) 2009 Mozilla Messaging, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ***** END LICENSE BLOCK ***** */

const Cc = Components.classes;
const Ci = Components.interfaces;

jetpack.future.import("slideBar");
jetpack.future.import("thunderbird.messageDisplay");

let tb = jetpack.thunderbird;

const ICON = "data:image/png;base64,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";

const MAX_SNIPPET_CHARS = 120;

jetpack.slideBar.append({
  icon: ICON,
  persist: true,
  onReady: function (slide) {
    let doc = slide.contentDocument;

    tb.messageDisplay.onMessageDisplay(function (aGlodaMsg) {
      if (slide.conversation &&
          slide.conversation.message.conversation == aGlodaMsg.conversation)
        return;
      slide.conversation = new ConversationDisplay(doc, aGlodaMsg);
    }, {slideHash: slide});
  },
  html: <>
    <style><![CDATA[
      body {
        background-color: #ffffff;
      }

      .message {
        background-color: #c9f76f;
        -moz-border-radius: 4px;
        padding: 4px;
        margin-bottom: 6px;
      }

      .message[read=true] {
        background-color: #eaffc1;
      }

      .message[selected=true] {
        border-style: solid;
        border-color: #679b00;
        border-width: 3px;
      }

      .author {
        font-weight: bold;
      }

      .date {
      }

      .body {
        color: #555;
      }
    ]]></style>
    <body>
    </body>
  </>
});

function ConversationDisplay(aDoc, aGlodaMsg) {
  this.doc = aDoc;
  this.message = aGlodaMsg;
  this.collection = aGlodaMsg.conversation.getMessagesCollection(this);

  // clean out the existing content
  $(this.doc.body).empty();
}
ConversationDisplay.prototype = {
  // --- gloda listener part
  onItemsAdded: function(aItems, aCollection) {
  },
  onItemsModified: function(aItems, aCollection) {
  },
  onItemsRemoved: function(aItems, aCollection) {
  },
  onQueryCompleted: function(aCollection) {
    // the items come ordered by date
    for each (let [, msg] in Iterator(aCollection.items)) {
      this.emitMessage(msg);
    }
  },

  emitMessage: function(aMsg) {
    let body = this.doc.body;
    let message = $("<div />", body)
      .addClass("message")
      .click(function () {
               tb.messageDisplay.showMessage(aMsg);
             });

    $("<div />", body)
      .addClass("author")
      .text(aMsg.from.contact.name)
      .appendTo(message);
    $("<div />", body)
      .addClass("date")
      .text(makeDateFriendly(aMsg.date))
      .appendTo(message);
    if (aMsg.indexedBodyText) {
      $("<div />", body)
        .addClass("body")
        .text(aMsg.indexedBodyText.substring(0, MAX_SNIPPET_CHARS))
        .appendTo(message);
    }

    if (aMsg.read)
      message.attr("read", "true");
    if (aMsg == this.message)
      message.attr("selected", "true");

    message.appendTo(this.doc.body);
  }
};

let gStr = {
  yesterday: "Yesterday", // "yesterday",
  monthDate: "#1 #2", // "monthDate",
  yearDate: "#1 #2 #3" // "yearDate",
};

function makeDateFriendly(date)
{
  if (!date) {
    dump("ERROR: date passed to makeDateFriendly is false\n");
    return "";
  }
  let dts = Cc["@mozilla.org/intl/scriptabledateformat;1"].
            getService(Ci.nsIScriptableDateFormat);

  // Figure out when today begins
  let now = new Date();
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get the end time to display
  let end = date;

  // Figure out if the end time is from today, yesterday, this week, etc.
  let dateTime;
  if (end >= today) {
    // Download finished after today started, show the time
    dateTime = dts.FormatTime("", dts.timeFormatNoSeconds,
                              end.getHours(), end.getMinutes(), 0);
  } else if (today - end < (24 * 60 * 60 * 1000)) {
    // Download finished after yesterday started, show yesterday
    dateTime = gStr.yesterday;
  } else if (today - end < (6 * 24 * 60 * 60 * 1000)) {
    // Download finished after last week started, show day of week
    dateTime = end.toLocaleFormat("%A");
  } else if (today - end < (30 * 24 * 60 * 60 * 1000)) {
    // Download must have been from some time ago.. show month/day
    let month = end.toLocaleFormat("%B");
    // Remove leading 0 by converting the date string to a number
    let date = Number(end.toLocaleFormat("%d"));
    dateTime = replaceInsert(gStr.monthDate, 1, month);
    dateTime = replaceInsert(dateTime, 2, date);
  } else {
    // Download finished after last month started, show year
    let month = end.toLocaleFormat("%B");
    let year = end.toLocaleFormat("%y");
    // Remove leading 0 by converting the date string to a number
    let date = Number(end.toLocaleFormat("%d"));
    dateTime = replaceInsert(gStr.yearDate, 1, month);
    dateTime = replaceInsert(dateTime, 2, date);
    dateTime = replaceInsert(dateTime, 3, year);
  }

  return dateTime;
}

/**
 * Helper function to replace a placeholder string with a real string
 *
 * @param aText
 *        Source text containing placeholder (e.g., #1)
 * @param aIndex
 *        Index number of placeholder to replace
 * @param aValue
 *        New string to put in place of placeholder
 * @return The string with placeholder replaced with the new string
 */
function replaceInsert(aText, aIndex, aValue)
{
  try {
    return aText.replace("#" + aIndex, aValue);
  } catch (e) {
    dump("aText = " + aText + '\n');
    dumpExc(e);
  }
}
