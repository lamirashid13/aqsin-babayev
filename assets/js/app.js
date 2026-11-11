const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav, .site-nav');
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookie = document.querySelector('.cookie-accept');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const sectionTargets = {
    home: 'home',
    life: 'life',
    about: 'about',
    press: 'press',
    books: 'books-gallery',
    wisdom: 'wisdom',
    tributes: 'tributes',
    gallery: 'photo-gallery',
    contacts: 'contacts'
  };

  mainNav.querySelectorAll('a[data-section]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = sectionTargets[link.dataset.section];
      const target = targetId && document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth';

      target.scrollIntoView({ behavior, block: 'start' });
      if (window.location.hash !== `#${targetId}`) {
        window.history.pushState(null, '', `#${targetId}`);
      }
    });
  });
}

if (acceptCookie && cookieBanner) {
  acceptCookie.addEventListener('click', () => {
    cookieBanner.classList.add('is-hidden');
  });
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');
    if (!input || !button) return;

    if (!input.value.trim() || !input.checkValidity()) {
      input.focus();
      input.setCustomValidity('Please enter a valid email address.');
      input.reportValidity();
      return;
    }

    input.setCustomValidity('');
    const prevText = button.textContent;
    button.textContent = 'THANK YOU';
    button.disabled = true;
    input.value = '';

    setTimeout(() => {
      button.textContent = prevText;
      button.disabled = false;
    }, 1800);
  });

  newsletterForm.querySelector('input')?.addEventListener('input', (event) => {
    event.currentTarget.setCustomValidity('');
  });
}

const stats = document.querySelectorAll('[data-count]');

const animateCounter = (element) => {
  const target = Number(element.dataset.count || 0);
  const duration = 1400;
  const start = performance.now();

  const tick = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  stats.forEach((stat) => observer.observe(stat));
} else {
  stats.forEach((stat) => {
    stat.textContent = stat.dataset.count || '0';
  });
}

(() => {
  const data = window.siteData;
  if (!data) return;

  const textElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  };

  const timeline = document.querySelector("[data-timeline]:not([data-modal-timeline-events])");
  if (timeline && Array.isArray(data.timelineEvents)) {
    const filters = [...document.querySelectorAll("[data-timeline-filter]")];
    let activeDecade = "all";

    function renderTimeline() {
      const events = data.timelineEvents.filter((event) =>
        activeDecade === "all" || event.decade === activeDecade
      );
      const cards = events.map((event) => {
        const card = document.createElement("article");
        card.className = "archive-event";
        card.append(
          textElement("span", "archive-event-year", event.year),
          textElement("h2", "archive-event-title", event.title),
          textElement("p", "archive-event-description", event.description)
        );
        return card;
      });

      timeline.replaceChildren(...cards);
    }

    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        activeDecade = filter.dataset.timelineFilter || "all";
        filters.forEach((item) => {
          const selected = item === filter;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
        renderTimeline();
      });
    });

    renderTimeline();
  }

  const bookGrid = document.querySelector("[data-books-grid]");
  if (bookGrid && Array.isArray(data.books)) {
    const search = document.querySelector("[data-book-search]");
    const genre = document.querySelector("[data-book-genre]");
    const count = document.querySelector("[data-book-count]");

    function renderBooks() {
      const term = search?.value.trim().toLocaleLowerCase("az") || "";
      const selectedGenre = genre?.value || "all";
      const books = data.books.filter((book) => {
        const matchesText = `${book.title} ${book.description} ${book.genre}`
          .toLocaleLowerCase("az")
          .includes(term);
        return matchesText && (selectedGenre === "all" || book.genre === selectedGenre);
      });

      const cards = books.map((book) => {
        const card = document.createElement("article");
        card.className = "page-book-card";
        card.append(
          textElement("span", "page-card-category", book.genre),
          textElement("h2", "page-card-title", book.title),
          textElement("p", "page-card-description", book.description),
          textElement("span", "page-card-year", book.year)
        );
        return card;
      });

      bookGrid.replaceChildren(...cards);
      if (count) count.textContent = `${books.length} əsər`;
    }

    search?.addEventListener("input", renderBooks);
    genre?.addEventListener("change", renderBooks);
    renderBooks();
  }

  const bookTrack = document.getElementById("booksTrack");
  if (bookTrack && Array.isArray(data.bookCovers)) {
    const coverStyles = ["one", "two", "three", "four", "five", "six"];
    const cards = data.bookCovers.map((book, index) => {
      const card = document.createElement("article");
      card.className = "book-card";
      card.dataset.title = book.title;
      card.dataset.category = book.category;
      card.dataset.description = book.description;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "book-open";
      button.setAttribute("aria-label", `${book.title} haqqında`);

      const cover = document.createElement("div");
      cover.className = `book-cover cover-${coverStyles[index % coverStyles.length]}`;
      cover.append(
        textElement("span", "cover-index", `${String(index + 1).padStart(2, "0")} / ƏSƏR`)
      );

      const image = document.createElement("img");
      image.className = "book-cover-image";
      image.src = book.src;
      image.alt = `${book.title} kitabının üz qabığı`;
      cover.append(image);

      const info = document.createElement("div");
      info.className = "book-info";
      info.append(
        textElement("span", "book-category", book.category),
        textElement("h3", "", book.title),
        textElement("span", "book-discover", "Əsəri kəşf et ↗")
      );

      button.append(cover, info);
      card.append(button);
      return card;
    });

    bookTrack.replaceChildren(...cards);
  }

  const gallery = document.querySelector("[data-gallery-grid]");
  if (gallery && Array.isArray(data.gallery)) {
    const filter = document.querySelector("[data-gallery-filter]");
    const lightbox = document.querySelector("[data-lightbox]");
    const lightboxImage = lightbox?.querySelector("img");
    const lightboxTitle = lightbox?.querySelector("[data-lightbox-title]");
    const lightboxCount = lightbox?.querySelector("[data-lightbox-count]");
    const lightboxClose = lightbox?.querySelector("[data-lightbox-close]");
    let visibleItems = [];
    let previousFocus = null;

    function closeLightbox() {
      if (!lightbox || !lightboxImage) return;

      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImage.removeAttribute("src");
      document.body.style.overflow = "";
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    }

    function openLightbox(item, index, button) {
      if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxCount) return;

      previousFocus = button;
      lightboxImage.src = button.querySelector("img").src;
      lightboxImage.alt = item.alt;
      lightboxTitle.textContent = item.title;
      lightboxCount.textContent =
        `${String(index + 1).padStart(2, "0")} / ${String(visibleItems.length).padStart(2, "0")}`;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightboxClose?.focus();
    }

    function renderGallery() {
      const category = filter?.value || "all";
      visibleItems = data.gallery.filter((item) =>
        category === "all" || item.category === category
      );

      const cards = visibleItems.map((item, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "gallery-card";
        button.setAttribute("aria-label", `${item.title} — böyüt`);

        const image = document.createElement("img");
        image.src = document.body.dataset.page
          ? `../${item.src}`
          : item.src;
        image.alt = item.alt;

        button.append(
          image,
          textElement("span", "gallery-card-category", item.category),
          textElement("span", "gallery-card-title", item.title)
        );
        button.addEventListener("click", () => openLightbox(item, index, button));
        return button;
      });

      gallery.replaceChildren(...cards);
    }

    filter?.addEventListener("change", renderGallery);
    lightboxClose?.addEventListener("click", closeLightbox);
    lightbox?.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
        closeLightbox();
      }
    });
    renderGallery();
  }

  const wisdomQuotes = document.querySelector("#wisdomQuotes");
  if (wisdomQuotes && Array.isArray(data.quotes)) {
    const quotes = data.quotes.slice(0, 10).map((item, index) => {
      const quote = document.createElement("article");
      quote.className = `wisdom-quote${index === 0 ? " is-active" : ""}`;
      quote.dataset.index = String(index);

      const blockquote = textElement("blockquote", "", item.text);
      const divider = document.createElement("div");
      divider.className = "wisdom-quote-divider";
      quote.append(
        blockquote,
        divider,
        textElement("p", "wisdom-author", item.source),
        textElement("span", "wisdom-author-role", "Yazıçı və dramaturq")
      );
      return quote;
    });

    wisdomQuotes.replaceChildren(...quotes);
  }
})();

(() => {
  const list = document.getElementById("aq90ChronologyList");
  const events = window.siteData?.biographyChronology;

  if (!list || !Array.isArray(events)) return;

  const cards = events.map((event, index) => {
    const card = document.createElement("article");
    card.className = "aq90-chronology-item";
    card.id = `aq90ChronologyEvent${index + 1}`;

    const date = document.createElement("span");
    date.className = "aq90-chronology-date";
    date.textContent = event.date;

    const description = document.createElement("p");
    description.className = "aq90-chronology-description";
    description.textContent = event.description;

    const divider = document.createElement("div");
    divider.className = "aq90-chronology-divider";
    divider.setAttribute("aria-hidden", "true");

    card.append(date, description, divider);
    return card;
  });

  list.replaceChildren(...cards);
})();

window.Aq90Chronology = (() => {
  const openButton = document.getElementById("openTimeline");
  const overlay = document.getElementById("aq90ChronologyOverlay");
  const modal = document.getElementById("aq90ChronologyModal");
  const closeButton = document.getElementById("aq90ChronologyClose");
  const scrollArea = document.getElementById("aq90ChronologyScroll");
  let previousFocus = null;
  let previousBodyOverflow = "";

  if (!openButton || !overlay || !modal || !closeButton || !scrollArea) return null;

  function open() {
    previousFocus = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    scrollArea.scrollTop = 0;
    overlay.dataset.open = "true";
    overlay.setAttribute("aria-hidden", "false");
    closeButton.focus();
  }

  function close() {
    overlay.dataset.open = "false";
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousBodyOverflow;
    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  openButton.addEventListener("click", (event) => {
    event.preventDefault();
    open();
  });

  closeButton.addEventListener("click", close);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.dataset.open === "true") close();
  });

  return { open, close };
})();


document.addEventListener("DOMContentLoaded", () => {
  const archiveTimeline = document.querySelector(".archive-timeline");
  if (!archiveTimeline) return;

  const cards = [...archiveTimeline.querySelectorAll("[data-legacy-target]")];
  const panels = [...archiveTimeline.querySelectorAll(".legacy-detail")];
  const overlay = archiveTimeline.querySelector(".legacy-details");
  if (!cards.length || !panels.length || !overlay) return;

  let activePanel = null;
  let returnFocus = null;
  let previousBodyOverflow = "";

  function closePanel(shouldReturnFocus = true) {
    if (!activePanel) return;

    activePanel.hidden = true;
    const activeCard = cards.find(
      (card) => card.dataset.legacyTarget === activePanel.id
    );
    activeCard?.setAttribute("aria-expanded", "false");
    activePanel = null;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousBodyOverflow;

    if (shouldReturnFocus && returnFocus instanceof HTMLElement) {
      returnFocus.focus();
    }
    returnFocus = null;
  }

  function openPanel(card, panel) {
    if (activePanel) closePanel(false);

    activePanel = panel;
    returnFocus = card;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.hidden = false;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.tabIndex = -1;
    card.setAttribute("aria-expanded", "true");
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    const focusDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 300;
    window.setTimeout(() => {
      if (activePanel === panel) {
        panel.querySelector(".legacy-detail-close")?.focus();
      }
    }, focusDelay);
  }

  archiveTimeline.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const closeButton = event.target.closest("[data-close-legacy]");
    if (closeButton && overlay.contains(closeButton)) {
      closePanel();
      return;
    }

    const card = event.target.closest("[data-legacy-target]");
    if (card && archiveTimeline.contains(card)) {
      const panel = panels.find((item) => item.id === card.dataset.legacyTarget);
      if (!panel) return;

      if (activePanel === panel) {
        closePanel();
      } else {
        openPanel(card, panel);
      }
    }
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (!activePanel) return;

    if (event.key === "Escape") {
      closePanel();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [
      ...activePanel.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ];
    if (!focusable.length) {
      event.preventDefault();
      activePanel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeIndex = focusable.indexOf(document.activeElement);
    if (activeIndex === -1) {
      event.preventDefault();
      overlay.getBoundingClientRect();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && activeIndex === 0) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeIndex === focusable.length - 1) {
      event.preventDefault();
      first.focus();
    }
  });
});

(() => {
  const grid = document.getElementById("photoGalleryGrid");
  const previous = document.getElementById("photoGalleryPrev");
  const next = document.getElementById("photoGalleryNext");
  const count = document.getElementById("photoGalleryCount");
  const progress = document.getElementById("photoGalleryProgress");
  if (!grid || !previous || !next || !count || !progress) return;

  const lightbox = document.getElementById("photoGalleryLightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxTitle = document.getElementById("photoGalleryLightboxTitle");
  const lightboxCount = document.getElementById("photoGalleryLightboxCount");
  const lightboxClose = document.getElementById("photoGalleryLightboxClose");
  let previousFocus = null;
  let previousBodyOverflow = "";

  const captions = [
    { title: "Uşaqlıq illərindən xatirə", category: "ARXİV", alt: "İki oğlan uşağının ağ-qara arxiv fotosu" },
    { title: "Gənclik dostları ilə", category: "ARXİV", alt: "Gənc Aqşin Babayev dostları ilə birlikdə" },
    { title: "Söhbət zamanı", category: "GÖRÜŞ", alt: "Aqşin Babayev gənc yaşlarında bir nəfərlə söhbət edir" },
    { title: "Gənclik illərindən xatirə", category: "ARXİV", alt: "Gənc Aqşin Babayev iki dostu ilə arxiv fotosunda" },
    { title: "Yaxınları ilə xatirə fotosu", category: "XATİRƏ", alt: "Aqşin Babayev və yaxınları arxiv fotosunda" },
    { title: "Sənət dostu ilə", category: "GÖRÜŞ", alt: "Aqşin Babayev yaşlı sənət dostu ilə yanaşı dayanıb" },
    { title: "Azərbaycan bayrağı önündə", category: "FƏALİYYƏT", alt: "Aqşin Babayev Azərbaycan bayrağının yanında dayanıb" },
    { title: "Rəsmi tədbirdə", category: "TƏDBİR", alt: "Aqşin Babayev tədbirdə qonaqlarla söhbət edir" },
    { title: "Görüş zamanı", category: "GÖRÜŞ", alt: "Aqşin Babayev rəsmi görüşdə qonaqla əl sıxır" },
    { title: "Rəsmi portret", category: "PORTRET", alt: "Aqşin Babayev rəsmi geyimdə Azərbaycan bayrağının qarşısında" },
    { title: "Şəhər mənzərəsi", category: "XATİRƏ", alt: "Aqşin Babayev şəhərə yuxarıdan baxarkən" },
    { title: "Rəsmi görüşdən xatirə", category: "TƏDBİR", alt: "Aqşin Babayev qonaqlarla rəsmi görüşdə" },
    { title: "Ədəbi irs tədbirində", category: "ƏDƏBİ İRS", alt: "Aqşin Babayev yazıçı portretinin önündə keçirilən tədbirdə" },
    { title: "Həmkarı ilə söhbət", category: "GÖRÜŞ", alt: "Aqşin Babayev bir həmkarı ilə masa arxasında söhbət edir" },
    { title: "Kollektivlə birlikdə", category: "ARXİV", alt: "Aqşin Babayevin də yer aldığı ağ-qara kollektiv fotosu" },
    { title: "Sənət dostu ilə", category: "GÖRÜŞ", alt: "Aqşin Babayev yaşlı ziyalı ilə birlikdə" },
    { title: "Həmkarı ilə açıq havada", category: "XATİRƏ", alt: "Aqşin Babayev həmkarı ilə açıq havada dayanıb" },
    { title: "Rəsmi qəbuldan xatirə", category: "TƏDBİR", alt: "Aqşin Babayev bir ziyalı ilə xatirə fotosunda" },
    { title: "Həmkarı ilə xatirə fotosu", category: "XATİRƏ", alt: "Aqşin Babayev kostyumlu həmkarı ilə yanaşı dayanıb" },
    { title: "Tədbir zalında", category: "TƏDBİR", alt: "Aqşin Babayev tədbirdə qonaqlarla birlikdə" },
    { title: "Tədbirdən xatirə", category: "TƏDBİR", alt: "Aqşin Babayev qadın qonaqlarla xatirə fotosunda" },
    { title: "Rəsmi görüş", category: "GÖRÜŞ", alt: "Aqşin Babayev qonaqlarla koridorda söhbət edir" },
    { title: "Gənclik dostları ilə", category: "ARXİV", alt: "Aqşin Babayev gəncliyində dostu ilə ağ-qara açıq hava fotosunda" },
    { title: "Sənət dostu ilə", category: "XATİRƏ", alt: "Aqşin Babayev yaşlı ziyalı ilə birlikdə" },
    { title: "Rəsmi görüşdən xatirə", category: "TƏDBİR", alt: "Aqşin Babayev tədbirdə bir ziyalı ilə" },
    { title: "Dostlarla bir arada", category: "GÖRÜŞ", alt: "Aqşin Babayev dostları ilə masa arxasında" },
    { title: "Təltif mərasimindən xatirə", category: "TƏDBİR", alt: "Aqşin Babayevə tədbirdə gül təqdim olunur" },
    { title: "Xatirə fotosu", category: "ARXİV", alt: "Aqşin Babayev başqa bir ziyalı ilə arxiv fotosunda" },
    { title: "Gündəlik həyatdan xatirə", category: "XATİRƏ", alt: "Aqşin Babayev kafedə masa arxasında əyləşib" }
  ];
  const items = captions.map((photo, index) => ({
    ...photo,
    src: `assets/images/gallery/pt${index + 1}.jpg`
  }));
  const pageSize = 4;
  const pageCount = Math.ceil(items.length / pageSize);
  let currentPage = 0;
  const captionText = (className, text) => {
    const element = document.createElement("span");
    element.className = className;
    element.textContent = text;
    return element;
  };

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    document.body.style.overflow = previousBodyOverflow;
    previousFocus?.focus();
  }

  function openLightbox(item, index, trigger) {
    if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxCount || !lightboxClose) return;

    previousFocus = trigger;
    previousBodyOverflow = document.body.style.overflow;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxTitle.textContent = item.title;
    lightboxCount.textContent =
      `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function renderPage() {
    const start = currentPage * pageSize;
    const cards = items.slice(start, start + pageSize).map((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "photo-gallery-card";
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", `${item.title} — böyüt`);
      figure.tabIndex = 0;

      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt;

      const caption = document.createElement("figcaption");
      caption.append(
        captionText("photo-gallery-category", item.category),
        captionText("photo-gallery-title", item.title)
      );
      figure.append(image, caption);
      figure.addEventListener("click", () => openLightbox(item, start + index, figure));
      figure.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(item, start + index, figure);
        }
      });
      return figure;
    });

    grid.replaceChildren(...cards);
    const end = Math.min(start + pageSize, items.length);
    count.textContent =
      `${String(start + 1).padStart(2, "0")}–${String(end).padStart(2, "0")} / ${items.length}`;
    progress.style.width = `${((currentPage + 1) / pageCount) * 100}%`;
    previous.disabled = currentPage === 0;
  }

  previous.addEventListener("click", () => {
    if (currentPage === 0) return;
    currentPage -= 1;
    renderPage();
  });

  next.addEventListener("click", () => {
    currentPage = (currentPage + 1) % pageCount;
    renderPage();
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  renderPage();
})();

(() => {
  const track = document.getElementById("booksTrack");
  const prev = document.getElementById("booksPrev");
  const next = document.getElementById("booksNext");
  const progress = document.getElementById("galleryProgress");
  const count = document.getElementById("galleryCount");

  const modal = document.getElementById("bookModal");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalDescription = document.getElementById("modalDescription");

  if (
    !track || !prev || !next || !modal || !modalClose ||
    !modalTitle || !modalCategory || !modalDescription
  ) return;

  const cards = [...track.querySelectorAll(".book-card")];
  let lastFocused = null;
  let requestedScrollLeft = track.scrollLeft;

  function getStep() {
    const card = cards[0];
    if (!card) return 300;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function updateGallery(scrollLeft = track.scrollLeft) {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const ratio = maxScroll > 0 ? scrollLeft / maxScroll : 0;

    if (progress) {
      progress.style.width =
        `${Math.max(16.67, Math.min(100, 16.67 + ratio * 83.33))}%`;
    }

    const step = getStep();
    const current = Math.min(
      cards.length,
      Math.max(1, Math.round(scrollLeft / step) + 1)
    );

    if (count) {
      count.textContent =
        `${String(current).padStart(2, "0")} — ${String(cards.length).padStart(2, "0")}`;
    }

    prev.disabled = scrollLeft <= 2;
    next.disabled = scrollLeft >= maxScroll - 2;

    prev.style.opacity = prev.disabled ? ".4" : "1";
    next.style.opacity = next.disabled ? ".4" : "1";
  }

  function scrollGallery(direction) {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    requestedScrollLeft = Math.min(
      maxScroll,
      Math.max(0, requestedScrollLeft + direction * getStep())
    );
    track.scrollTo({ left: requestedScrollLeft, behavior });
    updateGallery(requestedScrollLeft);
  }

  prev.addEventListener("click", () => {
    scrollGallery(-1);
  });

  next.addEventListener("click", () => {
    scrollGallery(1);
  });

  track.addEventListener("scroll", () => {
    requestedScrollLeft = track.scrollLeft;
    updateGallery();
  }, { passive: true });
  window.addEventListener("resize", () => {
    requestedScrollLeft = track.scrollLeft;
    updateGallery();
  });
  updateGallery();

  function openBook(card) {
    lastFocused = document.activeElement;

    modalTitle.textContent = card.dataset.title || "Aqşin Babayev";
    modalCategory.textContent = card.dataset.category || "Ədəbi irs";
    modalDescription.textContent =
      card.dataset.description || "Əsər haqqında məlumat hazırlanır.";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    modalClose.focus();
  }

  function closeBook() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  track.querySelectorAll(".book-card").forEach(card => {
    const button = card.querySelector(".book-open");
    if (button) button.addEventListener("click", () => openBook(card));
  });

  modalClose.addEventListener("click", closeBook);

  modal.querySelectorAll("[data-close-modal]").forEach(element => {
    element.addEventListener("click", closeBook);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeBook();
    }
  });
})();

(() => {
  const section = document.getElementById("wisdom");
  if (!section) return;

  const quotes = [
    ...section.querySelectorAll(".wisdom-quote")
  ];

  const prev = section.querySelector("#wisdomPrev");
  const next = section.querySelector("#wisdomNext");
  const number = section.querySelector("#wisdomNumber");
  const count = section.querySelector("#wisdomCount");
  const progress = section.querySelector("#wisdomProgress");

  if (!quotes.length || !prev || !next || !number || !count || !progress) return;

  let current = 0;

  function showQuote(index) {
    current = (index + quotes.length) % quotes.length;

    quotes.forEach((quote, i) => {
      quote.classList.toggle("is-active", i === current);
    });

    number.textContent = String(current + 1).padStart(2, "0");

    count.textContent =
      `${String(current + 1).padStart(2, "0")} / ${String(quotes.length).padStart(2, "0")}`;

    progress.style.width =
      `${((current + 1) / quotes.length) * 100}%`;
  }

  prev.addEventListener("click", () => {
    showQuote(current - 1);
  });

  next.addEventListener("click", () => {
    showQuote(current + 1);
  });

  showQuote(0);
})();

(() => {
  const section = document.getElementById("tributes");
  if (!section) return;

  const items = [
    {
      quote: "Obyektiv, dürüst və ciddi, öz ölçüləri olan insan idi.",
      name: "Qulu Məhərəmli",
      role: "Jurnalist və teletənqidçi",
      initials: "QM",
      source: "https://modern.az/news/243266/"
    },
    {
      quote: "Sizi heç vaxt unutmayacağam, Ustad! Məzarınız nurlu olsun, nurlu İNSAN!",
      name: "Xatirə Hüseynova",
      role: "Filologiya üzrə fəlsəfə doktoru, dosent",
      initials: "XH",
      source: "https://kaspi.az/az/hardan-gelib-hara-getdi-bu-iller"
    },
    {
      quote: "İntellektual və kübar.",
      name: "Xaqani Səfəroğlu",
      role: "Azpost.info internet qəzetinin baş redaktoru",
      initials: "XS",
      source: "https://kaspi.az/az/hardan-gelib-hara-getdi-bu-iller"
    }
  ];

  const quote = section.querySelector("#tributeQuote");
  const name = section.querySelector("#tributeName");
  const role = section.querySelector("#tributeRole");
  const avatar = section.querySelector("#tributeAvatar");
  const source = section.querySelector("#tributeSource");
  const index = section.querySelector("#tributeIndex");
  const prev = section.querySelector("#tributePrev");
  const next = section.querySelector("#tributeNext");
  const card = section.querySelector("#tributeCard");

  if (!quote || !name || !role || !avatar || !source || !index ||
      !prev || !next || !card) return;

  let current = 0;

  function showItem(newIndex) {
    current = (newIndex + items.length) % items.length;
    const item = items[current];

    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "";

    quote.textContent = item.quote;
    name.textContent = item.name;
    role.textContent = item.role;
    avatar.textContent = item.initials;
    source.href = item.source;
    index.textContent =
      `${String(current + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
  }

  prev.addEventListener("click", () => showItem(current - 1));
  next.addEventListener("click", () => showItem(current + 1));

  showItem(0);
})();

document.addEventListener("DOMContentLoaded", () => {
    const openButton = document.getElementById("openAboutModal");
    const modal = document.getElementById("aboutModal");

    if (!openButton && !modal) return;

    if (!openButton || !modal) {
        console.error("ƏTRAFLI düyməsi və ya aboutModal tapılmadı.");
        return;
    }

    const closeButton = modal.querySelector(
        ".modal-close, .close-modal, [data-close-modal]"
    );
    let previousFocus = null;

    function openModal() {
        previousFocus = document.activeElement;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeButton?.focus();
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    openButton.addEventListener("click", openModal);

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            modal.classList.contains("is-open")
        ) {
            closeModal();
        }
    });
});

(() => {
  const section = document.querySelector("#research");
  const openButton = document.getElementById("open-research");
  const modal = document.getElementById("topics-modal");
  const closeButton = document.getElementById("close-research");
  const detailModal = document.getElementById("research-detail-modal");
  const detailCloseButton = document.getElementById("close-detail");
  const detailTitle = document.getElementById("research-detail-title");
  const detailText = document.getElementById("research-detail-text");
  const detailWorks = document.getElementById("research-detail-works");

  if (!section || !openButton || !modal || !closeButton) {
    console.error("Tədqiqat düyməsi və ya modal elementləri tapılmadı.");
    return;
  }

  const details = window.siteData?.researchDetails || {};

  let returnFocus = null;
  let detailReturnFocus = null;
  let previousOverflow = "";
  let scrollLocked = false;

  function lockScroll() {
    if (scrollLocked) return;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    scrollLocked = true;
  }

  function restoreScroll() {
    if (!scrollLocked) return;
    document.body.style.overflow = previousOverflow;
    scrollLocked = false;
  }

  function showModal(target) {
    target.hidden = false;
    target.setAttribute("aria-hidden", "false");
  }

  function hideModal(target) {
    target.hidden = true;
    target.setAttribute("aria-hidden", "true");
  }

  function openTopics() {
    if (!modal.hidden) return;
    returnFocus = document.activeElement;
    lockScroll();
    showModal(modal);
    closeButton.focus();
  }

  function closeTopics() {
    if (modal.hidden) return;
    if (detailModal && !detailModal.hidden) hideModal(detailModal);
    hideModal(modal);
    restoreScroll();
    if (returnFocus && typeof returnFocus.focus === "function") {
      returnFocus.focus();
    }
  }

  function openDetail(key, button) {
    const item = details[key];
    if (!item || !detailModal || !detailCloseButton || !detailTitle || !detailText || !detailWorks) {
      return;
    }

    detailReturnFocus = button;
    detailTitle.textContent = item.title;
    detailText.replaceChildren();
    detailWorks.replaceChildren();
    detailWorks.hidden = true;

    if (Array.isArray(item.chapters)) {
      if (item.relatedWork) {
        const relatedWork = document.createElement("p");
        relatedWork.className = "research-related-work";
        relatedWork.textContent = item.relatedWork;
        detailText.append(relatedWork);
      }

      item.chapters.forEach((chapter) => {
        const section = document.createElement("section");
        section.className = "research-narrative-entry";

        const heading = document.createElement("h3");
        heading.textContent = chapter.heading;
        section.append(heading);

        chapter.text.split(/\n\n+/).forEach((paragraphText) => {
          const paragraph = document.createElement("p");
          paragraph.textContent = paragraphText;
          section.append(paragraph);
        });

        detailText.append(section);
      });
    } else if (Array.isArray(item.boxes)) {
      const boxes = item.boxes.map((box) => {
        const element = document.createElement("section");
        element.className = "research-detail-card";

        const heading = document.createElement("h3");
        heading.textContent = box.title;
        const paragraph = document.createElement("p");
        paragraph.textContent = box.text;

        element.append(heading, paragraph);
        return element;
      });

      const boxContainer = document.createElement("div");
      boxContainer.className = "research-detail-boxes";
      boxContainer.append(...boxes);
      detailText.append(boxContainer);
    } else {
      const paragraph = document.createElement("p");
      paragraph.className = "research-detail-copy";
      paragraph.textContent = item.text;
      detailText.append(paragraph);

      if (item.works) {
        detailWorks.textContent = item.works;
        detailWorks.hidden = false;
      }
    }

    const detailScroll = document.getElementById("research-detail-scroll");
    if (detailScroll) detailScroll.scrollTop = 0;
    showModal(detailModal);
    detailCloseButton.focus();
  }

  function closeDetail() {
    if (!detailModal || detailModal.hidden) return;
    hideModal(detailModal);
    if (detailReturnFocus && typeof detailReturnFocus.focus === "function") {
      detailReturnFocus.focus();
    }
  }

  openButton.addEventListener("click", openTopics);
  closeButton.addEventListener("click", closeTopics);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeTopics();
  });

  if (detailModal && detailCloseButton) {
    detailModal.addEventListener("click", (event) => {
      if (event.target === detailModal) closeDetail();
    });

    detailCloseButton.addEventListener("click", closeDetail);

    modal.querySelectorAll("[data-topic]").forEach((button) => {
      button.addEventListener("click", () => {
        openDetail(button.dataset.topic, button);
      });
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (detailModal && !detailModal.hidden) {
      closeDetail();
    } else {
      closeTopics();
    }
  });
})();
