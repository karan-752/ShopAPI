const express = require('express');
const router = express.Router();
const checkAuth = require('../MiddleWare/check-auth');
const multer = require('multer');
const ProductsController = require('../Controllers/products');
const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './Uploads/');
    },
    filename : function(req, file, cb) {
        cb(null, file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);     //Accept a File
    } else {
        cb(null, false);    //Reject a File
    }
};
const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 2
    },
    fileFilter: fileFilter
});

router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete);

module.exports = router;