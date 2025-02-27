import "./searchbar.css";
import { countryList } from "./countriesList";
import { getWeather, updateInfo, loader, infoAnim } from "./index";

class SearchBar {
  constructor(searchBar) {
    this.searchBar = searchBar;
    this.searchInput = this.searchBar.querySelector("input");
    this.searchBtn = this.searchBar.querySelector("button");
    this.list = this.searchBar.querySelector(".list");

    this.createList();
    this.inputHandler();
  }

  inputHandler() {
    this.searchInput.addEventListener("input", (e) => {
      let children = this.list.childNodes.length;
      let hidden = 0;
      this.updateList(true);
      this.list.childNodes.forEach((c) => {
        if (!c.dataset.id.includes(this.searchInput.value.toLowerCase())) {
          c.classList.add("hidden");
          hidden++;
        } else {
          c.classList.remove("hidden");
        }
      });
      if (hidden === children) {
        this.updateList(false);
      }
    });

    this.list.childNodes.forEach((c) => {
      c.addEventListener("click", (e) => {
        this.searchInput.value = e.target.textContent;
        this.updateList(false);
      });
      c.addEventListener("focus", (e) => {
        this.searchInput.value = c.textContent;
        c.addEventListener("keydown", (e) => {
          // e.preventDefault();
          if (e.code === "Enter") {
            e.preventDefault();
            this.updateList(false);
            this.searchBtn.focus();
          }
        });
      });
    });

    this.searchInput.addEventListener("focus", (e) => {
      this.updateList(true);
    });

    window.addEventListener("click", (e) => {
      if (!this.searchInput.contains(e.target)) {
        this.updateList(false);
      }
    });

    window.addEventListener("keydown", (e) =>{
      console.log(e.code)
      if(e.code === "Escape"){
        this.updateList(false);
      }
    })

    this.searchBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const error = document.querySelector(".error");
      error.textContent = "";
      infoAnim(false);
      // loader(true);
      let weather = await getWeather(this.searchInput.value);
      error.classList.add("errorAnim");
      infoAnim(true);
      error.addEventListener("animationend", () => {
        error.classList.remove("errorAnim");
      });
      // loader(false);
      this.updateList(false);
      console.log(typeof weather);
      if (weather.constructor === Object) {
        this.searchInput.value = "";
        updateInfo(weather);
        error.textContent = "";
        this.list.childNodes.forEach((c) => c.classList.remove("hidden"));
      } else {
        error.innerHTML = `<i class='bx bxs-message-dots' ></i>${weather}`
      }
      console.log(weather);
    });
  }

  createItem(text) {
    const item = document.createElement("p");
    item.classList.add("item");
    item.dataset.id = text.toLowerCase();
    item.textContent = text;

    return item;
  }

  createList() {
    countryList.forEach((c) => {
      this.list.appendChild(this.createItem(c));
    });
  }

  updateList(open = true) {
    if (open) {
      this.list.classList.add("listOpen");
      this.list.childNodes.forEach((c) => {
        c.tabIndex = "0";
      });
    } else {
      this.list.classList.remove("listOpen");
      this.list.childNodes.forEach((c) => {
        c.tabIndex = "-1";
      });
    }
  }
}

(function () {
  const searchBars = document.querySelectorAll("#searchbar");
  searchBars.forEach((s) => {
    new SearchBar(s);
  });
})();
