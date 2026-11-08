(() => {
  "use strict";

  const counterId = 114131739;
  const storageKey = "alexos.analytics-consent.v1";
  const counterDisabledKey = `disableYaCounter${counterId}`;

  function enableCounter() {
    if (window.ym) return;
    window[counterDisabledKey] = false;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (let j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) return;
      }
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=" + counterId, "ym");

    window.ym(counterId, "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true
    });
  }

  function rememberChoice(choice) {
    try {
      localStorage.setItem(storageKey, choice);
    } catch {
      return;
    }
    if (choice === "yes") {
      enableCounter();
    } else {
      window[counterDisabledKey] = true;
      location.reload();
    }
    document.querySelector(".analytics-consent")?.remove();
  }

  function showPrompt() {
    if (document.querySelector(".analytics-consent")) return;
    const panel = document.createElement("section");
    panel.className = "analytics-consent";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", "analytics-consent-title");
    panel.innerHTML = `
      <div class="analytics-consent-copy">
        <strong id="analytics-consent-title">Аналитика посещений</strong>
        <p>Можно разрешить подсчёт визитов и источников переходов с помощью Яндекс Метрики. Настройки и состав данных описаны в <a href="privacy.html">политике конфиденциальности</a>.</p>
      </div>
      <div class="analytics-consent-actions">
        <button type="button" data-consent="yes">Разрешить аналитику</button>
        <button type="button" data-consent="no">Не разрешать</button>
      </div>`;
    panel.addEventListener("click", event => {
      const choice = event.target.closest("[data-consent]")?.dataset.consent;
      if (choice) rememberChoice(choice);
    });
    document.body.append(panel);
  }

  let choice = null;
  try {
    choice = localStorage.getItem(storageKey);
  } catch {
    showPrompt();
    return;
  }

  if (choice === "yes") enableCounter();
  else if (choice !== "no") showPrompt();

  document.addEventListener("click", event => {
    if (event.target.closest("[data-analytics-settings]")) showPrompt();
  });
})();
