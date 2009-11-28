
/*
 * Display some info about the contact and then show their recent messages.  We
 *  define a lot of widgets here because we are standalone.
 */

/**
 * Contact display, not in your address book.
 */
tb.mwtl.defineWidget({
  constraint: {
    type: "gloda",
    noun: "contact",
    detail: "high",
  },
  content: "",

});

/**
 * Contact display, in your address book.
 */
tb.mwtl.defineWidget({
  constraint: {
    type: "gloda",
    noun: "contact",
    item: {
      identities: tb.mwtl.anyInArrayMatches({
        inAddressBook: true
      })
    }
  },
});

tb.mwtl.defineWidget({
  constraint: {

  },
});

/**
 * Message Display.
 */
tb.mwtl.defineWidget({
  constraint: {
    type: "gloda",
    noun: "message",
  },
  content: {
    root: <div>
        <div class="subject">{wt.bind("subject")}</div>
      </div>,
    altRoot: wt.parts(["subjectGroup", "authorGroup", "recipientsGroup",
                       "bodyGroup"]),
    subjectGroup: wt.parts["subject", "tags"],
    subject: wt.bind("subject"),
    tags: wt.widgetList({type: "gloda", noun: "tag"}),
    authorGroup: wt.widget({type: "gloda", noun: "identity", detail: "low"}),
    recipientsGroup: wt.widgetList({type: "gloda", noun: "identity",
                                    detail: "low"}),
    bodyGroup: "",
  },
  ctree: {
    subjectGroup: {},
    authorGroup: {},
    recipientsGroup: {},

  },
  action: {
    subject: {
      click: function() {

      }
    }
  },
});

tb.tabs.defineTabType({
  name: "simpleContact",
  onTabOpened: function(tab, args) {
    let doc = tab.contentDocument;
    let contact = args.contact;

    wtdoc(doc)
      .emit({type: "gloda", noun: "contact", detail: "high"},
            contact)

      .emit({type: "gloda", noun: "message"})
  },
  html: <>
  </>
});
