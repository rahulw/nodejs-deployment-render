const categoryModel = require('./category-model');
const productModel = require('../Products-module/product-model');

// Add category
exports.addCategory = (req, res, next) => {
    categoryModel.create(req.body)
        .then(function (create) {
            res.status(201).json({ create, message: 'Category added successfully' })
        })
        .catch(function (err) {
            console.log('category', err);
            next(err);
        });
}

// Get category
exports.getCategory = (req, res) => {
    let query = {
        $and: [{ isDeleted: false }]
    };

    if (req.query.search) {
        query.$and.push({ "name": { $regex: req.query.search, $options: 'i' } })
    }

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 20;
    let skip = (page - 1) * limit;
    let sortOrder = req.query.sortOrder || 'desc'
    var sortObj = new Object;
    sortObj[req.query.sortColumn || 'createdDate'] = sortOrder;
    let lists, searchCount;

    categoryModel.find(query).then(list => {
        lists = list;
        searchCount = lists.length;
        return lists;
    })

    categoryModel.find(query)
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

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ _id: req.params, isDeleted: false });
        if (!category || category.isDeleted === true) {
            return res.status(404).json({
                error: 'Requested category does not exist'
            });
        }
        const product = await productModel.findOne({ categoryId: req.params, isDeleted: false });
        console.log(product, 'product');
        if (product) {
            res.status(400).json({
                error: "You can't delete this category. Products are exists for this category"
            });
        } else {
            const deleteRecord = {
                isDeleted: true
            }
            const deletedProduct = await categoryModel.findByIdAndUpdate(
                req.params,
                { $set: deleteRecord },
                { new: true })
            res.status(200).json({ deletedProduct, message: "Category has been deleted" });
        }
    }
    catch (error) {
        res.status(400).json({
            error: "Something wrong"
        });
    }
};

// Get by Id department
exports.getById = async (req, res) => {
    try {
        const categoryById = await categoryModel.findOne({ _id: req.params, isDeleted: false });
        if (!categoryById || categoryById.isDeleted === true) {
            return res.status(404).json({
                error: 'Requested category does not exist'
            });
        }
        res.status(200).json(categoryById);
    }
    catch (error) {
        res.status(400).json({
            error: "Something wrong"
        });
    }
};

// Update department
exports.updateById = async (req, res) => {
    try {
        const categoryById = await categoryModel.findOne({ _id: req.params, isDeleted: false });
        if (!categoryById || categoryById.isDeleted === true) {
            return res.status(404).json({
                error: 'Requested category does not exist'
            });
        }
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            req.params,
            { $set: req.body },
            { new: true })
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        return res.status(400).json({
            error: "Something wrong"
        });
    }
};
