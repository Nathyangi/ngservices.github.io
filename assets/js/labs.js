document.addEventListener("DOMContentLoaded", () => {
  const labsContainer = document.getElementById("labs-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!labsContainer) return;

  const isIndexPage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/";
  const jsonPath = "assets/data/labs.json";
  let allLabs = [];

  fetch(jsonPath)
    .then((res) => res.json())
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
      labsContainer.innerHTML = `<p class="text-center text-gray-400 py-10">Error loading labs.</p>`;
    });

  // === Display for index.html (latest 3 only) ===
  function displayLatestLabs(labs) {
    labsContainer.innerHTML = labs
      .map(
        (lab) => `
      <div class="lab-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105 duration-300">
        <img src="${lab.image}" alt="${lab.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2 text-gray-800">${lab.title}</h3>
          <p class="text-gray-600 mb-3 text-sm">${lab.date} • ${lab.category}</p>
          <p class="text-gray-700 mb-4 text-sm">${lab.description.substring(
            0,
            100
          )}...</p>
          <a href="labs.html" class="text-indigo-600 hover:text-indigo-800 font-medium">Read More →</a>
        </div>
      </div>
    `
      )
      .join("");
  }

  // === Display for labs.html (all labs) ===
  function displayAllLabs(labs) {
    labsContainer.innerHTML = labs
      .map(
        (lab, index) => `
      <div class="lab-card bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:scale-105 transition-transform duration-300" data-category="${lab.category}">
        <img src="${lab.image}" alt="${lab.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-green-500 mb-2">${lab.title}</h3>
          <p class="text-gray-400 text-sm mb-3">${lab.date} • ${lab.category}</p>
          <p class="text-gray-300 text-sm mb-4 read-more-content">${lab.description.substring(
            0,
            120
          )}...</p>
          <button class="read-more-btn text-green-400 hover:text-green-500 text-sm font-medium" data-index="${index}">
            Read More →
          </button>
        </div>
      </div>
    `
      )
      .join("");

    attachReadMoreListeners(allLabs);
  }

  // === "Read More" Toggle Function ===
  function attachReadMoreListeners(allLabs) {
    const buttons = document.querySelectorAll(".read-more-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        const content = document.querySelectorAll(".read-more-content")[index];
        const lab = allLabs[index];
        const isExpanded = content.classList.toggle("expanded");

        if (isExpanded) {
          content.innerHTML =
            lab.description + ` <span class="text-green-500 font-medium">↑</span>`;
          btn.textContent = "Show Less ↑";
        } else {
          content.innerHTML = lab.description.substring(0, 120) + "...";
          btn.textContent = "Read More →";
        }
      });
    });
  }

  // === Filter Logic ===
  function setupFilters() {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;

        // Remove active style from all buttons
        filterButtons.forEach((b) =>
          b.classList.remove("bg-green-600", "text-white")
        );

        // Highlight the clicked button
        btn.classList.add("bg-green-600", "text-white");

        // Filter labs
        const filteredLabs =
          category === "all"
            ? allLabs
            : allLabs.filter(
                (lab) => lab.category.toLowerCase() === category.toLowerCase()
              );

        displayAllLabs(filteredLabs);
      });
    });
  }
});
