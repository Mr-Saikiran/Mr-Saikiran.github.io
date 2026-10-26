(function () {
  var root = document.documentElement;
  root.classList.add("js");

  // Theme: remember the visitor's choice, fall back to their OS preference.
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  root.setAttribute("data-theme", saved || (prefersLight ? "light" : "dark"));
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Typing effect for the hero tagline.
  var typed = document.getElementById("typed");
  if (typed) {
    var lines = (typed.getAttribute("data-lines") || "").split("|").filter(Boolean);
    var li = 0, ci = 0, deleting = false;
    (function tick() {
      if (!lines.length) return;
      var line = lines[li];
      typed.textContent = line.slice(0, ci);
      var delay = deleting ? 35 : 70;
      if (!deleting && ci === line.length) { deleting = true; delay = 1600; }
      else if (deleting && ci === 0) { deleting = false; li = (li + 1) % lines.length; delay = 300; }
      ci += deleting ? -1 : 1;
      setTimeout(tick, delay);
    })();
  }

  // Reveal sections as they scroll into view.
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  // Highlight the nav link for the section in view.
  var links = document.querySelectorAll(".nav nav a");
  if ("IntersectionObserver" in window && links.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  // Fill project cards with live repository details from the GitHub API.
  document.querySelectorAll(".project[data-repo]").forEach(function (card) {
    fetch("https://api.github.com/repos/" + card.getAttribute("data-repo"))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (repo) {
        if (!repo) return;
        if (repo.description) card.querySelector(".desc").textContent = repo.description;
        var meta = [];
        if (repo.language) meta.push(repo.language);
        meta.push("★ " + repo.stargazers_count);
        meta.push("⑂ " + repo.forks_count);
        card.querySelector(".meta").textContent = meta.join("  ·  ");
      })
      .catch(function () {});
  });

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
