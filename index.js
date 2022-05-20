let imagesData;

const getData = async () => {
  await fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      imagesData = data;
    })
    .catch((err) => console.log(err));
};
await getData();
console.log(imagesData);

const imageFolder = document.querySelector(".image_folder");
imagesData.forEach((image, index) => {
  const imageUrl = document.createElement("li");
  imageUrl.className = "image_url";
  imageUrl.id = `image-${index}`;
  // imageUrl.addEventListener('click', )
  imageUrl.innerHTML = `
        <img src="${image.previewImage}" class="image_url_preview"/>
        <p class="image_url_title">${image.title}</p>
    `;
  imageFolder.append(imageUrl);
});

const imageUrlPointer = 1;

const PreviewSelectedImage = () => {
  const image = imagesData[imageUrlPointer];
  document.querySelector(".image_container").innerHTML = `
        <img src="${image.previewImage}"/>
        <input type="text" value="${image.title}"/>
    `;
};

PreviewSelectedImage();

document.body.addEventListener("keydown", (event) => {
  const pressedKey = event.key;
  if (pressedKey === "ArrowDown") {
    imageUrlPointer += 1;
    PreviewSelectedImage();
  }
  if (pressedKey === "ArrowUp") {
    imageUrlPointer -= 1;
    PreviewSelectedImage();
  }
});
