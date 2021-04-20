const express = require("express");
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');

/**
 * exibir artigo
 */
router.get("/admin/articles/index", (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles });
    })

});

router.get("/single/:slug", (req, res) => {
    Article.findOne({
        where: {
            slug: req.params.slug
        }
    }).then(article => {
        Category.findAll().then(categories => {
            res.render("article", { article: article, categories: categories });
        })

    })

});

/**
 * paginate
 */
router.get("/articles/page/:number", (req, res) => {
    let page = req.params.number;
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
/**
 * página de criação de artigos
 */
router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories });
    })

});

/**
 * criar artigo
 */

router.post('/admin/articles/store', (req, res) => {
    if (req.body.categoryId) {
        Article.create({
            title: req.body.title,
            slug: slugify(req.body.title),
            body: req.body.body,
            categoryId: req.body.categoryId
        }).then(() => {
            res.redirect('/admin/articles/index')
        })
    } else {
        res.redirect('/admin/articles/new')
    }

})

/**
 * editar artigo
 */

router.get('/admin/articles/edit/:id', (req, res) => {
    Article.findByPk(req.params.id).then(article => {
        Category.findAll().then(categories => {
            res.render("admin/articles/new", { article: article, categories: categories });
        })

    })
})

router.post('/admin/articles/update', (req, res) => {
    if (req.body.title) {
        Article.update({
            title: req.body.title,
            slug: slugify(req.body.title),
            body: req.body.body,
            categoryId: req.body.categoryId
        },
            {
                where: {
                    id: req.body.id
                }
            }
        ).then(() => {
            res.redirect("/admin/articles/index");
        })
    }
})

/**
 * remover artigo
 */

router.post('/admin/articles/destroy', (req, res) => {
    if (req.body.id) {
        Article.destroy({
            where: {
                id: req.body.id
            }
        })
        res.redirect("/admin/articles/index");
    }
})

module.exports = router;