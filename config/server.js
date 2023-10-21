const express = require('express');
const app = express();

const port = process.env.port || 3000;

app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})

module.exports = app; 