var bookmarksTable = document.getElementById("bookmarks-table");
var siteName = document.getElementById("site-name");
var siteUrl = document.getElementById("site-url");

var submitBtn = document.getElementById("submit");
var updateBtn = document.getElementById("update");

var nameAlert = document.querySelector(".name-alert");
var urlAlert = document.querySelector(".url-alert");
var deleteMark;

if (localStorage.getItem("bookmarks")) {
  displayBookmarks();
} else {
  var bookmarks = [];
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function displayBookmarks() {
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

  // empty the bookmarks table to avoid duplicate values
  bookmarksTable.innerHTML = "";
  // extracting the data from bookmarks and creating HTML elements to present them
  for (let i = 0; i < bookmarks.length; i++) {
    var bookmarkContainer = document.createElement("div");
    var bookmarkName = document.createElement("p");
    var bookmarkBtnsContainer = document.createElement("div");
    var bookmarkSite = document.createElement("a");
    var bookmarkDelete = document.createElement("button");
    var bookmarkUpdate = document.createElement("button");
    bookmarkName.innerHTML = bookmarks[i].siteName;
    bookmarkSite.innerHTML = "view";
    bookmarkSite.classList.add("btn", "btn-primary");
    var urlRegex =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    var validUrl = urlRegex.test(bookmarks[i].siteUrl);
    if (validUrl) {
      bookmarkSite.setAttribute(
        "href",
        "https://www." + bookmarks[i].siteUrl.replace("https://www.", "")
      );
    } else {
      urlAlert.innerHTML = "url is valid";
      urlAlert.classList.replace("d-none", "d-block");
      return false;
    }
    bookmarkSite.setAttribute("target", "_blank");
    bookmarkDelete.innerHTML = "Delete";
    bookmarkUpdate.innerHTML = "Update";
    bookmarkDelete.classList.add(
      "btn",
      "btn-danger",
      "delete-mark",
      "ms-4",
      "me-4"
    );
    bookmarkDelete.setAttribute("data-id", bookmarks[i].id);
    bookmarkUpdate.classList.add("btn", "btn-warning", "update-mark");
    bookmarkUpdate.setAttribute("data-id", bookmarks[i].id);
    bookmarkBtnsContainer.appendChild(bookmarkSite);
    bookmarkBtnsContainer.appendChild(bookmarkDelete);
    bookmarkBtnsContainer.appendChild(bookmarkUpdate);
    bookmarkContainer.appendChild(bookmarkName);
    bookmarkContainer.appendChild(bookmarkBtnsContainer);
    bookmarkContainer.classList.add("bookmark-item");
    bookmarksTable.appendChild(bookmarkContainer);
  }
  deleteMark = document.querySelectorAll(".delete-mark");
  updateMark = document.querySelectorAll(".update-mark");
  // deleting an item by id

  for (let i = 0; i < bookmarks.length; i++) {
    deleteMark[i].addEventListener("click", (e) => deleteItem(e));
  }
  for (let i = 0; i < bookmarks.length; i++) {
    updateMark[i].addEventListener("click", (e) => updateItem(e));
  }
}

function validate(siteName, siteUrl, update = false) {
  // remove any spaces from both sides
  siteName = siteName.value.trim();
  siteUrl = siteUrl.value.trim();
  // checking for empty inputs
  if (!siteName || !siteUrl) {
    if (!siteName) {
      nameAlert.innerHTML = "Name can not be empty";
      nameAlert.classList.replace("d-none", "d-block");
    } else {
      nameAlert.classList.replace("d-block", "d-none");
    }
    if (!siteUrl) {
      urlAlert.innerHTML = "url can not be empty";
      urlAlert.classList.replace("d-none", "d-block");
    } else {
      urlAlert.classList.replace("d-block", "d-none");
    }
    return;
  }

  if (!update) {
    // check for duplicate name
    for (let i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].siteName == siteName) {
        nameAlert.innerHTML = "Name already exist";
        nameAlert.classList.replace("d-none", "d-block");
        return;
      }
    }
  }
  // check if the site name does not contain a domain
  if (!Array.from(siteUrl).includes(".")) {
    urlAlert.innerHTML =
      "url must  end with a domain ex (.com , .net, .co, .us)";
    urlAlert.classList.replace("d-none", "d-block");
    return;
  }
  // hide Errors if not found and return true
  nameAlert.classList.replace("d-block", "d-none");
  urlAlert.classList.replace("d-block", "d-none");
  return true;
}

function addBookmark() {
  // validating the inputs and putting the result in variable
  var valid = validate(siteName, siteUrl);
  var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  // if valid is false stop proceeding
  if (!valid) return;

  // constructing a bookmark object
  var bookmark = {
    id: bookmarks.length + 1,
    siteName: siteName.value,
    siteUrl: siteUrl.value,
  };

  // adding bookmark to bookmarks
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  displayBookmarks();

  siteName.value = "";
  siteUrl.value = "";
}

function deleteItem(e) {
  bookMarkId = e.target.getAttribute("data-id");
  e.target.parentNode.parentNode.remove();

  for (let x = 0; x < bookmarks.length; x++) {
    if (bookMarkId == bookmarks[x].id) {
      console.log(bookmarks[x].siteName);
      console.log(bookmarks[x].siteUrl);
      bookmarks.splice(x, 1);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      displayBookmarks();
    }
  }
}

function updateItem(e) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  bookMarkId = e.target.getAttribute("data-id");
  for (let x = 0; x < bookmarks.length; x++) {
    if (bookMarkId == bookmarks[x].id) {
      siteName.value = bookmarks[x].siteName;
      siteUrl.value = bookmarks[x].siteUrl;
      submitBtn.classList.add("d-none");
      updateBtn.classList.replace("d-none", "d-block");
    }
  }
  updateBtn.addEventListener("click", function () {
    var valid = validate(siteName, siteUrl, (update = true));
    if (!valid) return;
    for (let x = 0; x < bookmarks.length; x++) {
      if (bookMarkId == bookmarks[x].id) {
        bookmarks[x].siteName = siteName.value;
        bookmarks[x].siteUrl = siteUrl.value;
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        submitBtn.classList.remove("d-none");
        updateBtn.classList.replace("d-block", "d-none");
        displayBookmarks();
      }
    }
    siteName.value = "";
    siteUrl.value = "";
  });
}

// Event listeners
submitBtn.addEventListener("click", addBookmark);

siteName.addEventListener("keypress", function (e) {
  if (e.key == "Enter" && !submitBtn.classList.contains("d-none"))
    addBookmark();
});

siteUrl.addEventListener("keypress", function (e) {
  if (e.key == "Enter" && !submitBtn.classList.contains("d-none"))
    addBookmark();
});
