jetpack.future.import("menu");
jetpack.future.import("thunderbird.tabs");
jetpack.future.import("thunderbird.wmsy");

let tb = jetpack.thunderbird;
let wy = tb.wmsy;

function Identity(aName, aEmail, aInAddressBook) {
  this.name = aName;
  this.email = aEmail;
  this.inAddressBook = aInAddressBook;
}

function EmailMessage(aFrom, aTo, aSubject, aBody) {
  this.from = aFrom;
  this.to = aTo;
  this.subject = aSubject;
  this.body = aBody;
}
EmailMessage.prototype = {
  messageType: "rfc822",
};

function Tweet(aFrom, aBody, aDirectedTo) {
  this.from = aFrom;
  this.to = [];
  this.body = aBody;
  this.directedTo = aDirectedTo;
}
Tweet.prototype = {
  messageType: "tweet",
};

let alice = new Identity("Alice", "alice@example.com", true);
let bob = new Identity("Bob", "bob@example.com", false);
let chuck = new Identity("Charles Carmichael", "chuck@example.com", false);

let messages = [
  new EmailMessage(bob, [alice, chuck], "What's the word?",
                   <>My dear compatriots, how are you doing?
I write you from outer space.
It is nice here.</>.toString()),
  new Tweet(bob, "I just sent an email!"),
  // for the directed, we're pretending we processed a "@bob" and removed it
  new Tweet(alice, "yes, yes you did.", bob),
];

/**
 * General identity representation.
 */
tb.wmsy.defineWidget({
  name: "identity-default",
  constraint: {
    type: "identity",
  },
  structure: wy.stream({
    name: wy.bind("name"),
    star: wy.bind("", {starred: "inAddressBook"})
  }),
  style: {
    root: <>
      -moz-border-radius: 4px;
      background-color: #ddd;
      padding: 0px 2px;
    </>,
    star: {
      '[starred="true"]': <>
        display: inline-block;
        width: 12px !important;
        height: 12px;
        background-image: url("chrome://messenger/skin/icons/flag-col.png");
      </>
    }
  }
});

/**
 * General message display widget.
 */
tb.wmsy.defineWidget({
  name: "message-default",
  constraint: {
    type: "message",
  },
  structure: {
    fromBlock: wy.stream({
      from: wy.widget({type: "identity"}, "from"),
      saysLabel: " says ",
      subject: wy.bind("subject"),
    }),
    toBlock: wy.stream({
      toLabel: "to: ",
      to: wy.widgetStream({type: "identity"}, "to", {separator: ", "}),
    }),
    bodyBlock: {
      body: wy.bind("body")
    }
  },
  style: {
    root: <>
      -moz-border-radius: 4px;
      background-color: #729fcf;
      padding: 2px;
      margin: 4px 0px;
    </>,
    subject: <>
      font-weight: bold;
    </>,
    bodyBlock: <>
      margin: 2px;
      padding: 2px;
      -moz-border-radius: 2px;
      background-color: #ffffff;
    </>,
    body: <>
      white-space: pre-wrap
    </>
  }
});

/**
 * Tweet-specialized display.
 */
tb.wmsy.defineWidget({
  name: "message-tweet",
  constraint: {
    type: "message",
    obj: {
      messageType: "tweet"
    }
  },
  structure: wy.stream({
    author: wy.widget({type: "identity"}, "from"),
    body: wy.bind("body"),
  }),
  style: {
    root: <>
      -moz-border-radius: 4px;
      background-color: #ad7fa8;
      margin: 4px 0px;
    </>,
    body: <>
      margin-left: 4px;
    </>
  }
});


tb.tabs.defineTabType({
  name: "wmsyComplexContents",
  onTabOpened: function(tab, args) {
    tab.title = "Wmsy gets a complex";

    let doc = tab.contentDocument;
    let emitter = tb.wmsy.wrapElement(doc.getElementById("content"));
try {
    for each (let [, message] in Iterator(messages)) {
      emitter.emit({type: "message", obj: message});
    }
}
catch(ex) {
  dump("\n\n@@@ " + ex + "\n" + ex.stack + "\n\n");
}
  },
  html: <html>
    <head>
      <style type="text/css"><![CDATA[
        body {
          background-color: #ffffff;
          padding: 4px;
        }
      ]]></style>
    </head>
    <body>
      <div id="content" style="display: inline-block;"/>
    </body>
  </html>
});

jetpack.menu.tools.add({
  label: "Show Wmsy Complex Contents",
  command: function() tb.tabs.openTab("wmsyComplexContents", {})
});
