const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const createOrganizationPath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "(client)",
  "[org]",
  "welcome",
  "create-organization",
  "page.tsx"
);
const inviteModalPath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "(client)",
  "[org]",
  "_components",
  "invite-modal",
  "index.tsx"
);

const createOrganization = fs.readFileSync(createOrganizationPath, "utf8");
const inviteModal = fs.readFileSync(inviteModalPath, "utf8");

test("organization creation guards and disables duplicate submissions", () => {
  const handlerStart = createOrganization.indexOf(
    "const handleSubmit = async (event: React.FormEvent) =>"
  );
  const handlerEnd = createOrganization.indexOf("  return (", handlerStart);
  const handler = createOrganization.slice(handlerStart, handlerEnd);

  assert.ok(
    /const submitInProgressRef = useRef\(false\)/.test(createOrganization)
  );
  assert.ok(/if \(submitInProgressRef\.current\) return;/.test(handler));
  assert.ok(/submitInProgressRef\.current = true;/.test(handler));
  assert.ok(/disabled=\{buttonloading\}/.test(createOrganization));
  assert.ok(
    /finally\s*\{[\s\S]*submitInProgressRef\.current = false;/.test(handler)
  );
});

test("invitation sending guards and disables duplicate submissions", () => {
  const handlerStart = inviteModal.indexOf("const handleSubmit = async () =>");
  const handlerEnd = inviteModal.indexOf(
    "// One invite link per modal session",
    handlerStart
  );
  const handler = inviteModal.slice(handlerStart, handlerEnd);

  assert.ok(
    /const inviteSubmitInProgressRef = useRef\(false\)/.test(inviteModal)
  );
  assert.ok(/if \(inviteSubmitInProgressRef\.current\) return;/.test(handler));
  assert.ok(/inviteSubmitInProgressRef\.current = true;/.test(handler));
  assert.ok(/disabled=\{\s*buttonLoading \|\|/.test(inviteModal));
  assert.ok(
    /finally\s*\{[\s\S]*inviteSubmitInProgressRef\.current = false;/.test(
      handler
    )
  );
});
