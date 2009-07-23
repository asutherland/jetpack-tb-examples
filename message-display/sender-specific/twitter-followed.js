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

jetpack.future.import("thunderbird.messageDisplay");

let tb = jetpack.thunderbird;

tb.messageDisplay.overrideMessageDisplay({
  match: {
    fromAddress: /twitter-follow-[^@]+@postmaster.twitter.com/
  },
  onDisplay: function(aGlodaMsg, aMimeMsg) {
    let desc = aMimeMsg.get("X-Twittersendername", "some anonymous jerk") +
      " has followed you on Twitter.  Check out their twitter page below.";
    return {
      beforeHtml:
        <>
          <div style="background-color: black; color: white; padding: 3px; margin: 3px; -moz-border-radius: 3px;">
            {desc}
          </div>
        </>,
      url: "http://twitter.com/" + aMimeMsg.get("X-Twittersenderscreenname")
    };
  }
});
