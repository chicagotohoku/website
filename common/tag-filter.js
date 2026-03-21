const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const filterItems = Array.from(document.querySelectorAll("[data-tags]"));
const filterSections = Array.from(document.querySelectorAll("[data-section]"));
const tagPalette = {
  all: { color: "#5b6472", soft: "rgba(91, 100, 114, 0.10)" },
  workshop: { color: "#d79a74", soft: "rgba(215, 154, 116, 0.14)" },
  seminar: { color: "#b9b86f", soft: "rgba(185, 184, 111, 0.14)" },
  symposium: { color: "#74b884", soft: "rgba(116, 184, 132, 0.14)" },
  startup: { color: "#74bbb1", soft: "rgba(116, 187, 177, 0.14)" },
  outreach: { color: "#79a9d6", soft: "rgba(121, 169, 214, 0.14)" },
  interaction: { color: "#8b8ad6", soft: "rgba(139, 138, 214, 0.14)" },
  launch: { color: "#c28ccf", soft: "rgba(194, 140, 207, 0.14)" },
  sendai: { color: "#6a52a0", soft: "rgba(106, 82, 160, 0.14)" },
  chicago: { color: "#9b4b5d", soft: "rgba(155, 75, 93, 0.14)" },
  tokyo: { color: "#4f8b85", soft: "rgba(79, 139, 133, 0.14)" },
  paper: { color: "#617083", soft: "rgba(97, 112, 131, 0.14)" },
};

function getTagStyle(tag) {
  return tagPalette[tag] || { color: "#5b6472", soft: "rgba(91, 100, 114, 0.10)" };
}

function decorateFilters() {
  filterButtons.forEach((button) => {
    const tag = (button.dataset.filter || "all").toLowerCase();
    const style = getTagStyle(tag);
    button.style.setProperty("--chip-color", style.color);
    button.style.setProperty("--chip-soft", style.soft);
  });
}

function decorateItems() {
  filterItems.forEach((item) => {
    const tags = (item.dataset.tags || "")
      .split(/\s+/)
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    const styles = tags.map(getTagStyle);
    const stripeColors = styles.map((style) => style.color);

    if (!stripeColors.length) {
      stripeColors.push(tagPalette.all.color);
    }

    const stop = 100 / stripeColors.length;
    const gradient = stripeColors
      .map((color, index) => {
        const start = (index * stop).toFixed(2);
        const end = ((index + 1) * stop).toFixed(2);
        return `${color} ${start}% ${end}%`;
      })
      .join(", ");

    item.style.setProperty("--tag-stripe", `linear-gradient(to bottom, ${gradient})`);
  });
}

function applyFilter(filter) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  filterItems.forEach((item) => {
    const tags = (item.dataset.tags || "")
      .split(/\s+/)
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    const isVisible = filter === "all" || tags.includes(filter);
    item.classList.toggle("is-hidden", !isVisible);
  });

  filterSections.forEach((section) => {
    const visibleItems = section.querySelectorAll("[data-tags]:not(.is-hidden)");
    section.classList.toggle("is-hidden", visibleItems.length === 0);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";
    const nextFilter = button.classList.contains("is-active") ? "all" : filter;
    applyFilter(nextFilter);
  });
});

decorateFilters();
decorateItems();
applyFilter("all");
