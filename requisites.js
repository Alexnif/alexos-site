(() => {
  'use strict';
  const status = document.getElementById('copy-status');
  const fields = [...document.querySelectorAll('.requisite-row')];
  const allText = () => fields.map(row => `${row.querySelector('dt').textContent}: ${row.querySelector('.requisite-value').textContent}`).join('\n');
  const fallbackCopy = text => {
    const previous = document.activeElement;
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('aria-label', 'Реквизиты для копирования');
    input.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(input);
    input.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    input.remove();
    previous?.focus();
    if (!copied) throw new Error('Clipboard unavailable');
  };
  async function copy(text, message) {
    try {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
      } catch (_) { fallbackCopy(text); }
      status.textContent = message;
    } catch (_) {
      status.textContent = 'Не удалось скопировать автоматически. Выделите текст вручную или скачайте карточку .txt.';
    }
  }
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => copy(document.getElementById(button.dataset.copy).textContent, `${button.closest('.requisite-row').querySelector('dt').textContent}: скопировано`));
  });
  const all = document.getElementById('copy-all');
  all.hidden = false;
  all.addEventListener('click', () => copy(allText(), 'Все реквизиты скопированы'));
  const print = document.getElementById('print-requisites');
  print.hidden = false;
  print.addEventListener('click', () => window.print());
})();
