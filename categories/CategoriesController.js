const express = require("express");
const router = express.Router();
const Category = require('./Category');
const Article = require('../articles/Article');
const AdminAuth = require('../middleware/middleware');
const slugify = require('slugify');


router.get("/admin/categories/index", AdminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', { categories: categories, login: req.session.user })
    })
});

/**
 * criar nova categoria
 */
router.get("/admin/categories/new", AdminAuth, (req, res) => {
    res.render("admin/categories/new", { login: req.session.user });
});

router.post('/admin/categories/store', AdminAuth, (req, res) => {
    if (req.body.title) {
        Category.create({
            title: req.body.title,
            slug: slugify(req.body.title)
        });
        res.redirect("/admin/categories/index");
    } else {
        res.redirect("/admin/categories/index");
    }
})

/**
 * editar categoria
 */

router.get('/admin/categories/edit/:id', AdminAuth, (req, res) => {
    Category.findByPk(req.params.id).then(category => {
        res.render("admin/categories/new", { category: category, login: req.session.user });
    })
})

router.post('/admin/categories/update', AdminAuth, (req, res) => {
    if (req.body.title) {
        Category.update({
            title: req.body.title,
            slug: slugify(req.body.title)
        },
            {
                where: {
                    id: req.body.id
                }
            }
        ).then(() => {
            res.redirect("/admin/categories/index");
        })
    }
})

/**
 * remover categoria
 */

router.post('/admin/categories/destroy', AdminAuth, (req, res) => {
    if (req.body.id) {
        Category.destroy({
            where: {
                id: req.body.id
            }
        })
        res.redirect("/admin/categories/index");
    }
})

/**
 * Buscar artigos por ategoria
 */

router.get('/category/:slug', (req, res) => {
    Category.findOne({
        where: {
            slug: req.params.slug
        },
        include: [{ model: Article }]
    }).then(category => {
        if (category) {
            Category.findAll().then(categories => {
                res.render('index', { articles: category.articles, categories: categories })
            })
        } else {
            res.redirect('/');
        }
    })
})


module.exports = router;