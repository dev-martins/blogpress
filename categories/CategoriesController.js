const express = require("express");
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');


router.get("/admin/categories/index", (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', { categories: categories })
    })
});

/**
 * criar nova categoria
 */
router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new");
});

router.post('/admin/categories/store', (req, res) => {
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

router.get('/admin/categories/edit/:id', (req, res) => {
    Category.findByPk(req.params.id).then(category => {
        res.render("admin/categories/new", { category: category });
    })
})

/**
 * remover categoria
 */

router.post('/admin/categories/destroy', (req, res) => {
    if (req.body.id) {
        Category.destroy({
            where: {
                id: req.body.id
            }
        })
        res.redirect("/admin/categories/index");
    }
})


module.exports = router;