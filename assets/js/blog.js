/* ============================================================
   NGTech Services | blog.js
   Handles dynamic blog loading and modal preview
============================================================ */

async function loadBlogs() {
  const blogContainer = document.getElementById("blog-container");
  if (!blogContainer) return;

  try {
    const res = await fetch("assets/data/blog.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load blog data");

    const blogs = await res.json();
    blogContainer.innerHTML = blogs.map(blog => `
      <article class="bg-gray-900 border border-gray-800 rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden">
        <img src="${blog.image}" alt="${blog.title}" class="w-full h-56 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2 text-green-500">${blog.title}</h3>
          <p class="text-gray-400 text-sm mb-4">${blog.date}</p>
          <p class="text-gray-300 mb-6">${blog.excerpt}</p>
          <button 
            class="read-more-btn bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition"
            data-link="${blog.link}"
          >
            Read More →
          </button>
        </div>
      </article>
    `).join("");

    // Attach event listeners for Read More buttons
    document.querySelectorAll(".read-more-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const link = btn.getAttribute("data-link");
        window.location.href = link; // Navigate to full blog page
      });
    });

  } catch (error) {
    console.error("Error loading blogs:", error);
    blogContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load blogs. Please try again later.</p>`;
  }
}

// Initialize blog loading
document.addEventListener("DOMContentLoaded", loadBlogs);
