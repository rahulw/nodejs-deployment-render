const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('./db');
const userRoute = require('./Signup-module/signup-route');
const loginRoute = require('./Login-module/login-route');
const categoryRoute = require('./Category-module/category.route');
const productRoute = require('./Products-module/product-route');

app.use(express.json());
app.use(cors());
app.use('/', userRoute);
app.use('/', loginRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/images', express.static(path.join("uploads/images")));

app.listen(5000);
