// For DB Schema

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passportLocalMongoose = require('passport-local-mongoose')

// create posts schema
const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    }
});

const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    phone:Number
}) ;
UserSchema.plugin(passportLocalMongoose); //also auto salt and hash password
module.exports = mongoose.model("User",UserSchema);

const data = mongoose.model('Posts', PostsSchema);

module.exports = data;