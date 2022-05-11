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

  gsap.registerPlugin(ScrollTrigger);

  // Hamburger button toggler
  let hamburgerContainer = document.querySelector(".ag-gn-hamburger_container");
  let navbarOverlay = document.querySelector(".navbar-overlay");

  let tl = gsap.timeline();

  tl.from(
    ".ag-gn-item",
    {
      opacity: 0,
      xPercent: 100,
      duration: 0.5,
      stagger: {
        amount: 0.2,
      },
      ease: "ease",
    },
  );
  tl.seek(1);

  navbarOverlay.addEventListener("click", closeNav);
  hamburgerContainer.addEventListener("click", closeNav);

  function closeNav() {
    document.body.classList.toggle("nav-visible");
    tl.play(0);

    // fixBody("nav-visible");
  }

  // Prevent body scrolling when hamburger menu is open
  // let fixBody = (visibleClass) => {
  //   if (document.body.classList.contains(visibleClass)) {
  //     document.body.style.position = "fixed";
  //   } else {
  //     document.body.style.position = "unset";
  //   }
  // };

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

  if (!recentList && !loadMoreBtn && !categories.length >= 0) return;

  let articleAPILoader;
  let filter = {};

  if (location.search) {
    filter.category = new URLSearchParams(location.search).get("category");
  }

  if (!articleAPILoader) {
    let ArticleAPILoader = (await import("./loadMore.js")).default;
    articleAPILoader = new ArticleAPILoader(recentList, loadMoreBtn, filter);
  }

  // If next page does not exist, remove loader
  await articleAPILoader.checkNextPage();
  loadMoreBtn.dataset.loading = 0;

  loadMoreBtn.addEventListener("click", async () => {
    loadMoreBtn.dataset.loading = 1;
    articleAPILoader.loadMore().then(lazyLoader);
    loadMoreBtn.dataset.loading = 0;
  });
})();

// gsap
(async () => {
  let newsCards = document.querySelectorAll(".ag-news-card");

  if (newsCards.length === 0) return;

  gsap.from(".ag-news-card", {
    scrollTrigger: ".ag-news-card",
    opacity: 0,
    x: 30,
    duration: 0.5,
    stagger: {
      amount: 0.4,
    },
    ease: "ease",
  });
})();

async function lazyLoader() {
  let lazyImages = document.querySelectorAll("img.lazy");

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  }
}

(async () => {
  let jobRow = document.querySelectorAll('.job-item-row');
  let jobResults = document.querySelectorAll('.job-result-tr');

  function hideJobRows(elements, exclude) {
    for(let el of elements) {
      if (el !== exclude) {
        el.classList.remove('open');
      }
    }
  }

  for(let row of jobRow) {
    row.addEventListener('click', () => {
      let parent = row.closest('.job-result-tr');

      hideJobRows(jobResults, parent);

      parent.classList.toggle('open');
      
    });
  }

})();

(async () => {
  const careersSelector = document.getElementById('jobFilter');
  if(careersSelector) {
    for(let option of careersSelector.children) {
      if(option.value === location.pathname + location.search + location.hash) {
        option.selected = true;
        break;
      }
    }
    careersSelector.addEventListener('change', (e) => {
      location = e.target.value;
    });
  }
})();