(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "cv-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  var storedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(storedTheme);

  var themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", function () {
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // Mobile nav toggle
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Print buttons
  ["print-btn", "print-btn-footer"].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", function () { window.print(); });
  });

  // Expand all timeline entries for a full printed CV, then restore state after.
  var openStateBeforePrint = [];
  window.addEventListener("beforeprint", function () {
    var details = document.querySelectorAll(".timeline-card");
    openStateBeforePrint = Array.prototype.map.call(details, function (d) { return d.open; });
    details.forEach(function (d) { d.open = true; });
  });
  window.addEventListener("afterprint", function () {
    var details = document.querySelectorAll(".timeline-card");
    details.forEach(function (d, i) { d.open = openStateBeforePrint[i]; });
  });

  // Active nav link highlighting on scroll
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".main-nav a");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();
})();
