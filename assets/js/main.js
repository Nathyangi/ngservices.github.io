/* ============================================================
   NGTech Services | main.js
   Handles navigation, modals, scroll effects, dark mode, etc.
   Fetches blog + labs from JSON and renders previews.
   ============================================================ */

/* ========= 1. NAVIGATION & MOBILE MENU ========= */
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const pageOverlay = document.getElementById("page-overlay");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    if (pageOverlay) pageOverlay.classList.toggle("hidden");
  });

  if (pageOverlay) {
    pageOverlay.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      pageOverlay.classList.add("hidden");
    });
  }

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      if (pageOverlay) pageOverlay.classList.add("hidden");
    });
  });
}

/* ========= 2. ACTIVE LINK HIGHLIGHT ========= */
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll("nav a").forEach((link) => {
  const linkPage = link.getAttribute("href");
  if (linkPage === currentPage || (linkPage === "index.html" && currentPage === "")) {
    link.classList.add("text-green-500", "font-semibold");
  } else {
    link.classList.remove("text-green-500", "font-semibold");
  }
});

/* ========= 3. SCROLL PROGRESS BAR ========= */
const scrollProgress = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = progress + "%";
});

/* ========= 4. SCROLL TO TOP BUTTON ========= */
const scrollTopBtn = document.getElementById("scroll-top-btn");
if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.remove("hidden");
    } else {
      scrollTopBtn.classList.add("hidden");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ========= 5. SEARCH MODAL ========= */
const searchModal = document.getElementById("search-modal");
const closeSearchBtn = document.getElementById("close-search-btn");
const searchInput = document.getElementById("search-input");

if (searchModal && closeSearchBtn) {
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "s" && e.ctrlKey) {
      e.preventDefault();
      searchModal.classList.remove("hidden");
      setTimeout(() => searchInput?.focus(), 80);
    }
    if (e.key === "Escape") {
      searchModal.classList.add("hidden");
    }
  });

  closeSearchBtn.addEventListener("click", () => {
    searchModal.classList.add("hidden");
  });
}

/* ========= 6. BLOG POST MODAL ========= */
const postModal = document.getElementById("post-modal");
const closePostBtn = document.getElementById("close-post-btn");
const backToBlogBtn = document.getElementById("back-to-blog-btn");
const postModalContent = document.getElementById("post-modal-content");

if (postModal && closePostBtn && postModalContent) {
  closePostBtn.addEventListener("click", () => {
    postModal.classList.add("hidden");
    postModalContent.innerHTML = "";
  });
  if (backToBlogBtn) {
    backToBlogBtn.addEventListener("click", () => {
      postModal.classList.add("hidden");
      postModalContent.innerHTML = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ========= 7. CONTACT MESSAGE MODAL ========= */
const messageModal = document.getElementById("message-modal");
const closeMessageBtn = document.getElementById("close-message-btn");

if (messageModal && closeMessageBtn) {
  closeMessageBtn.addEventListener("click", () => {
    messageModal.classList.add("hidden");
  });
}

/* ========= Helpers: safe text, truncate ========= */
function escapeHtml(text = "") {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function truncate(text = "", max = 140) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

/* ========= 8. DYNAMIC BLOG PREVIEW (fetch blog JSON) ========= */
async function loadRecentBlogs() {
  const recentBlogContainer = document.getElementById("recent-blog-container");
  if (!recentBlogContainer) return;

  try {
    const res = await fetch("assets/data/blog.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Blog JSON not found");
    const blogs = await res.json();

    const items = (Array.isArray(blogs) ? blogs : []).slice(0, 3);
    if (items.length === 0) {
      recentBlogContainer.innerHTML = `<p class="text-gray-400 text-center">No blog posts available yet.</p>`;
      return;
    }

    recentBlogContainer.innerHTML = items
      .map((post) => {
        const img = post.image || "assets/img/blog-placeholder.jpg";
        const title = escapeHtml(post.title || "Untitled");
        const date = escapeHtml(post.date || "");
        const excerpt = escapeHtml(post.excerpt || truncate(post.content || "", 120));
        const id = encodeURIComponent(post.id || "");
        // link to blog.html with id query for detail page
        const link = `blog.html${id ? `?id=${id}` : ""}`;

        return `
          <article class="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-md hover:shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-2">
            <div class="w-full h-44 overflow-hidden rounded-lg mb-4">
              <img src="${img}" alt="${title}" class="w-full h-full object-cover">
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">${title}</h3>
            <p class="text-gray-400 text-sm mb-3">${date}</p>
            <p class="text-gray-300 mb-4">${excerpt}</p>
            <a href="${link}" class="text-green-500 hover:text-green-400 font-medium">Read More →</a>
          </article>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Error loading blog.json:", err);
    recentBlogContainer.innerHTML = `<p class="text-gray-400 text-center">Failed to load blog posts.</p>`;
  }
}

/* ========= 9. DYNAMIC LABS PREVIEW (fetch labs JSON) ========= */
async function loadLatestLabs() {
  const latestLabs = document.getElementById("latest-labs");
  if (!latestLabs) return;

  try {
    const res = await fetch("assets/data/labs.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Labs JSON not found");
    const labs = await res.json();

    const items = (Array.isArray(labs) ? labs : []).slice(0, 3);
    if (items.length === 0) {
      latestLabs.innerHTML = `<p class="text-gray-400 text-center">No labs available yet.</p>`;
      return;
    }

    latestLabs.innerHTML = items
      .map((lab) => {
        const img = lab.image || "assets/img/lab-placeholder.jpg";
        const title = escapeHtml(lab.title || "Untitled Lab");
        const category = escapeHtml(lab.category || "");
        const desc = escapeHtml(lab.desc || truncate(lab.description || "", 120));
        const id = encodeURIComponent(lab.id || "");
        const link = `lab.html${id ? `?id=${id}` : ""}`;

        return `
          <article class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow hover:shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-2">
            <div class="w-full h-44 overflow-hidden rounded-lg mb-4">
              <img src="${img}" alt="${title}" class="w-full h-full object-cover">
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">${title}</h3>
            <p class="text-green-500 text-sm mb-2">${category}</p>
            <p class="text-gray-400 mb-4">${desc}</p>
            <a href="${link}" class="inline-block mt-2 text-green-500 hover:text-green-400 font-medium">View Lab →</a>
          </article>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Error loading labs.json:", err);
    latestLabs.innerHTML = `<p class="text-gray-400 text-center">Failed to load lab projects.</p>`;
  }
}

/* ========= 10. FADE-IN ON SCROLL ========= */
const fadeSections = document.querySelectorAll(".fade-in-section");
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
        // optionally unobserve to avoid repeated triggers
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

fadeSections.forEach((section) => {
  section.classList.add("opacity-0", "translate-y-6", "transition-all", "duration-700");
  fadeObserver.observe(section);
});

/* ========= 11. DARK MODE TOGGLE ========= */
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

const userTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

if (userTheme === "dark" || (!userTheme && systemPrefersDark)) {
  document.documentElement.classList.add("dark");
  if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (themeIcon) {
      if (isDark) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
        themeIcon.classList.add("text-yellow-400");
      } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
        themeIcon.classList.remove("text-yellow-400");
      }
    }
  });
}

/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded", () => {
  loadRecentBlogs();
  loadLatestLabs();
});

console.log("✅ NGTech main.js loaded and running for:", currentPage);
