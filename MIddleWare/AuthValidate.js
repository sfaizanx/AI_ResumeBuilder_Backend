const joi = require('joi');

const sigupValidation = (req,res,next) =>{
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(10)
    })

    const {error} = schema.validate(req.body)
    if(error){
        return res.status(400)
        .json({ message: "bad request", error})
    }
    next();
}

const loginValidation = (req,res,next) =>{
    const schema = joi.object({
        email: joi.string().email(),
        password: joi.string().min(4).max(10),
        googleAuth: joi.string(),
    }).or('googleAuth', 'email');

    const {error} = schema.validate(req.body)
    if(error){
        return res.status(400)
        .json({ message: error.details[0].message, success: false});
    }
    next();
}

module.exports = {sigupValidation, loginValidation }