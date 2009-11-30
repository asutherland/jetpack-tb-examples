
/*
 * Display some info about the contact and then show their recent messages.  We
 *  define a lot of widgets here because we are standalone.
 */

const Cu = Components.utils;
Cu.import("resource://app/modules/gloda/public.js");

let mt = tb.mwtl;
let dt = tb.decisionTree;

/**
 * Contact display, not in your address book.
 */
tb.mwtl.defineWidget({
  name: "contact-detail",
  constraint: {
    type: "gloda",
    noun: "contact",
    detail: "high",
  },
  structure: wt.bind("name"),
  events: {
    click: wt.showActions(),
  }
});

/**
 * Contact display, in your address book.
 */
tb.mwtl.subclassWidget("contact-detail", {
  name: "known-contact-detail",
  constraint: {
    type: "gloda",
    noun: "contact",
    detail: "high",
    obj: {
      identities: dt.anyInArrayMatches({
        inAddressBook: true
      })
    }
  },
});

tb.mwtl.defineWidget({
  constraint: {

  },
});

tb.mwtl.defineWidget({
  constraint: {
    type: "gloda",
    noun: "identity",
    detail: "inline",
  },
  structure: wt.bind("contact", "name"),
  events: {
    click: wt.showActions(),
  }
});

/**
 * Message Display.
 */
tb.mwtl.defineWidget({
  name: "message",
  instanceId: "id",
  constraint: {
    type: "gloda",
    noun: "message",
  },
  // DOM/sub-widget structure
  structure: {
    subjectGroup: {
      star: wt.subWidget({subpart: "star"}),
      subject: wt.bind("subject"),
      tags: wt.widgetList({type: "gloda", noun: "tag"},
                          {bind: "tags"}),
    },
    authorGroup: {
      author: wt.widget({type: "gloda", noun: "identity", detail: "low"},
                        "from"),
      date: null,
    },
    recipientsGroup: wt.widgetList({type: "gloda", noun: "identity",
                                    detail: "low"}, "recipients"),
    bodyGroup: {
      snippet: wt.subWidget({subpart: "body"}),
      attachments: wt.subWidget({subpart: "attachments"})
    }
  },
  // styling
  style: {

  },
  // content

  // events
  events: {
    subject: {
      click: function() {

      }
    }
  },
  // implementation
  impl: {
    update: function() {

    }
  }
});

/**
 * The
 */
tb.mwtl.defineWidget({
  name: "message-star",
  constraint: {
    type: "gloda",
    noun: "message",
    subpart: "star",
  },
  styling: []
});

tb.mwtl.defineWidget({
  name: "message-body",
  constraint: {
    type: "gloda",
    noun: "message",
    subpart: "body",
  },
});

/**
 * Message collection display.
 *
 */
tb.mwtl.defineWidget({
  name: "simple-gloda-collection",
  kind: tb.mwtl.kCollection,
  constraint: {
    type: "gloda-collection",
    mode: "list",
  },
  structure: {
    countLabel: "${count} ${!noun.plural}",
    items: mt.widgetList({type: "gloda"}),
  },
  contextActions: {
    facetInclude: {
      label: "Show only in set NOP",
    },
    facetExclude: {
      label: "Exclude from displayed set NOP"
    },
  },
  // -- Implementation
  constructor: function(aArgs) {
    this.collection = aArgs.collection;
    this.collection.listener = this;

    this.onItemsAdded(this.collection.items, this.collection);
  },
  impl: {
    onItemsAdded: function(aItems) {
      this.items_addAll(aItems);
    },
    /**
     * Force the bindings of updated items to change.
     */
    onItemsModified: function(aItems) {
      this.items_updateAll(aItems);
    },
    /**
     * Remove bindings for items that no longer exist.
     */
    onItemsRemoved: function(aItems) {
      this.items_removeAll(aItems);
    },
    /**
     * If we showed an in-progress thing, we would stop doing that here.
     */
    onQueryCompleted: function() {
    }
  }
});

tb.tabs.defineTabType({
  name: "simpleContact",
  onTabOpened: function(tab, args) {
    let doc = tab.contentDocument;
    let contact = args.contact;

    let recentMsgQuery = Gloda.newQuery(Gloda.NOUN_MESSAGE);
    let recentMsgCollection = recentMsgQuery.getCollection();

    wt.wrap(doc)
      .emit({type: "gloda", noun: "contact", detail: "high", obj: contact})
      .emit({type: "gloda-collection", noun: "message", mode: "list",
             obj: recentMsgCollection});
  },
  html: <>
  </>
});
