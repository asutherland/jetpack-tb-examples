
/*
 * Show the contents of a gloda item on an attribute-provider by
 *  attribute-provider basis to help out in debugging.
 *
 * This jetpack reaches deep into the innards of gloda.  This is okay because it
 *  is a debugging tool and has a high probability of getting updated in the
 *  course of development of gloda so it doesn't break (for long).  It is not a
 *  good idea to copy this code.
 */

jetpack.future.import("menu");
jetpack.future.import("thunderbird.messageDisplay");
jetpack.future.import("thunderbird.tabs");

const Cu = Components.utils;
Cu.import("resource://app/modules/gloda/public.js");

let tb = jetpack.thunderbird;

tb.tabs.defineTabType({
  name: "debugGlodaItem",
  onTabOpened: function(tab, args) {
    let doc = tab.contentDocument;

    let itemNounDef = args.item.NOUN_DEF;
    let attribsByBoundName = itemNounDef.attribsByBoundName;

    let item = args.item;

    for each (let [, attrProvider] in
              Iterator(Gloda._attrProviderOrderByNoun)) {
      $("<h2 />", doc.body)
        .text(attrProvider.name)
        .appendTo(doc.body);
      let dl = $("<dl />", doc.body)
        .appendTo(doc.body);

      for each (let [, attrDef] in
                Iterator(Gloda._attrProviders[attrProvider.name])) {
        // Give the attribute/binding name
        $("<dt />", doc.body)
          .text(attrDef.bindName)
          .appendTo(dl);

        // - Stringify the value
        let dd = $("<dd />", doc.body)
          .appendTo(dl);

        // Missing
        if (!(attrDef.bindName in item)) {
          dd.text("Not Present").addClass("meta");
          continue;
        }
        let val = item[attrDef.bindName];
        // Null
        if (val == null) {
          dd.text("null").addClass("meta");
          continue;
        }

        // Singular just gets stringified
        if (attrDef.singular) {
          dd.text(val);
          continue;
        }

        // Explicitly call out empty lists
        if (!val.length) {
          dd.text("(empty list)").addClass("meta");
          continue;
        }

        // Stringify each item in an unordered list
        let ul = $("<ul />", doc.body)
          .appendTo(dd);
        for each (let [, subval] in Iterator(val)) {
          $("<li />", doc.body)
            .text(subval)
            .appendTo(ul);
        }
      }
    }
  },
  html: <>
    <style><![CDATA[
      .meta {
        font-style: italic;
        color: #444;
      }
    ]]></style>
    <body>
    </body>
  </>
});

function debug_gloda_message() {
  let msgHdr = tb.messageDisplay.displayedMsgHdr;
  Gloda.getMessageCollectionForHeader(msgHdr, {
    onQueryCompleted: function(aCollection) {
      // (Hold on to the collection.)
      if (aCollection.items.length)
        tb.tabs.openTab("debugGlodaItem", {item: aCollection.items[0],
                                           collection: aCollection});
    }
  });
}

jetpack.menu.otherActions.add({
  label: "debug gloda message",
  command: debug_gloda_message
});
