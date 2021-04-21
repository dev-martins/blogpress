const express = require('express');
const router = express.Router();
const User = require('./User');
const multer = require('multer');
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
    res.send('<h1>Login</h1>');
})

router.get('/admin/users/index', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', { users: users });
    })
})

router.get('/admin/users/new', (req, res) => {
    res.render('admin/users/new');
})

router.post('/admin/users/store', upload.single('image'), (req, res) => {
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

router.get('/admin/users/edit/:id', (req, res) => {
    User.findByPk(req.params.id).then(user => {
        res.render("admin/users/new", { user: user });
    })
})


/**
 * remover usuário
 */

 router.post('/admin/users/destroy', (req, res) => {
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