const productModel = require('./product-model');
const categoryModel = require('../Category-module/category-model');

// Add product
exports.addProduct = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const newProductModel = new productModel({
        name: req.body.name,
        image: url + "/images/" + req.file.filename,
        price: req.body.price,
        categoryId: req.body.categoryId,
        qty: req.body.qty,
        color: req.body.color,
        isActive: req.body.qty == '' || req.body.qty == 0 ? false : req.body.isActive
    })
    newProductModel.save()
        .then(function (create) {
            res.status(201).json({ create, message: 'Product added successfully' });
        })
        .catch(function (err) {
            console.log('category', err);
            next(err);
        });
}

// Search gllobally
exports.search = async (req, res) => {
    const searchString = String(req.query.search || '');
    if (!searchString) {
        return res.status(400).json({ error: 'Search string is empty' });
      }
    let list = await productModel.find({
        $or: [
            { "name": { $regex: new RegExp(searchString, 'i') } },
            { "color": { $regex: new RegExp(searchString, 'i') } }
        ]
    });
    let searchCount = list.length;
    res.status(200).json({ list, searchCount });
}

// Get product
exports.getProduct = async (req, res) => {
    let query = {
        $and: [{ isDeleted: false }]
    };
    let categoryId;
    if (req.query.search && req.query.searchfield) {
        if (req.query.searchfield == 'name') {
            query.$and.push({ "name": { $regex: req.query.search, $options: 'i' } })
        }
        else if (req.query.searchfield == 'qty') {
            // query.$and.push({ "qty": { $regex: Number(req.query.search), $options: 'i' } })
            query = { $and: [{ qty: Number(req.query.search) }, { isDeleted: false }] };
        }
        else if (req.query.searchfield == 'color') {
            query.$and.push({ "color": { $regex: req.query.search, $options: 'i' } })
        }
        else if (req.query.searchfield == 'status') {
            statusSearch = req.query.search.toLowerCase() == 'yes' ? true : req.query.search.toLowerCase() == 'no' ? false : null;
            // query = { $or: [{ isActive: statusSearch }] };
            query = { $and: [{ isActive: statusSearch }, { isDeleted: false }] };
        }
        else if (req.query.searchfield == 'category') {
            const categoryRecord = await categoryModel.findOne({
                name: { $regex: req.query.search, $options: 'i' },
                isDeleted: false
            });
            if (categoryRecord) {
                categoryId = categoryRecord._id.toHexString();
                query.$and.push({ "categoryId": { $regex: categoryId } })
            } else {
                return res.status(404).json({
                    error: 'Requested product does not exist'
                });
            }
        }
        else { }
    }
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 20;
    let skip = (page - 1) * limit;
    let sortOrder = req.query.sortOrder || 'desc';
    var sortObj = new Object;
    sortObj[req.query.sortColumn || 'createdDate'] = sortOrder;
    let lists, searchCount;

    productModel.find(query).then(list => {
        lists = list;
        searchCount = lists.length;
        return lists;
    })

    productModel.find(query)
        .skip(skip).limit(limit).collation({ locale: "en", caseFirst: 'upper' }).sort(sortObj)
        .then(list => {
            return res.status(200).json({
                list: list,
                count: searchCount
            })
        })
        .catch(function (err) {
            console.log(err);
            next(err);
        });
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.params, isDeleted: false });
        if (!product || product.isDeleted === true) {
            return res.status(404).json({
                error: 'Requested product does not exist'
            });
        }
        const deleteRecord = {
            isDeleted: true
        }
        const deletedProduct = await productModel.findByIdAndUpdate(
            req.params,
            { $set: deleteRecord },
            { new: true }
        )
        res.status(200).json({ deletedProduct, message: "Product has been deleted" });
    }
    catch (error) {
        res.status(400).json({
            error: "Something wrong"
        });
    }
};

// Get by Id product
exports.getById = async (req, res) => {
    try {
        const productById = await productModel.findOne({ _id: req.params, isDeleted: false });
        if (!productById || productById.isDeleted === true) {
            return res.status(404).json({
                error: 'Requested product does not exist'
            });
        }
        res.status(200).json(productById);
    }
    catch (error) {
        res.status(400).json({
            error: "Something wrong"
        });
    }
};

// Update product
exports.updateById = async (req, res) => {
    try {
        const productById = await productModel.findOne({ _id: req.params, isDeleted: false });
        if (!productById || productById.isDeleted === true) {
            return res.status(404).json({
                error: 'Requested product does not exist'
            });
        }
        const url = req.protocol + '://' + req.get("host");
        // const updateRecord = {
        //     name: req.body.name,
        //         image: url + "/images/" + req.file.filename ,
        //         price: req.body.price,
        //         categoryId: req.body.categoryId,
        //         qty: req.body.qty,
        //         color: req.body.color,
        //         isActive: req.body.qty == '' || req.body.qty == 0 ? false : req.body.isActive
        // }
        req.body.isActive = req.body.qty == '' || req.body.qty == 0 ? false : req.body.isActive;
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params,
            { $set: req.body },
            { new: true })
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        return res.status(400).json({
            error: "Something wrong"
        });
    }
};