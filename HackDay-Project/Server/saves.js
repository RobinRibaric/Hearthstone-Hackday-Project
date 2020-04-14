const app = require('express')();


let presidents = [
    {
        id: '43',
        from: '2001',
        to: '2009',
        name: 'George W. Bush'
    },
    {
        id: '44',
        from: '2009',
        to: '2017',
        name: 'Barack Obama'
    },
    {
        id: '45',
        from: '2017',
        name: 'Donald Trump'
    }
];

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const nextId = (presidents) => {
    const highestId = presidents.reduce((a, c) => c.id > a ? c.id : a, 0);
    return Number.parseInt(highestId) + 1;
};

app.get('/api/presidents', (req, res) => {
    res.status(200).json(presidents);
});

app.get('/api/presidents/:id', (req, res) => {
    try {
        checkIfIdExists(req.params.id);
        const president = getPresident(req.params.id);
        res.status(200).json(president);
    } catch (err) {
        console.log(err);
        res.status(404).end();
    }
});

app.post('/api/presidents', (req, res) => {
    try {
        req.body = Object.assign({ id: nextId(presidents).toString() }, req.body);
        validatePresident(req.body);
        presidents.push(req.body);
        res.status(201).end();
    } catch (err) {
        console.log(err);
        res.status(400).end();
    }
});

app.put('/api/presidents/:id', (req, res) => {
    try {
        req.body = Object.assign({ id: req.params.id }, req.body);
        checkIfIdExists(req.body.id);
        validatePresident(req.body);
        updatePresident(req.body);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(404).end();
    }
});

app.delete('/api/presidents/:id', (req, res) => {
    try {
        checkIfIdExists(req.params.id);
        deletePresident(req.params.id);
        res.status(204).json(presidents);
    } catch (err) {
        console.log(err);
        res.status(404).end();
    }
});


function updatePresident(updatedPresident) {
    presidents.forEach(function (item, i) { if (item.id === updatedPresident.id) presidents[i] = updatedPresident; });
}

function checkIfIdExists(id) {
    const result = presidents.find(president => president.id === id);
    if (!result) {
        throw new Error('president with given id does not exist');
    }
}

function getPresident(id) {
    return presidents.find(president => president.id === id);
}


function deletePresident(id) {
    presidents = presidents.filter(president => president.id !== id);
}

function validatePresident(obj) {
    if (!obj.from || !obj.name) { throw new Error('the president object must have the keys name and from(year-YYYY)'); }
    if (!(/^([0-9]{4})$/).test(obj.from)) { throw new Error('from should be a year as a string "YYYY'); }
    if (typeof obj.from !== 'string') { throw new Error('all values must be in string-format'); }
    if (obj.to && !(/^([0-9]{4})$/).test(obj.to)) { throw new Error('to should be a year as a string "YYYY'); }
    if (obj.to && typeof obj.to !== 'string') { throw new Error('to should be a year as a string "YYYY'); }
}



module.exports.app = app;
module.exports.db = () => presidents;
module.exports.nextId = () => nextId(presidents);