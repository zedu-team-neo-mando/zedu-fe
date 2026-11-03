import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SHIPPED_HASHTAG,
  captionTemplates,
  cardFields,
  trackerCsv,
} from "../shipped-on-zedu.ts";

describe("Shipped on Zedu", () => {
  it("uses one official hashtag on every caption", () => {
    const captions = captionTemplates({
      title: "Fixed: DM message box now shows the person's name",
      name: "Ada Okonkwo",
      track: "Frontend",
      cohort: "HNG 13",
      before: "The box said New message",
      after: "The box shows Ada",
    });

    assert.equal(captions.length, 3);
    assert.deepEqual(
      captions.map((caption) => caption.id),
      ["linkedin", "x", "portfolio"]
    );
    for (const caption of captions) {
      assert.match(caption.text, new RegExp(SHIPPED_HASHTAG));
      assert.match(caption.text, /DM message box/);
    }
    assert.match(captions[0].text, /Before: The box said New message/);
    assert.match(captions[1].text, /Frontend · HNG 13/);
  });

  it("fills a usable card when the form is still empty", () => {
    const card = cardFields({
      title: "  ",
      name: "",
      track: "",
      cohort: "",
      before: "",
      after: "",
    });
    assert.equal(card.name, "Your name");
    assert.equal(card.track, "Frontend");
    assert.doesNotMatch(
      captionTemplates({
        title: "",
        name: "",
        track: "",
        cohort: "",
        before: "",
        after: "",
      })[0].text,
      /Before:/
    );
  });

  it("exports a tracker sheet that quotes commas and quotes", () => {
    const csv = trackerCsv([
      {
        date: "2026-11-02",
        intern: 'Ada "Ayo" Okonkwo',
        track: "Frontend",
        cohort: "HNG 13",
        ticket: "Fixed: name, avatar",
        platform: "LinkedIn",
        postUrl: "www.linkedin.com/posts/example",
        likes: "12",
        reposts: "3",
        signups: "1",
      },
    ]);
    assert.match(csv, /^date,intern,track,cohort,ticket,platform,post_url/);
    assert.match(csv, /"Ada ""Ayo"" Okonkwo"/);
    assert.match(csv, /"Fixed: name, avatar"/);
  });
});
