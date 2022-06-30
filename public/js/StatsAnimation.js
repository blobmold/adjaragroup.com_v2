let stats = document.querySelectorAll(".stat-number");
let statsSection = document.querySelector(".company-stats");

if (stats && statsSection) {
  if ("IntersectionObserver" in window) {
    let callback = (entries, observer) => {
      for (let entry of entries) {
        entry;
        if (entry.isIntersecting) {
          console.log("intersected");
          statAnimation(stats);
          observer.unobserve(statsSection);
        }
      }
    };

    let options = {
      threshold: 0.5,
    };

    let statsObserver = new IntersectionObserver(callback, options);
    statsObserver.observe(statsSection);
  }
}

function statAnimation(stats) {
  let step = 1;
  let animationDuration = 2000;
  let start = Date.now();

  for (let stat of stats) {
    let amount = stat.dataset.amount;
    let currentCount = 0;

    let timer = setInterval(() => {
      let timePassed = Date.now() - start;

      if (timePassed >= animationDuration) {
        clearInterval(timer);
        // Textcontent is always ending on the amount given in data-amount
        stat.textContent = amount;
        return;
      }

      currentCount = timePassed * (amount / animationDuration);
      stat.textContent = Math.round(currentCount);
    }, step);
  }
}
