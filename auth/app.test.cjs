const assert = require("node:assert/strict");
const {readFileSync} = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const source = readFileSync(require.resolve("./app.js"), "utf8");
const startParam = `login_${"a".repeat(32)}_${"b".repeat(43)}`;

async function loadPage(confirmResponse) {
  const elements = Object.fromEntries(["status", "request", "confirm", "intro", "heading", "person", "label"].map((id) => [id, {
    id,
    hidden: id === "request",
    disabled: false,
    textContent: "",
    listeners: {},
    addEventListener(name, listener) {this.listeners[name] = listener;},
  }]));
  const opened = [];
  const calls = [];
  const responses = [
    {ok: true, json: async () => ({
      display_name: "Оператор",
      request_label: "A1B2C3D4",
      expires_at: new Date(Date.now() + 60_000).toISOString(),
    })},
    confirmResponse,
  ];
  const context = {
    AbortController,
    URL,
    URLSearchParams,
    clearTimeout,
    console,
    document: {getElementById: (id) => elements[id]},
    fetch: async (...args) => {calls.push(args); return responses.shift();},
    setTimeout,
  };
  context.window = {
    ALEXOS_MAX_AUTH: {enabled: true, apiBase: "https://auth.alexos.ru"},
    WebApp: {
      initData: `start_param=${encodeURIComponent(startParam)}`,
      disableClosingConfirmation() {},
      openMaxLink(url) {opened.push(url);},
    },
    close() {},
    setTimeout,
  };
  vm.runInNewContext(source, context);
  await new Promise((resolve) => setImmediate(resolve));
  return {calls, elements, opened};
}

test("returns to the MAX chat only after a successful confirmation", async () => {
  const page = await loadPage({ok: true, json: async () => ({status: "confirmed"})});
  assert.equal(page.elements.request.hidden, false);
  await page.elements.confirm.listeners.click();
  assert.equal(page.calls.length, 2);
  assert.equal(page.elements.request.hidden, true);
  assert.deepEqual(page.opened, ["https://max.ru/id4246008141_bot"]);
  assert.match(page.elements.status.textContent, /Вход подтверждён/);
});

test("keeps the page open when confirmation fails", async () => {
  const page = await loadPage({ok: false, json: async () => ({detail: "Запрос отклонён."})});
  await page.elements.confirm.listeners.click();
  assert.deepEqual(page.opened, []);
  assert.equal(page.elements.intro.hidden, false);
  assert.equal(page.elements.status.textContent, "Запрос отклонён.");
});
