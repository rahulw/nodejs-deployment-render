const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps : true})

categorySchema.path('name').validate(async (name) => {
    const nameCount = await mongoose.models.category.countDocuments({ name })
    return !nameCount;
  }, 'Name already exists');

module.exports = mongoose.model('category', categorySchema);

