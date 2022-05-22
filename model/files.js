const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/avatars')
const fileSchema = new mongoose.Schema({
    fileName:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    }
    
},{
    timestamps: true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
//// statics function
  fileSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');
  fileSchema.statics.avatarPath = AVATAR_PATH;
  
const File = mongoose.model('File',fileSchema);
module.exports = File;
