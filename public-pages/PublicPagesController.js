const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('../articles/Article');

router.get('/', (req, res) => {
    let page = 1;
    let offset = 0;
    limit = 2;

    paginate(page,offset,limit,req,res);
})

function paginate(page,offset,limit,req,res){

    if (!isNaN(page) || page != 1) {
        offset = (parseInt(page) * limit) - limit;
    }

    Article.findAndCountAll({
        limit: limit,
        offset: offset
    }).then(articles => {

        var next = true;
        if (offset + limit >= articles.count) {
            next = false
        }

        let result = {
            perPage: Math.round(articles.count / limit),
            page:parseInt(page),
            next:next,
            articles:articles
        }
        Category.findAll().then(categories =>{
            res.render('public-pages/articles-paginate',{result:result,categories:categories});
        })
    })
}

module.exports = router;