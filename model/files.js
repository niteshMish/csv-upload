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
        type:String,
        required:true
      },
      path:{
        type:String,
        required:true
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
      cb(null, file.fieldname + '-' + uniqueSuffix+".csv")
       File.create({
        fileName: file.originalname, 
        avatar:file.fieldname + '-' + uniqueSuffix+".csv",
        path: "./uploads/avatars/"+avatar
    })
    }
    ////
    
    ////
  })
//// statics function
  fileSchema.statics.uploadedAvatar = multer({
    storage: storage,
    fileFilter: (req,file,cb)=>{

        // CSV validator
        if(file.mimetype == 'text/csv'){
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("this is not a  .csv file !"));
        }
    }
}).single('avatar');
  fileSchema.statics.avatarPath = AVATAR_PATH;
  
const File = mongoose.model('File',fileSchema);
module.exports = File;
