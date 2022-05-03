// Progress bar generator
export default class GenerateProgressBar {
  constructor(article, progressBar) {
    this.a = article;
    this.pB = progressBar;
    this.s = this.pB.style;
  }
  getHeight(e) {
    this.aC = e.getBoundingClientRect();
    return this.aC.height;
  }
  calc() {
    let aH = this.getHeight(this.a);
    let o = Math.max(aH - window.innerHeight, 0);
    let t = this.aC.top;
    let s = Math.min((100 * -t) / o, 100);
    if (s < 0) s = 0;
    return s;
  }
  init() {
    if (this.getHeight(this.a) + 30 > window.innerHeight) {
      document.addEventListener("scroll", () => {
        this.s.width = this.calc() + "%";
      });
    }
  }
}
