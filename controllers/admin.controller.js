const admin = require("../models/admin.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { adminRegisterValidation } = require("../validations/joi.validations.js");
const userModel = require("../models/user.model.js");
const { default: questionModel } = require("../models/question.model.js");
const questionPaperModel = require("../models/questionPaper.model.js");

const routes = {};

routes.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const { error } = adminRegisterValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const ifAdminExists = await admin.findOne({ email });

        if (ifAdminExists) return res.status(400).json({ error: "Email already exists" });

        const bcryptPassword = await bcrypt.hash(password, 12);
        const user = await admin.create({
            name,
            email,
            password: bcryptPassword,
        });

        return res.status(201).json({ result: user, message: "Admin registered successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await admin.findOne({ email });

        if (!user) return res.status(404).json({ error: "User not found" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ result: user, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.getUsers = async (req, res) => {
    try {
        const users = await userModel.find();

        return res.status(200).json({ result: users });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.getQuestions = async (req, res) => {
    try {
        const status = req.query.status;

        if (status) {
            if(status !== "active" && status !== "inactive") return res.status(400).json({ error: "Invalid status" });
            const  questions = await questionModel.find({ status });
            return res.status(200).json({ result: questions });
        }

        const questions = await questionModel.find();

        return res.status(200).json({ result: questions });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.addQuestion = async (req, res) => {
    try {
        const { img, question, answer, option1, option2, option3, option4 } = req.body;

        const { error } = addQuestionValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const newQuestion = await questionModel.create({
            img: img ? img : null,
            question,
            option1,
            option2,
            option3,
            option4,
            answer,
        });

        return res.status(201).json({ result: newQuestion, message: "Question added successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { img, question, answer, option1, option2, option3, option4 } = req.body;

        const { error } = addQuestionValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const updatedQuestion = await questionModel.findByIdAndUpdate(id, {
            img: img ? img : null,
            question,
            option1,
            option2,
            option3,
            option4,
            answer,
        }, { new: true });

        return res.status(200).json({ result: updatedQuestion, message: "Question updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        await questionModel.findByIdAndDelete(id);

        return res.status(200).json({ message: "Question deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

routes.makeQuestionPaper = async (req, res) => {
    try {
        const { questionIds, time, difficulty,  } = req.body;

        if(!questionIds) return res.status(400).json({ error: "Please enter all the fields" });

        const questionPaper = await questionPaperModel.create({
            questions:questionIds,
            time,
            difficulty,
        });

        return res.status(200).json({ result: questionPaper });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}