jetpack.future.import("menu");
jetpack.future.import("thunderbird.wmsy");

let tb = jetpack.thunderbird;
let wy = tb.wmsy;

function Artist(aName) {
  this.name = aName;
}

function Disc(aArtist, aName, aKind, aYear, aOwningAlbum) {
  this.artist = aArtist;
  this.name = aName;
  this.kind = aKind;
  this.year = aYear;
  this.owningAlbum = aOwningAlbum;

  this.ownedSingles = null;
}
Disc.prototype = {
  addOwnedSingle: function Disc_addOwnedDisc(aDisc) {
    if (this.ownedSingles == null)
      this.ownedSingles = [];
    this.ownedSingles.push(aDisc);
  }
};

function metafy(aArtistName, aAlbumMappings) {
  let meta = {};
  let artist = meta.artist = new Artist(aArtistName);
  let albums = meta.albums = [];
  let singles = meta.singles = [];
  for each (let [kind, albumList] in Iterator(aAlbumMappings)) {
    for each (let [, [albumName, albumYear, singleDefs]] in Iterator(discList)){
      let album = new Disc(artist, albumName, kind, albumYear, null);
      albums.push(album);

      for each (let [, [singleName, singleYear]] in Iterator(singleDefs)) {
        let single = new Disc(artist, singleName, "single", singleYear,
                              album);
        singles.push(single);
      }
    }
  }
}

let psbMeta = metafy("Pet Shop Boys", {
  album: [
    ["Please", 1986, [
       ["West End Girls", 1985],
       ["Love Comes Quickly", 1986],
       ["Opportunities (Let's Make Lots of Money)", 1986],
       ["Suburbia", 1986]
    ]],
    ["Actually", 1987, [
      ["It's a Sin", 1987],
      ["What Have I Done To Deserve This?", 1987],
      ["Rent", 1987],
      ["Heart", 1988],
    ]],
    ["Behaviour", 1990, [
      ["So Hard", 1990],
      ["Being Boring", 1990],
      ["How Can You Expect To Be Taken Seriously?", 1991],
      ["Jealousy", 1991],
    ]],
    ["Very", 1993, [
      ["Can You Forgive Her?", 1993],
      ["Go West", 1993],
      ["I Wouldn't Normally Do This Kind Of Thing", 1993],
      ["Liberation", 1994],
      ["Yesetreday, When I Was Mad", 1994],
    ]],
    ["Bilingual", 1996, [
      ["Before", 1996],
      ["Se a vida é (That's The Way Life Is)", 1996],
      ["Single-Bilingual", 1996],
      ["A Red Letter Day", 1997],
      ["Somewhere", 1997],
    ]],
    ["Nightlife", 1999, [
      ["I Don't Know What You Want But I Can't Give It Any More", 1999],
      ["New York City Boy",1999 ],
      ["You Only Tell Me You Love Me When You're Drunk", 2000],
    ]],
    ["Release", 2002, [
      ["Home And Dry", 2002],
      ["I Get Along", 2002],
      ["London", 2003],
    ]],
    ["Fundamental", 2006, [
      ["I'm With Stupid", 2006],
      ["Minimal", 2006],
      ["Numb", 2006],
      ["Integral", 2007],
    ]],
    ["Yes", 2009, [
      ["Love, etc.", 2009],
      ["Did You See Me Coming?", 2009],
      ["Beautiful People", 2009],
    ]],
  ],
  "album.ep": [
    ["Introspective", 1988, [
      ["Always On My Mind", 1987],
      ["Domino Dancing", 1988],
      ["Left To My Own Devices", 1988],
      ["It's Alright", 1988],
    ]],
  ],
});



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
  structure: wy.flow({
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
    fromBlock: wy.flow({
      from: wy.widget({type: "identity"}, "from"),
      saysLabel: " says ",
      subject: wy.bind("subject"),
    }),
    toBlock: wy.flow({
      toLabel: "to: ",
      to: wy.widgetFlow({type: "identity"}, "to", {separator: ", "}),
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
  structure: wy.flow({
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

////////////////////////////////////////////////////////////////////////////////
//// Artist

tb.wmsy.defineWidget({
  name: "artist-detail-view",
  constraint: {
    type: "artist",
  },
  structure: {
    artistLabel: wy.bind(["artist", "name"]),
    albums: wy.subWidget({subpart: "album-list"}),
    singles: wy.subWidget({subpart: "singles-list"}),
  },
});

tb.wmsy.defineWidget({
  name: "artist:album-list",
  doc: "List of albums by an artist.",
  constraint: {
    type: "artist",
    subpart: "album-list",
  },
  structure: {
    albums: wy.widgetList({type: "album-collection"}, "albums"),
  },
  emit: ["albumSelected"],
  events: {
    albums: {
      command: function(aAlbumWidget) {
        this.emit_albumSelected(aAlbumWidget.obj);
      }
    }
  }
});

tb.wmsy.defineSubWidget({
  name: "artist:singles-list",
  doc: "List of singles by an artist, grouped by their owning album.",
  constraint: {
    type: "artist",
    subpart: "singles-list",
  },
  structure: {
    albumGroups: wy.widgetList({type: "album-collection", attr: "ownedSingles"},
                               "albums"),
  },
  handle: {
    albumSelected: function(aAlbum) {
      // focus the group
    }
  }
});

////////////////////////////////////////////////////////////////////////////////
//// Album Groups

tb.wmsy.defineWidget({
  name: "album-group",
  doc: "Group of albums from a parameterized attribute.",
  constraint: {
    type: "album-collection",
    mode: "list",
    attr: wy.WILD,
  },
  structure: {
    albums: wy.widgetList({type: "album"}, wy.fromConstraint("attr")),
  },
  style: {
    root: {
      _: <>
        padding: 1em;
        border: none;
        background-color: #bbb;</>,
      '[focused="true"]': <>
        background-color: #fff;
        border: 1px solid #000;</>,
    }
  }
});

////////////////////////////////////////////////////////////////////////////////
//// Albums

tb.wmsy.defineWidget({
  name: "album-overview-medium",
  doc: "Album as cover art and title.",
  constraint: {
    type: "album",
  },
  structure: {
    cover: {},
    albumTitle: wy.bind("name"),
  },
  events: {
    root: {
      command: function() {

      }
    }
  },
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
