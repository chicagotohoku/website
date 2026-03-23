const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const sortButtons = Array.from(document.querySelectorAll("[data-sort]"));
const filterItems = Array.from(document.querySelectorAll("[data-tags]"));
const filterSections = Array.from(document.querySelectorAll("[data-section]"));
const archiveLists = Array.from(document.querySelectorAll(".archive-list"));
const yearBar = document.querySelector("[data-year-bar]");
let yearButtons = Array.from(document.querySelectorAll("[data-year]"));
let currentFilter = "all";
let currentSort = "desc";
let currentYear = "all";
const tagPalette = {
  all: { color: "#68727f", soft: "rgba(104, 114, 127, 0.10)" },
  event: { color: "#c07a68", soft: "rgba(192, 122, 104, 0.14)" },
  visit: { color: "#c49c5f", soft: "rgba(196, 156, 95, 0.14)" },
  award: { color: "#a9ab5f", soft: "rgba(169, 171, 95, 0.14)" },
  workshop: { color: "#7fa85f", soft: "rgba(127, 168, 95, 0.14)" },
  seminar: { color: "#5ea67a", soft: "rgba(94, 166, 122, 0.14)" },
  symposium: { color: "#58a59c", soft: "rgba(88, 165, 156, 0.14)" },
  startup: { color: "#5f95b6", soft: "rgba(95, 149, 182, 0.14)" },
  outreach: { color: "#6b81c4", soft: "rgba(107, 129, 196, 0.14)" },
  paper: { color: "#8373c4", soft: "rgba(131, 115, 196, 0.14)" },
  interaction: { color: "#a36fbe", soft: "rgba(163, 111, 190, 0.14)" },
  launch: { color: "#be6f9e", soft: "rgba(190, 111, 158, 0.14)" },
};

function getTagStyle(tag) {
  return tagPalette[tag] || { color: "#5b6472", soft: "rgba(91, 100, 114, 0.10)" };
}

function decorateFilters() {
  filterButtons.forEach((button) => {
    const tag = (button.dataset.filter || "all").toLowerCase();
    if (!button.dataset.label) {
      button.dataset.label = button.textContent.trim();
    }
    const style = getTagStyle(tag);
    button.style.setProperty("--chip-color", style.color);
    button.style.setProperty("--chip-soft", style.soft);
  });
}

function getItemYear(item) {
  return (item.dataset.date || "").slice(0, 4);
}

function buildYearButtons() {
  if (!yearBar) {
    return;
  }

  const years = Array.from(
    new Set(
      filterItems
        .map((item) => getItemYear(item))
        .filter(Boolean)
    )
  ).sort((a, b) => Number(b) - Number(a));

  years.forEach((year) => {
    const button = document.createElement("button");
    button.className = "year-chip";
    button.type = "button";
    button.dataset.year = year;
    button.setAttribute("aria-pressed", "false");
    button.textContent = year;
    yearBar.appendChild(button);
  });

  yearButtons = Array.from(document.querySelectorAll("[data-year]"));
}

function countItemsForYear(year) {
  return filterItems.filter((item) => {
    const tags = (item.dataset.tags || "")
      .split(/\s+/)
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    const itemYear = getItemYear(item);
    const matchesFilter = currentFilter === "all" || tags.includes(currentFilter);
    const matchesYear = year === "all" || itemYear === year;
    return matchesFilter && matchesYear;
  }).length;
}

function decorateItems() {
  filterItems.forEach((item) => {
    const tags = (item.dataset.tags || "")
      .split(/\s+/)
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    const stripeColors = tags.map((tag) => getTagStyle(tag).color);

    if (!stripeColors.length) {
      item.style.setProperty("--tag-stripe", tagPalette.all.color);
      return;
    }

    if (stripeColors.length === 1) {
      item.style.setProperty("--tag-stripe", stripeColors[0]);
      return;
    }

    item.style.setProperty("--tag-stripe", `linear-gradient(to bottom, ${stripeColors.join(", ")})`);
  });
}

function countItemsForFilter(filter) {
  return filterItems.filter((item) => {
    const tags = (item.dataset.tags || "")
      .split(/\s+/)
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    const itemYear = getItemYear(item);
    const matchesYear = currentYear === "all" || itemYear === currentYear;
    const matchesFilter = filter === "all" || tags.includes(filter);
    return matchesYear && matchesFilter;
  }).length;
}

function updateFilterCounts() {
  filterButtons.forEach((button) => {
    const filter = (button.dataset.filter || "all").toLowerCase();
    const label = button.dataset.label || button.textContent.trim();
    const count = countItemsForFilter(filter);
    button.textContent = `${label} (${count})`;
    button.classList.toggle("is-empty", count === 0);
    button.setAttribute("aria-disabled", count === 0 ? "true" : "false");
  });

  yearButtons.forEach((button) => {
    const year = button.dataset.year || "all";
    if (!button.dataset.label) {
      button.dataset.label = button.textContent.trim();
    }
    const label = button.dataset.label;
    const count = countItemsForYear(year);
    button.textContent = `${label} (${count})`;
    button.classList.toggle("is-empty", count === 0);
    button.setAttribute("aria-disabled", count === 0 ? "true" : "false");
  });
}

function applyVisibility() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  yearButtons.forEach((button) => {
    const isActive = button.dataset.year === currentYear;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  filterItems.forEach((item) => {
    const tags = (item.dataset.tags || "")
      .split(/\s+/)
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    const itemYear = getItemYear(item);
    const matchesTag = currentFilter === "all" || tags.includes(currentFilter);
    const matchesYear = currentYear === "all" || itemYear === currentYear;
    const isVisible = matchesTag && matchesYear;
    item.classList.toggle("is-hidden", !isVisible);
  });

  filterSections.forEach((section) => {
    const visibleItems = section.querySelectorAll("[data-tags]:not(.is-hidden)");
    section.classList.toggle("is-hidden", visibleItems.length === 0);
  });

  updateFilterCounts();
}

function applySort(direction) {
  currentSort = direction;
  sortButtons.forEach((button) => {
    const isActive = button.dataset.sort === direction;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  archiveLists.forEach((list) => {
    const items = Array.from(list.querySelectorAll(".archive-item"));
    items
      .sort((a, b) => {
        const aDate = Date.parse(a.dataset.date || "");
        const bDate = Date.parse(b.dataset.date || "");
        if (direction === "asc") {
          return aDate - bDate;
        }
        return bDate - aDate;
      })
      .forEach((item) => list.appendChild(item));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";
    currentFilter = button.classList.contains("is-active") ? "all" : filter;
    applyVisibility();
  });
});

buildYearButtons();

yearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const year = button.dataset.year || "all";
    currentYear = button.classList.contains("is-active") ? "all" : year;
    applyVisibility();
  });
});

sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.sort || "desc";
    applySort(direction);
  });
});

decorateFilters();
decorateItems();
applySort("desc");
applyVisibility();
