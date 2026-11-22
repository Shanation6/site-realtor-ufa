/* =========================================================
   Скрипты лендинга риелтора (без внешних зависимостей).
   1) Бургер-меню        4) Аккордеон FAQ
   2) Появление (.reveal)5) Форма заявки — JS-заглушка (alert)
   3) Анимация счётчиков
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Текущий год в футере ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 1. Бургер-меню ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("mainNav");

  function closeMenu() {
    if (!burger || !nav) return;
    burger.classList.remove("is-open");
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    // Закрываем меню при клике по ссылке (якорю)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Закрываем по Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- 2. Появление блоков при скролле (.reveal) ---------- */
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // анимируем один раз
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Фолбэк для старых браузеров — показываем сразу
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 3. Анимация счётчиков ---------- */
  var counters = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1600; // мс
    var start = null;

    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic для приятного замедления в конце
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  /* ---------- 4. Аккордеон FAQ ---------- */
  var accHeaders = document.querySelectorAll(".acc-header");

  accHeaders.forEach(function (header) {
    header.addEventListener("click", function () {
      var item = header.closest(".acc-item");
      var body = item.querySelector(".acc-body");
      var isOpen = item.classList.contains("is-open");

      // Закрыть остальные (одиночное раскрытие)
      document.querySelectorAll(".acc-item.is-open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          openItem.querySelector(".acc-header").setAttribute("aria-expanded", "false");
          var b = openItem.querySelector(".acc-body");
          b.style.maxHeight = null;
          b.hidden = true;
        }
      });

      // Переключить текущий
      if (isOpen) {
        item.classList.remove("is-open");
        header.setAttribute("aria-expanded", "false");
        body.style.maxHeight = null;
        body.hidden = true;
      } else {
        item.classList.add("is-open");
        header.setAttribute("aria-expanded", "true");
        body.hidden = false;
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  /* ---------- 5. Форма заявки — заглушка (без бэкенда) ---------- */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // сервера нет — не отправляем реально

      var name = form.elements["name"];
      var phone = form.elements["phone"];
      var valid = true;

      // Простая клиентская валидация
      [name, phone].forEach(function (field) {
        var wrap = field.closest(".field");
        if (!field.value.trim()) {
          wrap.classList.add("invalid");
          valid = false;
        } else {
          wrap.classList.remove("invalid");
        }
      });

      if (!valid) {
        alert("Пожалуйста, заполните имя и телефон.");
        return;
      }

      // Демо-подтверждение вместо реальной отправки
      alert("Заявка отправлена (демо). Спасибо, " + name.value.trim() + "! Я свяжусь с вами в ближайшее время.");
      form.reset();
    });

    // Убираем подсветку ошибки при вводе
    form.querySelectorAll("input").forEach(function (input) {
      input.addEventListener("input", function () {
        var wrap = input.closest(".field");
        if (wrap) wrap.classList.remove("invalid");
      });
    });
  }
})();
