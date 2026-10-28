// NIGHT CAVALRY CLUB — site interactions

// Flag JS as active so the CSS scroll-reveal states only apply when
// they can actually be triggered (keeps the page fully visible if JS fails).
document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the mobile menu after a link is chosen
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal headings and content blocks as they scroll into view
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // No IntersectionObserver support — just show everything
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // ---------- gallery lightbox ----------
  const cards = Array.from(document.querySelectorAll(".gallery-card"));
  const lightbox = document.getElementById("lightbox");

  if (cards.length && lightbox) {
    const lbImage = document.getElementById("lbImage");
    const lbCaption = document.getElementById("lbCaption");
    const lbClose = document.getElementById("lbClose");
    const lbPrev = document.getElementById("lbPrev");
    const lbNext = document.getElementById("lbNext");
    let currentIndex = 0;
    let lastFocused = null;

    const showPhoto = (index) => {
      currentIndex = (index + cards.length) % cards.length;
      const card = cards[currentIndex];
      lbImage.src = card.dataset.full;
      lbImage.alt = card.dataset.caption || "";
      lbCaption.textContent = card.dataset.caption || "";
    };

    const openLightbox = (index) => {
      lastFocused = document.activeElement;
      showPhoto(index);
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lbClose.focus();
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    };

    cards.forEach((card, index) => {
      card.addEventListener("click", () => openLightbox(index));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(index);
        }
      });
    });

    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", () => showPhoto(currentIndex - 1));
    lbNext.addEventListener("click", () => showPhoto(currentIndex + 1));

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showPhoto(currentIndex + 1);
      if (e.key === "ArrowLeft") showPhoto(currentIndex - 1);
    });
  }
});
