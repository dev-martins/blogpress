const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")

// view engina
app.set('view engine', 'ejs');

// arquivos estaticos
app.use(express.static('public'));

// dados de formulário
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// conexão
connection.authenticate().then(()=>{
    console.log('Conexão bem sucedida!')
}).catch((error)=>{
    console.log(error);
})

app.get('/', (resq, resp) => {
    resp.render("index");
})

app.use('',categoriesController);
app.use('',articlesController);

app.listen(8080, () => {
    console.log("servidor rodando...");
})