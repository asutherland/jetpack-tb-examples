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

const MAX_SNIPPET_CHARS = 120;

jetpack.slideBar.append({
  persist: true,
  onReady: function (slide) {
    let doc = slide.contentDocument;

    tb.messageDisplay.onMessageDisplay(function (aGlodaMsg) {
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
