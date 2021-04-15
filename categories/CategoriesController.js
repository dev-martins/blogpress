const express = require("express");
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');

router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new");
});

router.post('/admin/categories/store', (req, res) => {
    if (req.body.title) {
        Category.create({
            title: req.body.title,
            slug: slugify(req.body.title)
        });
        res.redirect("/admin/categories/new");
    } else {
        res.redirect("/admin/categories/new");
    }
})


module.exports = router;