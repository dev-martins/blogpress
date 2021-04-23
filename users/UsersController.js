const express = require('express');
const router = express.Router();
const User = require('./User');
const multer = require('multer');
const AdminAuth = require('../middleware/middleware');
const bcrypt = require('bcryptjs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/users/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({ storage })


router.get('/login', (req, res) => {
    res.render('public-pages/auth/login');
})

router.post('/authenticate', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email,
        }
    }).then(user => {
        if (user) {
            let correct = bcrypt.compareSync(req.body.password, user.password);
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name
                }
                res.redirect('/admin/articles/index');
            } else {
                res.redirect('/login');
            }

        } else {
            res.redirect('/login');
        }

    })
})

router.get('/logout', (req, res) => {
    req.session.user = "";
    res.redirect('/');
})

router.get('/admin/users/index', AdminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', { users: users, login: req.session.user });
    })
})

router.get('/admin/users/new', (req, res) => {
    res.render('admin/users/new', { login: req.session.user });
})

router.post('/admin/users/store', AdminAuth, upload.single('image'), (req, res) => {
    let img = req.file.path.replace('public', '');
    let password = req.body.password;
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(email => {
        if (email) {
            res.redirect('/admin/users/new')
        } else {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            User.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: hash,
                image: img,
                email: req.body.email
            }).then(() => {
                res.redirect('/admin/users/index')
            })
        }

    })

})

router.get('/admin/users/edit/:id', AdminAuth, (req, res) => {
    User.findByPk(req.params.id).then(user => {
        res.render("admin/users/new", { user: user ,login: req.session.user});
    })
})


/**
 * remover usuário
 */

router.post('/admin/users/destroy', AdminAuth, (req, res) => {
    if (req.body.id) {
        User.destroy({
            where: {
                id: req.body.id
            }
        })
        res.redirect("/admin/users/index");
    }
})

module.exports = router;