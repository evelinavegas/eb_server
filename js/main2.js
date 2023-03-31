const http = require('http');
const fs = require('fs');
const countOffer = 25;
const countComment = 6

const RENGE_COMMENT = {
    min: 0,
    max: 100
}
const descriptions = [
    'Фото, заряджене на позитив.',
    'Теплі спогади в холодну пору року.',
    'Впіймав дзен.',
    'Як довго ми робили цей кадр? Ваші пропозиції.'
];

const message = [
    'Все відмінно!',
    'Загалом все непогано. Але не всі.',
    'Коли ви робите фотографію, добре б прибирати палець із кадру. Зрештою, це просто непрофесійно.',
    'Моя бабуся випадково чхнула з фотоапаратом у руках і у неї вийшла фотографія краща.',
    'Я послизнувся на банановій шкірці і впустив фотоапарат на кота і у мене вийшла фотографія краще.',
    'Обличчя людей на фотці перекошені, ніби їх побивають. Як можна було зловити такий невдалий момент?'
]

const nameArray = [
    'Йосип',
    'Матвій',
    'Адріан',
    'Юрій',
    'Юліан',
    'Уляна',
    'Валентина',
    'Тіна',
    'Устина',
    'Жанна'
];
const dataArray = new Array(countOffer).fill(null).map((e, index)=>getOffer(index));
const arrayComments = new Array(countOffer).fill(null).map((e, index)=>getComment());


function getComment(){
    let comments = [];
    for (let i = 0; i < getRandomCount(RENGE_COMMENT.min, RENGE_COMMENT.max); i++) {
        let comment = {
            id: i,
            avatar: getAvatar(countComment),
            message: getRandomValue(message),
            name: getRandomValue(nameArray)
        }
        comments.push(comment);
    }

    return comments;
}


function getRandomCount(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomValue(array) {
    const randomIndex = getRandomCount(1, array.length);
    const value = array[randomIndex];
    return value
}


function getAvatar(i) {
    const randomIndex = getRandomCount(1, i);
    const avatar =  `img/avatar-${randomIndex}.svg`
    return avatar
}


function getOffer(index) {
    let commentaries = getComment();
    return {
        id: index + 1,
        url: `./photos/${index + 1}.jpg`,
        description: getRandomValue(descriptions),
        likes: getRandomCount(15, 200),
        comment: commentaries
    }
}


fs.writeFileSync('data.txt', JSON.stringify(dataArray));
http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*');

    res.writeHead(200, {'Content-Type': 'application/json'});
    const url = req.url;

    if(url ==='/photos') {
        const data = fs.readFileSync('data.txt', 'utf8');
        res.end(data);
    }else if(url ==='/post') {
        const dataOffer = fs.readFileSync('data.txt', 'utf8');
        const dataOfferJSON = JSON.parse(dataOffer)
        let responseString = '';
        req.on("data", (data) => {
            let stringData = data.toString('utf8');
            let stringDataParse = JSON.parse(stringData);
            stringDataParse.id = dataOfferJSON.length;

            dataOfferJSON.push(stringDataParse);
            console.log(dataOfferJSON);
            fs.writeFileSync('data.txt', JSON.stringify(dataOfferJSON));

            responseString = JSON.stringify(dataOfferJSON);
        });
        req.on('end', () => {
            res.end(responseString);
        });
    else {
        res.write('Wrong route');
        res.end();
    }

}).listen(9000)
