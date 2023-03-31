
let dataArray = []

const pictureBlock = document.querySelector('.pictures')

const postsFragment = new DocumentFragment();



function createPhoto(data){
    const pictureContainer = document.getElementById('picture');
    const pictureNode = pictureContainer.content.cloneNode(true);

    pictureNode.querySelector('.picture__img').src = data.url;
    pictureNode.querySelector('.picture__comments').innerText = data.comment.length;
    pictureNode.querySelector('.picture__likes').innerText = data.likes;  
    postsFragment.append(pictureNode)
}

function addPhoto(array) {
    array.forEach((data) => createPhoto(data));
    pictureBlock.append(postsFragment)
}



const imgUploudPrevie = document.querySelector('.img-upload__preview img');
const uploadFile = document.querySelector('#upload-file');
const fileReader = new FileReader();
let imageBit;
uploadFile.addEventListener('change', () => {
    const uploadFileFirst = uploadFile.files[0]
    fileReader.onloadend = function(){
        imgUploudPrevie.src = this.result
        imageBit = this.result;
    }
    if(uploadFileFirst){
        fileReader.readAsDataURL(uploadFileFirst);
    }   
})


// ebany server

async function getResponse(array){
    let resp = await fetch("http://localhost:9000/posts");
    let arrayImage =  await resp.text()
    array = JSON.parse(arrayImage)

    console.log(JSON.parse(arrayImage))
    addPhoto(array)
}
getResponse(dataArray)

const form = document.querySelector('.img-upload__form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPost = await formSubmit();
    dataArray.push(newPost)
});
async function formSubmit() {
    let newImageData = {
        id: 0,
        url: imageBit,
        avatar: '',
        likes: 0,
        comments: 0,
    };
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newImageData).toString()
    };

    return fetch("http://localhost:9000/post", requestOptions)

    .then(response => response.json())
    .then((data) => {
       console.log(data);
        return data;
    });
}
