export default class APILoader {
  constructor(list, loadMore, filter, APIPATH) {
    this.pageNum = 1;
    this.list = list;
    this.loadMoreBtn = loadMore;
    this.APIPATH = APIPATH;
    this.APIURL = new URL(APIPATH, location.origin);
    this.filter = filter;
    this.APIURL.search = new URLSearchParams(this.filter);
  }

  async loadMore() {
    this.APIURL.searchParams.set("pageNum", ++this.pageNum);
    let page = await this.getPage(this.APIURL);
    if (!page.articles) return;
    await Promise.allSettled([this.checkNextPage(page), this.createPage(page, this.createArticleRow, "articles")]);
  }

  async checkNextPage(page) {
    if (!page) page = await this.getPage(this.APIURL);
    if (this.pageNum < Math.ceil(page.totalCount / page.pageSize)) {
      this.loadMoreBtn.style.display = "flex";
    } else {
      this.loadMoreBtn.style.display = "none";
    }
  }

  async getPage(url) {
    try {
      let response = await fetch(url);
      if (response.ok) {
        return await response.json();
      } else {
        throw response.status;
      }
    } catch (error) {
      console.log(error, error.message);
    }
  }

  async createPage(page, singleItemFunc, row) {
    // If page is loaded separately assign default APIURL;
    if (!page) page = await this.getPage(this.APIURL);

    for (let el of page[row]) {
      await singleItemFunc(this.list, el);
    }
  }

  async createJobRow(list, job) {
    if ("content" in document.createElement("template")) {
      let row = document.getElementById("job-result-template").content.cloneNode(true);

      row.querySelector('[data-jobCol="position"]').textContent = job.position;
      row.querySelector('[data-jobCol="location"]').textContent = job.location;
      row.querySelector('[data-jobCol="employmentType"]').textContent = job.employmentType;
      row.querySelector('[data-jobCol="postDate"]').textContent = new Date(job.postDate).toLocaleDateString();

      let summary = ["category", "deadline", "remote", "salary"];
      let result = "";

      for(let el of summary) {
        if(job[el]) {
          if(el === "deadline") job[el] = new Date(job[el]).toLocaleDateString(); 
          result += `<div class="job-cat-title ${el}">${el}</div>`;          
          result += `<div class="job-cat-txt ${el}">${job[el]}</div>`;          
        }
      }

      row.querySelector('.job-content.summary').insertAdjacentHTML('beforeend', result);
      row.querySelector('.job-content.descr').insertAdjacentHTML('beforeend', job.description);

      list.append(row);
    }
  }

  async createArticleRow(list, article) {
    if ("content" in document.createElement("template")) {
      let listItem = document.getElementById("articleLiTemplate").content.cloneNode(true);
      listItem.querySelector(".ag-news-recent-link").href = `/newsroom/${article._id}`;
      listItem.querySelector(".ag-news-recent-article-img").dataset.src = article.image;
      listItem.querySelector(".ag-news-recent-article-img").dataset.srcset = article.image;

      let category = listItem.querySelector(".ag-article-category");
      category.textContent = article.category;
      category.dataset.category = article.category.toLowerCase();

      let time = listItem.querySelector(".ag-article-date");
      time.textContent = new Date(article.postDate).toLocaleDateString();
      time.datetime = new Date(article.postDate);

      listItem.querySelector("h3").textContent = article.title;
      listItem.querySelector(".ag-recent-article-descr").textContent = article.description;
      list.append(listItem);
    } else {
      let elem = `<li class="ag-news-recent-item"><a class="ag-news-recent-link" href="/newsroom/${article._id}">
        <article class="ag-news-recent-article">
          <picture class="ag-news-recent-article-img-container"><img class="ag-news-recent-article-img"
              src="${article.image}" loading="lazy"></picture>
          <div class="ag-news-recent-article-copy">
            <div class="ag-recent-article-data">
              <div class="ag-article-category" data-category="${article.category.toLowerCase()}">${article.category}</div>
              <time class="ag-article-date" datetime="${article.postDate}>${article.postDate.toLocaleDateString()}</time>
            </div>
            <h3 class="">${article.title}</h3>
            <p class="ag-recent-article-descr">${article.description}</p>
          </div>
        </article>
      </a></li>`;

      list.insertAdjacentHTML("beforeend", elem);
    }
  }
}
