/* Keep the dated HTML snapshot when the public JSON is unavailable. */
(async () => {
  try {
    const response = await fetch("statistics.json", {cache: "no-cache", credentials: "omit"});
    if (!response.ok) return;
    const data = await response.json();
    const keys = ["localities", "streets", "houses", "accounts"];
    const date = new Date(data.generated_at);
    if (data.schema_version !== 1 || !Number.isFinite(date.getTime()) ||
        !keys.every(key => Number.isSafeInteger(data.counts?.[key]) && data.counts[key] >= 0)) return;
    const format = new Intl.NumberFormat("ru-RU");
    keys.forEach(key => {
      const element = document.querySelector(`[data-stat="${key}"]`);
      if (element) element.textContent = format.format(data.counts[key]);
    });
    const element = document.getElementById("statistics-date");
    if (element) {
      element.dateTime = date.toISOString();
      element.textContent = new Intl.DateTimeFormat("ru-RU", {
        day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Novokuznetsk"
      }).format(date);
    }
  } catch {
    // A temporary network failure must not replace real counts with zeroes.
  }
})();
