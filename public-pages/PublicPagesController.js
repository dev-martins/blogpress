const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('../articles/Article');

router.get('/', (req, res) => {
    Article.findAll({
        include: [{ model: Category }],
        limit:3,
        order:
            [
                [
                    "id", "DESC"
                ]
            ]

    }).then(articles => {
        Category.findAll({
            order:
                [
                    [
                        "title", "ASC"
                    ]
                ]
        }).then(categories => {
            res.render("index", { articles: articles,categories:categories });
        })

    })
})

module.exports = router;