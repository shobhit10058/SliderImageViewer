
let imagesData;

const getData = async() =>{
    await fetch('./data.json').
    then(response => response.json())
    .then(data => {imagesData = data})
    .catch(err => console.log(err));
}
await getData();
console.log(imagesData);

const imageFolder = document.querySelector(".image_folder");
imagesData.forEach(image => {
    const imageUrl = document.createElement("li");
    imageUrl.className = "image_url"
    imageUrl.innerHTML = `
        <img src="${image.previewImage}" class="image_url_preview"/>
        <p class="image_url_title">${image.title}</p>
    `;
    imageFolder.append(imageUrl);
});

const imageUrlPointer = 0;

const PreviewSelectedImage = () => {
    const image = imageFolder[imageUrlPointer];
    document.querySelector(".image_container").innerHTML = `
        <img src="${image.previewImage}"/>
        <input type="text" value="${image.title}"
    `
}

PreviewSelectedImage()