jetpack.future.import("menu");
jetpack.future.import("thunderbird.tabs");
jetpack.future.import("thunderbird.wmsy");

let tb = jetpack.thunderbird;
let wy = tb.wmsy;

function Artist(aName) {
  this.name = aName;
}

function Disc(aArtist, aName, aKind, aYear, aImageUrlBit, aOwningAlbum) {
  this.artist = aArtist;
  this.name = aName;
  this.kind = aKind;
  this.year = aYear;
  this.owningAlbum = aOwningAlbum;

  this.imageUrl = "http://www.petshopboys.co.uk/media/article_images/300/" +
                    aImageUrlBit + ".jpg";

  this.ownedSingles = [];
}
Disc.prototype = {
  addOwnedSingle: function Disc_addOwnedDisc(aDisc) {
    this.ownedSingles.push(aDisc);
  }
};

function metafy(aArtistName, aAlbumMappings) {
  let meta = {};
  let artist = meta.artist = new Artist(aArtistName);
  let albums = meta.albums = [];
  let singles = meta.singles = [];
  for each (let [kind, discList] in Iterator(aAlbumMappings)) {
    for each (let [, [albumName, albumYear, urlBit, singleDefs]] in
              Iterator(discList)){
      let album = new Disc(artist, albumName, kind, albumYear, urlBit, null);
      albums.push(album);

      for each (let [, [singleName, singleYear, urlBit]] in
                Iterator(singleDefs)) {
        let single = new Disc(artist, singleName, "single", singleYear, urlBit,
                              album);
        singles.push(single);
        album.addOwnedSingle(single);
      }
    }
  }
  return meta;
}

let psbMeta = metafy("Pet Shop Boys", {
  album: [
    ["Please", 1986, 1280, [
       ["West End Girls", 1985, 1314],
       ["Love Comes Quickly", 1986, 1316],
       ["Opportunities (Let's Make Lots of Money)", 1986, 1315],
       ["Suburbia", 1986, 1317]
    ]],
    ["Actually", 1987, 1282, [
      ["It's a Sin", 1987, 1318],
      ["What Have I Done To Deserve This?", 1987, 1319],
      ["Rent", 1987, 1320],
      ["Heart", 1988, 1322],
    ]],
    ["Behaviour", 1990, 1285, [
      ["So Hard", 1990, 1326],
      ["Being Boring", 1990, 1327],
      ["Jealousy", 1991, 1329],
    ]],
    ["Very", 1993, 1287, [
      ["Can You Forgive Her?", 1993, 1333],
      ["Go West", 1993, 1334],
      ["I Wouldn't Normally Do This Kind Of Thing", 1993, 1335],
      ["Liberation", 1994, 1336],
      ["Yesterday, When I Was Mad", 1994, 1338],
    ]],
    ["Bilingual", 1996, 1291, [
      ["Before", 1996, 1340],
      ["Se a vida é (That's The Way Life Is)", 1996, 1341],
      ["Single-Bilingual", 1996, 1342],
      ["A Red Letter Day", 1997, 1343],
      ["Somewhere", 1997, 1344],
    ]],
    ["Nightlife", 1999, 1295, [
      ["I Don't Know What You Want But I Can't Give It Any More", 1999, 1345],
      ["New York City Boy",1999, 1346],
      ["You Only Tell Me You Love Me When You're Drunk", 2000, 1347],
    ]],
    ["Release", 2002, 1302, [
      ["Home And Dry", 2002, 1348],
      ["I Get Along", 2002, 1349],
      ["London", 2003, 1350],
    ]],
    ["Fundamental", 2006, 1305, [
      ["I'm With Stupid", 2006, 1353],
      ["Minimal", 2006, 1354],
      ["Numb", 2006, 1355],
      ["Integral", 2007, 1357],
    ]],
    ["Yes", 2009, 1311, [
      ["Love, etc.", 2009, 1358],
      ["Did You See Me Coming?", 2009, 1359],
      ["Beautiful People", 2009, 2123],
    ]],
  ],
  "album.ep": [
    ["Introspective", 1988, 1283, [
      ["Always On My Mind", 1987, 1321],
      ["Domino Dancing", 1988, 1323],
      ["Left To My Own Devices", 1988, 1324],
      ["It's Alright", 1988, 1325],
    ]],
  ],
});


////////////////////////////////////////////////////////////////////////////////
//// Artist

tb.wmsy.defineWidget({
  name: "artist-detail-view",
  doc: "Show an artist's albums with singles grouped by owning album.",
  constraint: {
    type: "artist-meta",
  },
  bus: ["albumSelected"],
  structure: {
    artistLabel: wy.bind(["artist", "name"]),
    albums: wy.subWidget({subpart: "album-list"}),
    singles: wy.subWidget({subpart: "singles-list"}),
  },
  style: {
    artistLabel: <>
      font-size: 200%;</>,
  }
});

tb.wmsy.defineWidget({
  name: "artist:album-list",
  doc: "List of albums by an artist.",
  constraint: {
    type: "artist-meta",
    subpart: "album-list",
  },
  structure: {
    albums: wy.widgetList({type: "album"}, "albums"),
  },
  emit: ["albumSelected"],
  events: {
    albums: {
      command: function(aAlbumWidget) {
        dump("clicked on " + aAlbumWidget + "\n");
        dump(" == album: " + aAlbumWidget.obj.name + "\n");
        //this.emit_albumSelected(aAlbumWidget.obj);
      }
    }
  }
});

tb.wmsy.defineWidget({
  name: "artist:singles-list",
  doc: "List of singles by an artist, grouped by their owning album.",
  constraint: {
    type: "artist-meta",
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
    attr: wy.WILD,
  },
  structure: {
    albums: wy.widgetList({type: "album"}, wy.fromConstraint("attr")),
  },
  style: {
    root: {
      _: <>
        display: inline-block;
        padding: 1em;
        border: 1px solid #fff;
        background-color: #bbb;</>,
      '[active="true"]': <>
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
    cover: wy.bindImage("imageUrl"),
    albumTitle: wy.bind("name"),
  },
  style: {
    root: <>
      display: inline-block;
      margin: 1em;</>,
    cover: <>
      display: block;
      width: 60px;
      height: 60px;
      background-color: #c88;</>,
    albumTitle: <>
      display: none;
      text-align: center;</>,
  }
});


tb.tabs.defineTabType({
  name: "wmsyMusicWowser",
  onTabOpened: function(tab, args) {
    tab.title = "Wowser!";

    let doc = tab.contentDocument;
    let emitter = tb.wmsy.wrapElement(doc.getElementById("content"));
try {
      emitter.emit({type: "artist-meta", obj: psbMeta});
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
  label: "Music Wowser",
  command: function() tb.tabs.openTab("wmsyMusicWowser", {})
});
