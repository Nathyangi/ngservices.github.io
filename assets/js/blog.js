// ======================
// BLOG PAGE FUNCTIONALITY
// ======================

document.addEventListener("DOMContentLoaded", () => {
  const blogContainer = document.getElementById("blog-container");
  const noResultsMessage = document.getElementById("no-results-message");
  const searchModal = document.getElementById("search-modal");
  const searchInput = document.getElementById("search-input");
  const openSearchBtn = document.querySelector(".open-search-btn");
  const closeSearchBtn = document.getElementById("close-search-btn");

  const postModal = document.getElementById("post-modal");
  const postModalContent = document.getElementById("post-modal-content");
  const closePostBtn = document.getElementById("close-post-btn");
  const backToBlogBtn = document.getElementById("back-to-blog-btn");

  let allPosts = [];

  // ----------------------
  // Fetch blog posts
  // ----------------------
  fetch("assets/data/blog.json")
    .then((res) => res.json())
    .then((posts) => {
      allPosts = posts.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      displayPosts(allPosts);
    })
    .catch((err) => {
      console.error("Error loading blog posts:", err);
      blogContainer.innerHTML = `<p class="text-center text-gray-400 py-10">Error loading blog posts.</p>`;
    });

  // ----------------------
  // Display blog posts
  // ----------------------
  function displayPosts(posts) {
    blogContainer.innerHTML = "";

    if (posts.length === 0) {
      noResultsMessage.classList.remove("hidden");
      return;
    } else {
      noResultsMessage.classList.add("hidden");
    }

    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className =
        "bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-green-500/10 transition";
      card.innerHTML = `
        <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-3 text-green-500">${post.title}</h3>
          <p class="text-gray-400 text-sm mb-4">${post.date}</p>
          <p class="text-gray-300 mb-4">${post.content.substring(0, 120)}...</p>
          <button class="read-more-btn text-green-500 hover:text-green-400 font-medium" data-title="${post.title}">
            Read More <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
      `;
      blogContainer.appendChild(card);
    });
  }

  // ----------------------
  // Search Modal Controls
  // ----------------------
  if (openSearchBtn && closeSearchBtn && searchModal) {
    openSearchBtn.addEventListener("click", () => {
      searchModal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
      searchInput.focus();
    });

    closeSearchBtn.addEventListener("click", () => {
      searchModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
      searchInput.value = "";
      displayPosts(allPosts);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchModal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }
    });
  }

  // ----------------------
  // Live Search (input + Enter + Auto Close)
  // ----------------------
  if (searchInput) {
    const performSearch = () => {
      const keyword = searchInput.value.toLowerCase().trim();
      const filtered = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(keyword) ||
          post.content.toLowerCase().includes(keyword)
      );
      displayPosts(filtered);
    };

    // Trigger search as user types
    searchInput.addEventListener("input", performSearch);

    // Trigger search on Enter + close modal
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
        // Close modal after search
        const modal = document.querySelector("#searchModal");
        if (modal) modal.classList.add("hidden");
      }
    });
  }

  // ----------------------
  // Read More Modal

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.querySelector("#searchModal");
    if (modal) modal.classList.add("hidden");
    if (searchInput) searchInput.value = "";
  }
});

  function openPostModal(post) {
    postModalContent.innerHTML = `
      <h2 class="text-3xl font-bold text-green-500 mb-4">${post.title}</h2>
      <p class="text-gray-400 mb-2">${post.date}</p>
      <img src="${post.image}" alt="${post.title}" class="w-full rounded-lg mb-6">
      <p class="text-gray-200 leading-relaxed">${post.content}</p>
    `;
    postModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  function closePostModal() {
    postModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  if (closePostBtn) closePostBtn.addEventListener("click", closePostModal);
  if (backToBlogBtn) backToBlogBtn.addEventListener("click", closePostModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePostModal();
  });
});
