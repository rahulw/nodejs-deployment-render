const express = require('express');
const productRouter = new express.Router();
const productController = require('./product-controller');
const authMiddleWare = require('../auth-middleware');
const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg' : 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid) {
            error = null;
        }
        cb(error, "uploads/images");
    },
    filename: (req, file, cb) => {
       const name = file.originalname.toLowerCase().split(' ').join('-');
       const ext = MIME_TYPE_MAP[file.mimetype];
       cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

productRouter.get("/search", productController.search);
productRouter.get("/", authMiddleWare.isLoggedIn, productController.getProduct);
productRouter.post("/createproduct", authMiddleWare.isLoggedIn, multer({storage: storage}).single("image"), productController.addProduct);
productRouter.delete("/deleteproduct/:_id", authMiddleWare.isLoggedIn, productController.deleteProduct);
productRouter.get("/editproduct/:_id", authMiddleWare.isLoggedIn, productController.getById);
productRouter.put("/updateproduct/:_id", authMiddleWare.isLoggedIn, multer({storage: storage}).single("image"), productController.updateById);

module.exports = productRouter;