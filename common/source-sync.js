async function syncArchiveSources() {
  if (window.location.protocol === "file:") {
    return;
  }

  const items = Array.from(document.querySelectorAll(".archive-item"));

  await Promise.all(
    items.map(async (item) => {
      const titleLink = item.querySelector(".archive-title-link");
      const linksContainer = item.querySelector(".archive-links");

      if (!titleLink || !linksContainer) {
        return;
      }

      let pageUrl;
      try {
        pageUrl = new URL(titleLink.getAttribute("href"), window.location.href);
      } catch {
        return;
      }

      if (pageUrl.origin !== window.location.origin) {
        return;
      }

      try {
        const response = await fetch(pageUrl.href, { credentials: "same-origin" });
        if (!response.ok) {
          return;
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const sourceLinks = Array.from(doc.querySelectorAll(".source-list a[href]"));

        if (!sourceLinks.length) {
          return;
        }

        const fragment = document.createDocumentFragment();
        sourceLinks.forEach((link) => {
          const anchor = document.createElement("a");
          anchor.href = link.href;
          anchor.target = "_blank";
          anchor.rel = "noreferrer";
          anchor.textContent = (link.textContent || "").trim();
          fragment.appendChild(anchor);
        });

        linksContainer.replaceChildren(fragment);
      } catch {
        // Keep authored links if fetch/parsing fails.
      }
    })
  );
}

syncArchiveSources();
