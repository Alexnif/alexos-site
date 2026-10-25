(() => {
  "use strict";
  const status = document.getElementById("status");
  const request = document.getElementById("request");
  const button = document.getElementById("confirm");
  const fail = message => {status.textContent = message; request.hidden = true;};
  const config = window.ALEXOS_MAX_AUTH;
  if (!config?.enabled || !config.apiBase) {
    fail("Вход по QR пока не подключён. Используйте вход по коду в рабочем кабинете.");
    return;
  }
  let base;
  try {
    base = new URL(config.apiBase);
    if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash) throw new Error();
  } catch (_) {fail("Сервис подтверждения не настроен."); return;}
  const initData = window.WebApp?.initData;
  if (!initData) {fail("Откройте эту страницу через QR рабочего кабинета в приложении MAX."); return;}
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
