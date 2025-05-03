const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '..', 'new3')));


app.get('/', (req, res) => {
    res.render('first');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
