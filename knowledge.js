(() => {
  const search = document.querySelector("#knowledge-search");
  const buttons = [...document.querySelectorAll("[data-filter]")];
  const entries = [...document.querySelectorAll(".law-entry")];
  const result = document.querySelector("#knowledge-result");
  const list = document.querySelector("#knowledge-list");
  let category = "all";

  const normalize = (value) => value.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").trim();

  const render = () => {
    const query = normalize(search.value);
    let visible = 0;
    entries.forEach((entry) => {
      const categories = entry.dataset.category.split(/\s+/);
      const haystack = normalize(`${entry.dataset.search} ${entry.textContent}`);
      const matchesCategory = category === "all" || categories.includes(category);
      const matchesQuery = !query || query.split(/\s+/).every((part) => haystack.includes(part));
      entry.hidden = !(matchesCategory && matchesQuery);
      if (!entry.hidden) visible += 1;
    });
    result.textContent = `Показано ${visible} ${visible === 1 ? "документ" : visible > 1 && visible < 5 ? "документа" : "документов"}`;
    let empty = list.querySelector(".knowledge-empty");
    if (!visible && !empty) {
      empty = document.createElement("p");
      empty.className = "knowledge-empty";
      empty.textContent = "По этому запросу пока нет материала. Попробуйте другое слово или выберите все темы.";
      list.append(empty);
    } else if (visible && empty) {
      empty.remove();
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.filter;
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });
  search.addEventListener("input", render);
  render();
})();
