const categoryContainer = document.querySelector("#category-btn");
const videoCardContainer = document.querySelector("#card-container");

// search input handler
const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
};
const closeLoader = () => {
  document.getElementById("loader").classList.add("hidden");
};

// remove ative class from all btn
const removeActiveClass = () => {
  document
    .querySelector("#category-btn")
    .querySelectorAll("button")
    .forEach((btn) => {
      btn.classList.remove("active");
    });
};

// fetch categories name
const getCategories = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/phero-tube/categories"
  );
  const data = await response.json();
  displayCategories(data.categories);
};
getCategories();
// display categories name
const displayCategories = (categories) => {
  categories.forEach((item) => {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.setAttribute(
      "onclick",
      `showCategoryVideo('${item.category_id}', this)`
    );
    button.innerText = `${item.category}`;
    categoryContainer.append(button);
  });
};

// fetch all video from api
const loadAllVideos = async () => {
  videoCardContainer.innerHTML = "";
  showLoader();
  const response = await fetch(
    "https://openapi.programming-hero.com/api/phero-tube/videos"
  );
  const data = await response.json();

  //   remove active classes and that in all btn
  removeActiveClass();
  document.querySelector("#btn-all").classList.add("active");
  //   send videos data to displayVideos handler
  setTimeout(() => {
    displayVideos(data.videos);
  }, 300);
};
loadAllVideos();
// display videos handler
const displayVideos = (videos) => {
  closeLoader();
  videoCardContainer.innerHTML = "";
  if (videos.length < 1) {
    const videoCard = document.createElement("div");
    videoCard.classList.add(
      "col-span-4",
      "text-center",
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "mt-20"
    );
    videoCard.innerHTML = `
     <div><img src="images/Icon.png" alt="" /></div>
        <h1 class="text-3xl font-bold">
        Oops!! Sorry, There is no <br />
        content here
        </h1>
    `;
    videoCardContainer.append(videoCard);
    return;
  }

  videos.forEach((video) => {
    const postHour = Math.floor(video.others.posted_date / 3600);
    const postMin = Math.floor((video.others.posted_date % 3600) / 60);

    const videoCard = document.createElement("div");
    videoCard.classList.add(
      "card",
      "relative",
      "min-h-[350px]",
      "bg-base-100",
      "shadow-sm",
      "pb-0"
    );
    videoCard.innerHTML = `
    <figure class="relative w-full h-[170px]">
        <img
            class="w-full h-full"
            src="${video.thumbnail}"
            alt="${video.title}"
        />
        <p class="absolute bottom-3 right-3 bg-slate-700 opacity-60 rounded-lg text-white py-1 px-2 text-sm">${
          postHour ? postHour + " hrs" : ""
        } ${postMin ? postMin + " min ago" : "1 min ago"}</p>
        </figure>

        <div class="flex gap-3 mt-3 px-1">
        <div>
            <div class="avatar">
            <div class="w-12 rounded-full">
                <img
                src="${video.authors[0].profile_picture}"
                />
            </div>
            </div>
        </div>

        <div>
            <h2 class="card-title pb-3">${video.title}</h2>

            <div class="justify-start flex flex-col">
            <div class="flex gap-3 items-center text-slate-600">
                <p>${video.authors[0].profile_name}</p>

                    ${
                      video.authors[0].verified
                        ? '<div><img src="./images/icons8-verify-30.png" alt=""></div>'
                        : ""
                    }
                
            </div>
            <p>${video.others.views} views</p>
            </div>
        </div>
        </div>
         <button onclick="showDetailsModal('${
           video.video_id
         }')" class="absolute bottom-0 w-full btn btn-soft btn-info pb-0 mb-0">
            Show Details
          </button>
    `;
    videoCardContainer.append(videoCard);
  });
};

// show video by category
const showCategoryVideo = async (categoryId, clickedBtn) => {
  videoCardContainer.innerHTML = "";
  showLoader();
  //remove ative classes and only add to clicked btn
  removeActiveClass();
  clickedBtn.classList.add("active");
  const response = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/category/${categoryId}`
  );
  const data = await response.json();
  setTimeout(() => {
    displayVideos(data.category);
  }, 400);
};

//show detials modal
const showDetailsModal = async (videoId) => {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";
  const response = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
  );
  const data = await response.json();
  const video = data.video;

  modalContainer.innerHTML = `
  <dialog id="details_modal" class="modal">
    <div class="modal-box">
    <h3 class="text-lg font-bold">${video.title}</h3>
    <div class="w-[200px] my-3">
        <img src="${video.thumbnail}" alt="" />
    </div>
    <p class="py-4">${video.description}</p>
    <div class="modal-action">
        <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
        </form>
    </div>
    </div>
</dialog>
  `;

  document.getElementById("details_modal").showModal();
};

// search input handler
const searchInput = document.querySelector("#search-box");
searchInput.addEventListener("keyup", function (evt) {
  getSearchData(evt.target.value);
});
// get video by title
const getSearchData = async (title) => {
  videoCardContainer.innerHTML = "";
  showLoader();
  const response = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${title}`
  );
  const data = await response.json();
  setTimeout(() => {
    closeLoader();
    displayVideos(data.videos);
  }, 200);
};
