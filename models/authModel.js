const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const {hash} = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 28,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    }
}, {timestamps: true})

userSchema.pre("save", function (next) {
    let user = this
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
    })
})

userSchema.methods = {
    authenticate: function (password) {
        const hash_password = this.password
        return bcrypt.compare(String(password), hash_password)
    }
}

const UserModel = mongoose.model("users", userSchema)
module.exports = UserModel