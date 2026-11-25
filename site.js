/* 旭禾山有限公司 sunrise-growth.com：八頁共用的一點點互動 */
(function () {
  "use strict";

  /* 首頁：導覽指向首頁段落的連結改成頁內捲動，不重新載入（中文首頁 index.html、英文首頁 index-en.html） */
  var self = document.body.getAttribute("data-self");
  if (self) {
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="' + self + '"]'), function (link) {
      if (link.classList.contains("lang-switch")) return;
      var rest = link.getAttribute("href").slice(self.length);
      if (rest === "" || rest.charAt(0) === "#") link.setAttribute("href", rest || "#top");
    });
  }

  /* 語言切換：另一種語言的同一頁用同樣的錨點，切換時帶著目前看到的段落或題目 */
  var langSwitch = document.querySelector(".lang-switch");
  if (langSwitch) {
    var base = langSwitch.getAttribute("href").split("#")[0];
    var follow = function () { langSwitch.setAttribute("href", base + (location.hash || "")); };
    follow();
    window.addEventListener("hashchange", follow);
  }

  /* 支援頁：題目可以收合；網址指到某一題時自動打開 */
  var questions = Array.prototype.slice.call(document.querySelectorAll("details.qa"));
  if (!questions.length) return;

  var openFromHash = function () {
    var id = decodeURIComponent(location.hash.slice(1));
    var target = id && document.getElementById(id);
    if (target && target.tagName === "DETAILS") {
      target.open = true;
      target.scrollIntoView();
    }
  };
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  var toggle = document.querySelector("[data-toggle-all]");
  if (!toggle) return;
  var allOpen = function () { return questions.every(function (d) { return d.open; }); };
  var refresh = function () {
    var open = allOpen();
    toggle.textContent = toggle.getAttribute(open ? "data-label-open" : "data-label-closed");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };
  toggle.hidden = false;
  toggle.addEventListener("click", function () {
    var open = !allOpen();
    questions.forEach(function (d) { d.open = open; });
    refresh();
  });
  questions.forEach(function (d) { d.addEventListener("toggle", refresh); });
  refresh();
})();
