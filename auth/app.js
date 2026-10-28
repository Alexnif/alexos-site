(() => {
  "use strict";
  const status = document.getElementById("status");
  const request = document.getElementById("request");
  const button = document.getElementById("confirm");
  const intro = document.getElementById("intro");
  const heading = document.getElementById("heading");
  const fail = message => {status.textContent = message; request.hidden = true; intro.hidden = false;};
  const initData = window.WebApp?.initData;
  // This only chooses the screen. The server still verifies the signed launch.
  let start;
  try {
    const values = new URLSearchParams(initData || "");
    if (values.getAll("start_param").length > 1) {
      fail("Ссылка входа недействительна. Отсканируйте новый QR в рабочем кабинете.");
      return;
    }
    if (values.getAll("start_param").length === 1) start = values.get("start_param");
  } catch (_) {return;}
  if (!start) return;
  if (!/^login_[0-9a-f]{32}_[A-Za-z0-9_-]{43}$/.test(start)) {
    fail("Ссылка входа недействительна. Если вы сотрудник, отсканируйте новый QR в рабочем кабинете. Жители могут написать боту без входа здесь.");
    return;
  }
  intro.hidden = true;
  heading.textContent = "Вход сотрудника";
  status.textContent = "Проверяем запрос MAX…";
  const config = window.ALEXOS_MAX_AUTH;
  if (!config?.enabled || !config.apiBase) {
    fail("Переносим подтверждение входа на новый сервер. Пока используйте вход по коду в рабочем кабинете.");
    return;
  }
  let base;
  try {
    base = new URL(config.apiBase);
    if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash) throw new Error();
  } catch (_) {fail("Сервис подтверждения не настроен."); return;}
  const call = async (path, extra = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(new URL(`/max-login/${path}`, base), {
        method: "POST", credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({init_data: initData, ...extra}), signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Запрос отклонён.");
      return data;
    } finally {clearTimeout(timeout);}
  };
  let expires = 0;
  call("inspect").then(data => {
    expires = Date.parse(/(?:Z|[+-]\d{2}:\d{2})$/.test(data.expires_at) ? data.expires_at : `${data.expires_at}Z`);
    if (!Number.isFinite(expires) || Date.now() >= expires) throw new Error("Запрос истёк. Создайте новый QR.");
    document.getElementById("person").textContent = data.display_name;
    document.getElementById("label").textContent = data.request_label;
    status.textContent = "Проверьте запрос перед подтверждением";
    request.hidden = false;
  }).catch(error => fail(error.message || "Сервис недоступен. Попробуйте новый QR."));
  button.addEventListener("click", async () => {
    if (button.disabled) return;
    if (Date.now() >= expires) {fail("Запрос истёк. Создайте новый QR."); return;}
    button.disabled = true;
    try {
      await call("confirm", {confirm: true});
      fail("Вход подтверждён. Вернитесь к рабочему кабинету на компьютере.");
    } catch (error) {
      fail(error.message || "Не удалось подтвердить вход. Создайте новый QR.");
    }
  });
})();
