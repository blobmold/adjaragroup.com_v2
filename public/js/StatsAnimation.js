let stats = document.querySelectorAll(".stat-amount");
let step = 1;
let animationDuration = 2000;
let start = Date.now();

for (let stat of stats) {
  let amount = stat.dataset.amount;
  let currentCount = 0;

  let timer = setInterval(function () {
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