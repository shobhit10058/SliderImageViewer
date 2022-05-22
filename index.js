const HIGHLIGHTED_SIDEBAR_FILE_PROP = {
  backgroundColor: "#2459c9",
  color: "white",
};

const NORMAL_SIDEBAR_FILE_PROP = {
  backgroundColor: "white",
  color: "black",
};

const MAX_CHARACTERS_IN_SIDEBAR_LINE = 34;

let imagesData = [];
let sidebarLinePointer = 0;

const ShortenText = (string) => {
  if (string.length <= MAX_CHARACTERS_IN_SIDEBAR_LINE) return string;

  return (
    string.substring(0, MAX_CHARACTERS_IN_SIDEBAR_LINE / 2 - 1) +
    "..." +
    string.substring(
      string.length - MAX_CHARACTERS_IN_SIDEBAR_LINE / 2 + 2,
      string.length
    )
  );
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
            <p class="image_file_title">${ShortenText(image.title)}</p>
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
