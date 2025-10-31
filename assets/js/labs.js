document.addEventListener("DOMContentLoaded", () => {
  const labsContainer = document.getElementById("labs-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!labsContainer) return;

  const isIndexPage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "/index";

  const jsonPath = "assets/data/labs.json";
  let allLabs = [];

  // === Fetch Labs Data ===
  fetch(jsonPath, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load labs data");
      return res.json();
    })
    .then((labs) => {
      allLabs = labs.sort((a, b) => new Date(b.date) - new Date(a.date));

      if (isIndexPage) {
        displayLatestLabs(allLabs.slice(0, 3));
      } else {
        displayAllLabs(allLabs);
        setupFilters();
      }
    })
    .catch((err) => {
      console.error("Error loading labs:", err);
      labsContainer.innerHTML = `
        <p class="text-center text-gray-400 py-10">
          Error loading labs. Please refresh or check your connection.
        </p>`;
    });

  // === Display Latest Labs (Homepage only) ===
  function displayLatestLabs(labs) {
    labsContainer.innerHTML = labs
      .map(
        (lab) => `
      <div class="lab-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105 duration-300">
        <img src="${lab.image}" alt="${lab.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2 text-gray-800">${lab.title}</h3>
          <p class="text-gray-600 mb-3 text-sm">${formatDate(lab.date)} • ${lab.category}</p>
          <p class="text-gray-700 mb-4 text-sm">${truncateText(lab.description, 100)}</p>
          <a href="${lab.link}" class="text-green-600 hover:text-green-700 font-medium">Read More →</a>
        </div>
      </div>
    `
      )
      .join("");
  }

  // === Display All Labs (labs.html) ===
  function displayAllLabs(labs) {
    labsContainer.innerHTML = labs
      .map(
        (lab, index) => `
      <div class="lab-card bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:scale-105 transition-transform duration-300" data-category="${lab.category}">
        <img src="${lab.image}" alt="${lab.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-green-500 mb-2">${lab.title}</h3>
          <p class="text-gray-400 text-sm mb-3">${formatDate(lab.date)} • ${lab.category}</p>
          <div class="text-gray-300 text-sm mb-4 read-more-content">${truncateText(lab.description, 120)}</div>
          ${
            lab.video
              ? `
            <div class="mt-4 rounded-xl overflow-hidden">
              <iframe class="w-full aspect-video rounded-lg" src="${lab.video}" frameborder="0" allowfullscreen></iframe>
            </div>
          `
              : ""
          }
          <div class="flex justify-between items-center mt-4">
            <button class="read-more-btn text-green-400 hover:text-green-500 text-sm font-medium" data-index="${index}">
              Read More ↓
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    attachReadMoreListeners(labs);
  }

  // === "Read More" Toggle ===
  function attachReadMoreListeners(labs) {
    const buttons = document.querySelectorAll(".read-more-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        const content = document.querySelectorAll(".read-more-content")[index];
        const lab = labs[index];
        const isExpanded = content.classList.toggle("expanded");

        if (isExpanded) {
          let expandedContent = `<p>${lab.description}</p>`;

          // Show video preview if available
          if (lab.video) {
            expandedContent += `
              <div class="mt-4 rounded-xl overflow-hidden">
                <iframe class="w-full aspect-video rounded-lg" src="${lab.video}" frameborder="0" allowfullscreen></iframe>
              </div>
            `;
          }

          // Add “View Full Lab” link if available
          if (lab.link) {
            expandedContent += `
              <div class="mt-4">
                <a href="${lab.link}" class="text-green-400 hover:text-green-500 font-medium">View Full Lab →</a>
              </div>
            `;
          }

          content.innerHTML = expandedContent;
          btn.textContent = "Show Less ↑";
        } else {
          content.innerHTML = truncateText(lab.description, 120);
          btn.textContent = "Read More ↓";
        }
      });
    });
  }

  // === Filter Logic ===
  function setupFilters() {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;

        // Remove active styles
        filterButtons.forEach((b) =>
          b.classList.remove("bg-green-600", "text-white")
        );

        // Highlight active button
        btn.classList.add("bg-green-600", "text-white");

        // Filter labs
        const filteredLabs =
          category === "all"
            ? allLabs
            : allLabs.filter(
                (lab) =>
                  lab.category &&
                  lab.category.toLowerCase() === category.toLowerCase()
              );

        displayAllLabs(filteredLabs);
      });
    });
  }

  // === Utility Functions ===
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return !isNaN(date) ? date.toDateString() : dateStr;
  }

  function truncateText(text, length) {
    return text.length > length ? text.substring(0, length) + "..." : text;
  }
});
