let imagesData = [];
let imageUrlPointer = 0;

const highlightedUrlProp = {
  backgroundColor: "#2459c9",
  color: "white",
};

const normalUrlProp = {
  backgroundColor: "white",
  color: "black",
};

const maxCharacters = 35;

const ShortenText = (string) => {
  if (string.length < maxCharacters) return string;
  return (
    string.substring(0, maxCharacters / 2 - 1) +
    "..." +
    string.substring(string.length - maxCharacters / 2 + 2, string.length)
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
await GetData();

const PreviewSelectedImage = () => {
  const image = imagesData[imageUrlPointer];
  const imageContainer = document.querySelector(".image_container");
  imageContainer.innerHTML = `
            <img src="${image.previewImage}"/>
            <input type="text" value="${image.title}"/>
        `;
  imageContainer.querySelector("input").addEventListener("change", (event) => {
    imagesData[imageUrlPointer].title = event.target.value;
    document.querySelector(`#image-${imageUrlPointer} p`).innerHTML =
      ShortenText(event.target.value);
  });
};

const UpdateCompsWithPointerChange = (newUrlPointer) => {
  newUrlPointer = parseInt(newUrlPointer);
  if (newUrlPointer === imageUrlPointer) return;
  Object.assign(
    document.querySelector(`#image-${newUrlPointer}`).style,
    highlightedUrlProp
  );
  Object.assign(
    document.querySelector(`#image-${imageUrlPointer}`).style,
    normalUrlProp
  );
  imageUrlPointer = newUrlPointer;
  PreviewSelectedImage();
};

const InitializeApp = () => {
  const imageFolder = document.querySelector(".image_folder");
  imagesData.forEach((image, index) => {
    const imageUrl = document.createElement("li");
    imageUrl.className = "image_url";
    imageUrl.id = `image-${index}`;
    imageUrl.addEventListener("click", (event) => {
      let element = event.target;
      while (element.className !== "image_url") element = element.parentNode;
      const newUrlPointer = element.id.split("-")[1];
      UpdateCompsWithPointerChange(newUrlPointer);
    });
    imageUrl.innerHTML = `
            <img src="${image.previewImage}" class="image_url_preview"/>
            <p class="image_url_title">${ShortenText(image.title)}</p>
        `;
    if (index === imageUrlPointer) {
      Object.assign(imageUrl.style, highlightedUrlProp);
    }
    imageFolder.append(imageUrl);
  });

  PreviewSelectedImage();

  document.body.addEventListener("keydown", (event) => {
    const pressedKey = event.key;
    if (pressedKey === "ArrowDown") {
      console.log(imageUrlPointer);
      UpdateCompsWithPointerChange((imageUrlPointer + 1) % imagesData.length);
    }
    if (pressedKey === "ArrowUp") {
      UpdateCompsWithPointerChange(
        (imageUrlPointer - 1 + imagesData.length) % imagesData.length
      );
    }
  });
};

InitializeApp();
