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
    fromAddress: /(?:auto-confirm|ship-confirm)@amazon.(?:com|ca)/
  },
  _totalRe: /Total(?: for this Order)?:[^$]+\$\s*(\d+\.\d{2})/,
  onDisplay: function(aGlodaMsg, aMimeMsg, aMsgHdr) {
    let bodyText = aMimeMsg.coerceBodyToPlaintext(aMsgHdr.folder);
    let match = this._totalRe.exec(bodyText);
    let total = match ? match[1] : "hard to say";
    return {
      html:
      <>
        <style><![CDATA[
          body { background-color: #ffffff; }
          .amount { font-size: 800%; }
        ]]></style>
        <body>
          you spent... <span class="amount">${total}</span>
        </body>
      </>
    };
  }
});
