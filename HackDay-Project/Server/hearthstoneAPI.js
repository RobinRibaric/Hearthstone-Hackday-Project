const express = require('express');
const fetch = require('node-fetch')
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

//constants
const token = "UScbkjgIbC6q261BqS3MfwtuKMTQSasc1N";
const port = 8000;
const allData = {
    allCards: '',
    card: '',
    text: '',
}

app.use(cors());
app.use(bodyParser.json());


//to make it faster create a function that fetches everthing when server is run
app.get('/cards', (req, res) => {
    if (req.query.page !== 1) {
        fetchAllCards(req.query.page);
    }
    res.status(200).send(allData.allCards);
})


app.post('/comments', (req, res) => {
    const stringToBeWritten = req.body.comment + "\n";
    fs.appendFile(`./Db/${req.body.cardID}`, stringToBeWritten, 'utf-8', (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.end();
})


app.get('/comments/:id', (req, res) => {

    fs.readFile(`./Db/${req.params.id}`, 'utf-8', (err, data) => {
        if (data !== undefined) {
            let splittedData = data.split(/\r?\n/).filter(item => item.length > 0);
            res.send(splittedData);
        } else {
            res.end();
        }
    })
})




app.listen(port, () => {
    console.log('server running on port 8000');
    fetchAllCards();
});


const fetchAllCards = async (query = 1) => {
    let data = '';
    await fetch(`https://us.api.blizzard.com/hearthstone/cards?locale=en_US&page=${query}&pageSize=600&access_token=${token}`)
        .then(res => res.json())
        .then(res => allData.allCards = res);

    return allData.allCards;
}










// const fetchOneCard = (cardId) => {
//     fetch(`https://us.api.blizzard.com/hearthstone/cards/${cardId}?locale=en_US&page=3&access_token=${token}`)
//         .then(res => res.json())
//         .then(res => allData.card = res);
//     console.log(allData.card);
//     return allData.card;
// }


// app.get('/cards', async (req, res, next) => {
//     let data = '';
//     //console.log(data);
//     if (data === '') {
//         await fetch(`https://us.api.blizzard.com/hearthstone/cards?locale=en_US&page=3&access_token=${token}`)
//             .then(res => res.json())
//             .then(res => data = res);
//     }
//     res.status(200).send(data);
// })

// app.get('/cards/:id', (req, res) => {
//     console.log(req.params.id)
//     const card = fetchOneCard(req.params.id);
//     //console.log(card);
//     res.status(200).send(card);
// })


 // let filteredData = data.filter(item => item.length > 0)
            // console.log(filteredData);
            //let splittedData = data.split(/\r?\n/).slice(1, -1);
