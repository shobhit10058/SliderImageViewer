
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
    imageUrl.innerHTML = image.title;
    imageFolder.append(imageUrl);
});