const HIGHLIGHTED_SIDEBAR_FILE_PROP = {
  backgroundColor: "#2459c9",
  color: "white",
};

const NORMAL_SIDEBAR_FILE_PROP = {
  backgroundColor: "white",
  color: "black",
};

let imagesData = [];
let sidebarLinePointer = 0;

const SplitAndShortenFileName = (imageFileTitleElem, string) => {
  let availableWidth = imageFileTitleElem.clientWidth;
  let rightPartFileTitle = imageFileTitleElem.querySelector(
      ".image_file_title_right"
    ),
    leftPartFileTitle = imageFileTitleElem.querySelector(
      ".image_file_title_left"
    );

  if (!rightPartFileTitle) {
    rightPartFileTitle = document.createElement("span");
    rightPartFileTitle.classList.add("image_file_title_right");
    imageFileTitleElem.append(rightPartFileTitle);
  } else {
    rightPartFileTitle.innerHTML = "";
  }

  if (!leftPartFileTitle) {
    leftPartFileTitle = document.createElement("span");
    leftPartFileTitle.classList.add("image_file_title_left");
    imageFileTitleElem.prepend(leftPartFileTitle);
  } else {
    leftPartFileTitle.innerHTML = "";
  }

  let rightIndex = string.length - 1;
  while (
    rightIndex >= 0 &&
    rightPartFileTitle.clientWidth < availableWidth / 2
  ) {
    rightPartFileTitle.innerHTML =
      string[rightIndex--] + rightPartFileTitle.innerHTML;
  }

  rightPartFileTitle.innerHTML = rightPartFileTitle.innerHTML.substring(1);
  rightIndex++;

  let availableLeftWidth = availableWidth - rightPartFileTitle.clientWidth;
  let leftIndex = 0;
  while (
    rightIndex >= leftIndex &&
    leftPartFileTitle.clientWidth < availableLeftWidth
  ) {
    leftPartFileTitle.innerHTML =
      leftPartFileTitle.innerHTML + string[leftIndex++];
  }

  if (leftPartFileTitle.clientWidth >= availableLeftWidth) {
    leftPartFileTitle.innerHTML = leftPartFileTitle.innerHTML.slice(0, -1);
    leftIndex--;
  }

  if (leftIndex <= rightIndex) {
    let currLeftString = leftPartFileTitle.innerHTML.slice(0, -3);
    leftPartFileTitle.innerHTML = currLeftString + "...";
    leftIndex -= 3;
    while (
      rightIndex >= leftIndex &&
      leftPartFileTitle.clientWidth < availableLeftWidth
    ) {
      currLeftString += string[leftIndex++];
      leftPartFileTitle.innerHTML = currLeftString + "...";
    }
    if (leftPartFileTitle.clientWidth >= availableLeftWidth) {
      currLeftString = currLeftString.slice(0, -1);
      leftPartFileTitle.innerHTML = currLeftString + "...";
    }
  }
};

const GetData = async () => {
  await fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      imagesData = data;
    })
    .catch((err) => console.log(err));
};

const PreviewSelectedImage = () => {
  const image = imagesData[sidebarLinePointer];

  const imageContainer = document.querySelector(".image_container");

  imageContainer.innerHTML = `
            <img src="${image.previewImage}"/>
            <input type="text" value="${image.title}"/>
        `;

  imageContainer.querySelector("input").addEventListener("change", (event) => {
    imagesData[sidebarLinePointer].title = event.target.value;

    document
      .querySelector(`#image-${sidebarLinePointer}`)
      .setAttribute("title", event.target.value);

    SplitAndShortenFileName(
      document.querySelector(`#image-${sidebarLinePointer} div`),
      event.target.value
    );
  });
};

const UpdateCompsWithPointerChange = (newSidebarLinePointer) => {
  newSidebarLinePointer = parseInt(newSidebarLinePointer);

  if (newSidebarLinePointer === sidebarLinePointer) return;

  Object.assign(
    document.querySelector(`#image-${newSidebarLinePointer}`).style,
    HIGHLIGHTED_SIDEBAR_FILE_PROP
  );

  Object.assign(
    document.querySelector(`#image-${sidebarLinePointer}`).style,
    NORMAL_SIDEBAR_FILE_PROP
  );

  sidebarLinePointer = newSidebarLinePointer;

  PreviewSelectedImage();
};

const InitializeApp = () => {
  const imageFolder = document.querySelector(".image_folder");

  imagesData.forEach((image, index) => {
    const imagefile = document.createElement("li");

    imagefile.className = "image_file";
    imagefile.id = `image-${index}`;

    imagefile.addEventListener("click", (event) => {
      let element = event.target;

      while (element.className !== "image_file") element = element.parentNode;

      const newSidebarLinePointer = element.id.split("-")[1];

      UpdateCompsWithPointerChange(newSidebarLinePointer);
    });

    imagefile.innerHTML = `
            <img src="${image.previewImage}" class="image_file_preview"/>
            <div class="image_file_title"></div>
        `;

    if (index === sidebarLinePointer) {
      Object.assign(imagefile.style, HIGHLIGHTED_SIDEBAR_FILE_PROP);
    }
    imageFolder.append(imagefile);
    SplitAndShortenFileName(imagefile.querySelector("div"), image.title);
    imagefile.setAttribute("title", image.title);
  });

  PreviewSelectedImage();

  document.body.addEventListener("keydown", (event) => {
    const pressedKey = event.key;

    if (pressedKey === "ArrowDown") {
      UpdateCompsWithPointerChange(
        (sidebarLinePointer + 1) % imagesData.length
      );
    }

    if (pressedKey === "ArrowUp") {
      UpdateCompsWithPointerChange(
        (sidebarLinePointer - 1 + imagesData.length) % imagesData.length
      );
    }
  });
};

await GetData();
InitializeApp();
