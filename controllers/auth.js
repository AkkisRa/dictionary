const Users = require("../models/authModel")
const jwt = require("jsonwebtoken")

const signUp = (req, res) => {
    const {name, email, password} = req.body
    Users.findOne({email})
        .exec((error, user) => {
            if (user) {
                return res.status(400).json({error: "Email уже существует"})
            } else {
                let newUser = new Users({name, email, password})
                newUser.save((error, savedUser) => {
                    if (error) {
                        return res.status(400).json({error: "Ошибка сохранения"})
                    }
                    return res.json({message: "Пользователь успешно зарегистрирован. Войдите."})
                })
            }
        })
}
const signIn = (req, res) => {
    const {email, password} = req.body
    Users.findOne({email})
        .exec(async (error, user) => {
            if (error) {
                return res.status(400).json({error: "Пользователь не найден"})
            }

            const correctPassword = await user.authenticate(password)

            if (!correctPassword) {
                return res.status(400).json({error: "Email или password неверны"})
            }
            const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY, {expiresIn: "2d"})
            return res.json({
                token,
                user: {_id: user._id, name: user.name, email: user.email, role: user.role},
                message: ""
            })
        })
}
module.exports = {signUp, signIn}