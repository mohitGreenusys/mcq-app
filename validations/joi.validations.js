const joi = require('joi');

const registerValidation = joi.object({
    name:joi.string().required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required(),
    employeeId:joi.string().required(),
})

const loginValidation = joi.object({
    employeeId:joi.string(),
    password:joi.string().min(6).required(),
})

const adminRegisterValidation = joi.object({
    name:joi.string().required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required(),
})

const addQuestionValidation = joi.object({
    question:joi.string().required(),
    option1:joi.string().required(),
    option2:joi.string().required(),
    option3:joi.string().required(),
    option4:joi.string().required(),
    answer:joi.string().required(),
})

module.exports = {
    registerValidation,
    loginValidation,
    adminRegisterValidation,
    addQuestionValidation,
}