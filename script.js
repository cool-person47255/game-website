(() => {
  "use strict";

  const menuToggle = document.querySelector("#menu-toggle");
  const mainNav = document.querySelector("#main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      mainNav.classList.toggle("open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        mainNav.classList.remove("open");
      });
    });
  }

  const searchInput = document.querySelector("#game-search");
  const filterButtons = [...document.querySelectorAll(".filter-chip")];
  const gameCards = [...document.querySelectorAll(".game-card")];
  const noResults = document.querySelector("#no-results");
  let activeFilter = "all";

  function filterGames() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    gameCards.forEach((card) => {
      const categoryMatches = activeFilter === "all" || card.dataset.category === activeFilter;
      const searchText = [card.dataset.search, card.textContent].join(" ").toLowerCase();
      const searchMatches = !query || searchText.includes(query);
      const visible = categoryMatches && searchMatches;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (noResults) noResults.hidden = visibleCount > 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach((other) => {
        const selected = other === button;
        other.classList.toggle("selected", selected);
        other.setAttribute("aria-pressed", String(selected));
      });
      filterGames();
    });
  });

  searchInput?.addEventListener("input", filterGames);

  const today = new Date();
  const dateElement = document.querySelector("#today-date");
  const yearElement = document.querySelector("#year");
  if (dateElement) {
    dateElement.textContent = today.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    }).toUpperCase();
  }
  if (yearElement) yearElement.textContent = String(today.getFullYear());
})();