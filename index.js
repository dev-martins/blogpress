const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database');

/**
 * import routes
 */
const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const publicPagesController = require('./public-pages/PublicPagesController')
const usersController = require('./users/UsersController')

/**
 * import models
 */

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");
const router = require('./categories/CategoriesController');

// sessions
let sess = {
    secret: 'da39a3ee5e6b4b0d3255bfef95601890afd80709', cookie:{
        maxAge: 1800000 // 30 minutos
    }
}

app.use(session(sess))

// view engina
app.set('view engine', 'ejs');

// arquivos estaticos
app.use(express.static('public'));

// dados de formulário
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// conexão
connection.authenticate().then(() => {
    console.log('Conexão bem sucedida!')
}).catch((error) => {
    console.log(error);
})

app.use('', publicPagesController);
app.use('', categoriesController);
app.use('', articlesController);
app.use('', usersController);

app.listen(8080, () => {
    console.log("servidor rodando...");
})