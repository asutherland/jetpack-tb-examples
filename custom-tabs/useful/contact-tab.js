
/*
 * Display some info about the contact and then show their recent messages.  We
 *  define a lot of widgets here because we are standalone.
 */

const Cu = Components.utils;
Cu.import("resource://app/modules/gloda/public.js");
Components.utils.import("resource://app/modules/templateUtils.js");

let mt = tb.mwtl;
let dt = tb.decisionTree;

/**
 * Contact display, not in your address book.
 */
tb.mwtl.defineWidget({
  name: "identity-detail",
  constraint: {
    type: "gloda",
    noun: "identity",
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
tb.mwtl.subclassWidget("identity-detail", {
  name: "known-identity-detail",
  constraint: {
    type: "gloda",
    noun: "identity",
    detail: "high",
    obj: {
      inAddressBook: true
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
 * Unfriendly date.
 */
tb.mwtl.defineWidget({
  constraint: {
    type: "date",
    mode: "absolute",
  },
  // Just make a straight-forward span.
  structure: "",
  impl: {
    update: function() {
      this.domNode.textContent = this.obj.toLocaleString();
    }
  }
});

/**
 * Friendly date.
 */
tb.mwtl.defineWidget({
  constraint: {
    type: "date",
    mode: "friendly",
  },
  // Just make a straight-forward span.
  structure: "",
  impl: {
    update: function() {
      this.domNode.textContent = makeFriendlyDateAgo(this.obj);
    }
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
      date: wt.widget({type: "date", mode: "friendly", detail: "medium"},
                      "date"),
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
    root: {
      _:
        "display: block;\
        font-family: sans-serif;\
        font-size: small;\
        padding: 3px 0;\
        margin: 3px 0;\
        border-bottom: 1px solid #ddd;\
        color: #555;\
        background-color: #ffffff;",

      ":hover": {
        subject: "color: #000000; background-color: #e0eaf5;",
      }
    },
    subject: {
      ":hover": "color: #ffffff; background-color: #729fcf;",
      ":focus": "color: #ffffff; background-color: #729fcf;",
    }
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
  content: wt.bindAttribute("starred", "starred"),
  style: {

  }
});

tb.mwtl.defineWidget({
  name: "message-body",
  constraint: {
    type: "gloda",
    noun: "message",
    subpart: "body",
  },
});

tb.mwtl.defineWidget({
  name: "tag",
  constraint: {
    type: "gloda",
    noun: "tag",
  },
  content: wt.bind("tag"),
  style: {
    root:
      "display: inline-block; /* to avoid splitting 'To' and 'Do' e.g. */\
      -moz-margin-start: 0px;\
      -moz-margin-end: 3px;\
      padding: 0 0.5ex;\
      background-image: url('chrome://messenger/skin/tagbg.png');\
      -moz-border-radius: 3px;\
      border-style: outset;\
      border-width: 0.5px;\
      text-shadow: 0 1px 0 rgba(238,238,236,0.4); /* Tango Alumninum 1 */\
      color: #111111;"
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
