const User = require('../models/UserModel')
const asyncHandler = require('express-async-handler')

const authAdmin = asyncHandler(async(req, res, next) => {

    const user = await User.findOne({
        _id: req.user.id
    })

    if(user.role === 0) return res.json({msg: "you are not admin"})

    next()


})

module.exports = authAdmin