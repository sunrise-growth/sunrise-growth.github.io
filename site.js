/* 旭禾山有限公司 sunrise-growth.com：四頁共用的一點點互動 */
(function () {
  "use strict";

  /* 問筊頁：功能分頁，切換手機畫面 */
  var tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute("aria-controls")); });

    var select = function (index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        var panel = panels[i];
        if (!panel) return;
        if (on) {
          if (panel.hidden) {
            panel.hidden = false;
            panel.classList.remove("is-entering");
            void panel.offsetWidth;
            panel.classList.add("is-entering");
          }
        } else {
          panel.hidden = true;
          panel.classList.remove("is-entering");
        }
      });
      if (focus) tabs[index].focus();
    };

    panels.forEach(function (panel, i) { if (panel && i !== 0) panel.hidden = true; });

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i, false); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next !== null) { event.preventDefault(); select(next, true); }
      });
    });

    /* 其他幾張圖先在背景載好，切換時不用等 */
    window.addEventListener("load", function () {
      panels.forEach(function (panel) {
        var img = panel && panel.querySelector("img[loading='lazy']");
        if (img) { var preload = new Image(); preload.src = img.currentSrc || img.src; }
      });
    });
  }

  /* 支援頁：題目可以收合；網址指到某一題時自動打開 */
  var questions = Array.prototype.slice.call(document.querySelectorAll("details.qa"));
  if (questions.length) {
    var openFromHash = function () {
      var id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      var target = document.getElementById(id);
      if (target && target.tagName === "DETAILS") {
        target.open = true;
        target.scrollIntoView();
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);

    var toggle = document.querySelector("[data-toggle-all]");
    if (toggle) {
      var refresh = function () {
        var allOpen = questions.every(function (d) { return d.open; });
        toggle.textContent = allOpen ? "全部收合" : "全部展開";
        toggle.setAttribute("aria-expanded", allOpen ? "true" : "false");
      };
      toggle.hidden = false;
      toggle.addEventListener("click", function () {
        var allOpen = questions.every(function (d) { return d.open; });
        questions.forEach(function (d) { d.open = !allOpen; });
        refresh();
      });
      questions.forEach(function (d) { d.addEventListener("toggle", refresh); });
      refresh();
    }
  }

  /* 支援頁、隱私權政策：目錄標出正在讀的段落 */
  var directory = document.querySelector(".directory");
  if (directory && "IntersectionObserver" in window) {
    var links = Array.prototype.slice.call(directory.querySelectorAll('a[href^="#"]'));
    var byId = {};
    links.forEach(function (link) { byId[link.getAttribute("href").slice(1)] = link; });
    var sections = links.map(function (link) { return document.getElementById(link.getAttribute("href").slice(1)); }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.removeAttribute("aria-current"); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(function (section) { observer.observe(section); });
  }
})();
