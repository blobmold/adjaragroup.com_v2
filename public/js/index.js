// Initialize on all pages
(async () => {
  // Here Goes Navigation Settings
  // if (window.matchMedia("(max-width: 1140px)").matches) {
  // Current navigation element
  let gnLinks = document.querySelectorAll(".ag-gn-link");
  if (gnLinks) {
    for (let link of gnLinks) {
      if (link.pathname === location.pathname) {
        link.dataset.current = true;
      }
    }
  }

  // Hamburger button toggler
  let hamburgerContainer = document.querySelector(".ag-gn-hamburger_container");
  let navbarOverlay = document.querySelector(".navbar-overlay");

  navbarOverlay.addEventListener("click", closeNav);
  hamburgerContainer.addEventListener("click", closeNav);

  function closeNav() {
    document.body.classList.toggle("nav-visible");
  }

  // Launch Lazy Loader
  await lazyLoader();
})();

// Generate Article Progress Bar
(async () => {
  let progressBar = document.querySelector(".ag-article-progressBar");
  let article = document.querySelector(".ag-articleDetail");

  if (!article && !progressBar) return;

  let ArticleProgressBar = (await import("./progressBar.js")).default;
  let articleProgressBar = new ArticleProgressBar(article, progressBar);
  articleProgressBar.init();
})();

// Change article grid length if realted articles are not visible
(async () => {
  let relatedNews = document.querySelector(".ag-news-related");

  if (!relatedNews) return document.documentElement.style.setProperty("--article-grid-span", "end");
})();

// Article Loader
(async () => {
  let recentList = document.querySelector(".ag-news-recent-list");
  let loadMoreBtn = document.getElementById("loadMore");
  let categories = document.querySelectorAll(".ag-news-cat-item");
  let APIPATH = "/api/articles/list";

  await articleObserver();

  if (recentList) {
    if (!recentList && !loadMoreBtn && !categories.length >= 0) return;

    let articleAPILoader;
    let filter = {};

    if (location.search) {
      filter.category = new URLSearchParams(location.search).get("category");
    }

    if (!articleAPILoader) {
      let APILoader = (await import("./PageLoader.js")).default;
      articleAPILoader = new APILoader(recentList, loadMoreBtn, filter, APIPATH);
    }

    // If next page does not exist, remove loader
    await articleAPILoader.checkNextPage();
    loadMoreBtn.dataset.loading = 0;

    loadMoreBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      loadMoreBtn.dataset.loading = 1;
      await articleAPILoader.loadMore().then(lazyLoader).then(articleObserver);
      loadMoreBtn.dataset.loading = 0;
    });
  }

  async function articleObserver() {
    let articles = document.querySelectorAll(".ag-news-recent-item");

    if ("IntersectionObserver" in window) {
      let articleObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let article = entry.target;
            article.classList.replace("hidden", "visible");
            articleObserver.unobserve(article);
          }
        });
      });

      articles.forEach((article) => {
        articleObserver.observe(article);
      });
    }
  }
})();

(async () => {
  const careersSelector = document.getElementById("jobFilter");
  if (careersSelector) {
    for (let option of careersSelector.children) {
      if (option.value === location.pathname + location.search + location.hash) {
        option.selected = true;
        break;
      }
    }
    careersSelector.addEventListener("change", (e) => {
      location = e.target.value;
    });
  }
})();

(async () => {
  let careersSettings = {
    jobCategories: document.querySelectorAll(".careers-nav-item a"),
    jobList: document.querySelector(".job-rows"),
    APIPATH: "/api/careers",
    filter: {},
    cache: new Map(),
    async toggleJobRows() {
      let jobRows = document.querySelectorAll(".job-item-row");
      let jobResults = document.querySelectorAll(".job-result-tr");

      for (let row of jobRows) {
        const url = new URL(window.location);

        row.addEventListener("click", async () => {
          let parent = row.closest(".job-result-tr");
          await this.hideJobRows(jobResults, parent, url);
          url.searchParams.set("id", row.id);
          if (history.pushState) {
            window.history.pushState({}, "", url);
          }
          parent.classList.toggle("open");
        });
      }
    },

    async hideJobRows(elements, exclude) {
      for (let el of elements) {
        if (el !== exclude) {
          el.classList.remove("open");
        }
      }
    },

    async generatePage() {
      if (this.cache.has(this.filter.category)) {
        let startCached = Date.now();
        this.page = await this.cache.get(this.filter.category);
        console.log("Called from cache");
        console.log(`Non-cached: took ${Date.now() - startCached}`);
      } else {
        let startNonCached = Date.now();
        this.page = await jobAPILoader.generatePageArray(undefined, jobAPILoader.createJobEl, "careers");
        this.cache.set(this.filter.category, this.page);
        console.log("Not called from cache");
        console.log(`Non-cached: took ${Date.now() - startNonCached}`);
      }

      this.jobList.append(await this.page.cloneNode(true));
    },
  };

  let jobAPILoader;

  // Check if job list HTML element is available;
  if (careersSettings.jobList) {
    // If current location has "category", store it in filter.category object;
    if (location.search) {
      let currentLocationParams = new URLSearchParams(location.search);
      if (currentLocationParams.has("category")) {
        careersSettings.filter.category = currentLocationParams.get("category");
      }
    }

    // If jobAPILoader is not loaded, get it; Parameters are the API path, initial filter, and job list;

    if (!jobAPILoader) {
      let APILoader = (await import("./PageLoader.js")).default;
      jobAPILoader = new APILoader(careersSettings.jobList, undefined, careersSettings.filter, careersSettings.APIPATH);
    }

    // Create initial page;
    await careersSettings.generatePage();

    // Initialize job row toggler;
    await careersSettings.toggleJobRows();

    // Assign the "click" event listener to every single category (filter);
    for (let category of careersSettings.jobCategories) {
      category.addEventListener("click", async (e) => {
        // Prevent anchor's defalt action;
        e.preventDefault();

        // Remove all current job rows;
        careersSettings.jobList.querySelectorAll(".job-result-tr").forEach((row) => row.remove());

        // Start the loader when category is clicked and job rows are removed;
        document.getElementById("loader").dataset.loading = 1;

        // Push category href to the window location;
        if (history.pushState) {
          window.history.pushState({}, "", category.href);
        }

        // Change the filter;
        careersSettings.filter.category = new URLSearchParams(location.search).get("category");

        // if category in filter is not falsy, set jobAPILoader API URL to current filter; else delete;
        if (careersSettings.filter.category) {
          jobAPILoader.APIURL.searchParams.set("category", careersSettings.filter.category);
        } else {
          jobAPILoader.APIURL.searchParams.delete("category");
        }

        // assign createPage worker to onpopstate to make browser's "back" and "forward" buttons work;
        await careersSettings.generatePage();

        // Stop the loader;
        document.getElementById("loader").dataset.loading = 0;

        // Start job row toggler;
        await careersSettings.toggleJobRows();
      });
    }
  }
})();

async function lazyLoader() {
  let lazyImages = document.querySelectorAll("img.lazy");

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        let lazyImage = entry.target;
        lazyImage.style.transition = "opacity 0.5s ease";
        lazyImage.style.opacity = 0;
        if (entry.isIntersecting) {
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
      lazyImage.addEventListener("load", () => (lazyImage.style.opacity = 1)); // Don't display images until they are fully loaded
    });
  }
}

// Toggle header visibility;
(async () => {
  let lastYScroll = 0;
  let header = document.getElementById("gh");

  if (header) {
    document.addEventListener("scroll", () => {
      if (lastYScroll >= window.scrollY || window.scrollY <= 0) {
        header.classList.remove("gh-hidden");
        document.body.classList.remove("gh-hidden");
      } else {
        header.classList.add("gh-hidden");
        document.body.classList.add("gh-hidden");
      }
      lastYScroll = window.scrollY;
    });
  }
})();

(async () => {
  let newsroomNav = document.querySelector(".newsroom_nav");
  let newsroomTopics = document.getElementById("newsroomTopics");
  let newsroonList = document.querySelector(".ag-news-cat-list");
  let newsroomTray = document.querySelector(".newsroom_nav-tray");
  let newroomNavCurtain = document.getElementById("categoryNav-curtain");

  if (newsroomTopics) {
    newsroomTopics.addEventListener("click", (e) => {
      e.preventDefault();
      newsroomNav.classList.toggle("open");
      if (newsroomNav.classList.contains("open")) {
        newsroomTray.style.maxHeight = `${newsroonList.clientHeight}px`;
      } else {
        newsroomTray.style.maxHeight = `0`;
      }
    });

    newroomNavCurtain.addEventListener("click", () => {
      newsroomNav.classList.remove("open");
    });
  }
})();

(async () => {
  let revealElements = document.querySelectorAll(".reveal");

  let callback = (entries, observer) => {
    for (let entry of entries) {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        entry.target.classList.remove("reveal");
        entry.target.classList.add("revealed");
      }
    }
  };

  let options = {
    threshold: 0.5,
  };

  let revealObserver = new IntersectionObserver(callback, options);

  for (let revealElement of revealElements) {
    revealObserver.observe(revealElement);
  }
})();

(async () => {
  let stats = document.querySelectorAll(".stats-container");

  if (stats) {
    await import("./StatsAnimation.js");
  }
})();

(async () => {
  // eslint-disable-next-line no-undef
  gsap.registerPlugin(ScrollTrigger);
})();
