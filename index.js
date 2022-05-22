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

const ShortenText = (string) => {
  const splitIndex = Math.floor(string.length * 0.6);
  const firstPart = string.substr(0, splitIndex);
  const secondPart = string.substr(splitIndex);
  return `
    <span class="image_file_title_left"> ${firstPart}</span>
    <span class="image_file_title_right"> ${secondPart}</span>
  `;
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
    document.querySelector(`#image-${sidebarLinePointer} p`).innerHTML =
      ShortenText(event.target.value);
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
            <div class="image_file_title">${ShortenText(image.title)}</div>
        `;

    if (index === sidebarLinePointer) {
      Object.assign(imagefile.style, HIGHLIGHTED_SIDEBAR_FILE_PROP);
    }

    imageFolder.append(imagefile);
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
