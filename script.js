(() => {
  "use strict";

  const sidebarToggle = document.querySelector("#sidebar-toggle");
  const sidebar = document.querySelector("#site-sidebar");
  const storage = {
    get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };
  const isMobile = () => window.matchMedia("(max-width: 760px)").matches;
  function applySidebarState(state) {
    document.body.classList.toggle("sidebar-collapsed", state === "collapsed" && !isMobile());
    document.body.classList.toggle("sidebar-mobile-expanded", state === "expanded" && isMobile());
    if (sidebarToggle) {
      sidebarToggle.setAttribute("aria-expanded", String(state === "expanded"));
      sidebarToggle.setAttribute("aria-label", state === "expanded" ? "Collapse sidebar" : "Expand sidebar");
      sidebarToggle.title = state === "expanded" ? "Collapse sidebar" : "Expand sidebar";
      const glyph = sidebarToggle.querySelector(".toggle-glyph");
      if (glyph) glyph.textContent = state === "expanded" ? "‹" : "›";
    }
  }
  let sidebarState = storage.get("spark-sidebar", "expanded");
  applySidebarState(sidebarState);
  sidebarToggle?.addEventListener("click", () => {
    sidebarState = sidebarState === "expanded" ? "collapsed" : "expanded";
    storage.set("spark-sidebar", sidebarState);
    applySidebarState(sidebarState);
  });
  window.addEventListener("resize", () => applySidebarState(sidebarState));

  const savedAccent = storage.get("spark-accent", "#C7FF00");
  document.documentElement.style.setProperty("--lime", savedAccent);
  document.querySelectorAll("[data-accent]").forEach((button) => {
    const selected = button.dataset.accent === savedAccent;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
    button.addEventListener("click", () => {
      const color = button.dataset.accent;
      document.documentElement.style.setProperty("--lime", color);
      storage.set("spark-accent", color);
      document.querySelectorAll("[data-accent]").forEach((other) => {
        const active = other === button;
        other.classList.toggle("selected", active);
        other.setAttribute("aria-pressed", String(active));
      });
    });
  });
  const savedTheme = storage.get("spark-theme", "dark");
  document.body.classList.toggle("theme-light", savedTheme === "light");
  document.querySelectorAll("[data-theme]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.theme === savedTheme));
    button.addEventListener("click", () => {
      const theme = button.dataset.theme;
      storage.set("spark-theme", theme);
      document.body.classList.toggle("theme-light", theme === "light");
      document.querySelectorAll("[data-theme]").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
    });
  });
  const savedSidebarDefault = storage.get("spark-sidebar-default", "expanded");
  document.querySelectorAll("[data-sidebar-default]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.sidebarDefault === savedSidebarDefault));
    button.addEventListener("click", () => {
      const preference = button.dataset.sidebarDefault;
      storage.set("spark-sidebar-default", preference);
      sidebarState = preference;
      storage.set("spark-sidebar", preference);
      applySidebarState(preference);
      document.querySelectorAll("[data-sidebar-default]").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
    });
  });
  const reducedMotionToggle = document.querySelector("#reduced-motion-setting");
  const savedReducedMotion = storage.get("spark-reduced-motion", "false") === "true";
  if (reducedMotionToggle) {
    reducedMotionToggle.checked = savedReducedMotion;
    document.body.classList.toggle("user-reduced-motion", savedReducedMotion);
    reducedMotionToggle.addEventListener("change", () => {
      storage.set("spark-reduced-motion", String(reducedMotionToggle.checked));
      document.body.classList.toggle("user-reduced-motion", reducedMotionToggle.checked);
    });
  }
  document.querySelectorAll(".site-sidebar .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobile()) {
        sidebarState = storage.get("spark-sidebar-default", "expanded");
        applySidebarState(sidebarState);
      }
    });
  });

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
  const hubDateElement = document.querySelector("#hub-date");
  if (dateElement) {
    dateElement.textContent = today.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    }).toUpperCase();
  }
  if (hubDateElement) hubDateElement.textContent = today.toLocaleDateString(undefined, { month: "short", day: "numeric" }).toUpperCase();
  if (yearElement) yearElement.textContent = String(today.getFullYear());
})();