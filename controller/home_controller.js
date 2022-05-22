const File = require('../model/files');
const fetch = require('node-fetch');
module.exports.home = function(req , res){
    File.find({}).exec(function(err , files){
        return res.render('home',{
            files:files
        });
    })
}
module.exports.addFile =  async function(req , res){
    
   try{
     File.uploadedAvatar(req , res ,function(err){
         if(err){console.log("*****Error in  multer" , err);}
         if(req.file){
          File.create({fileName:req.file.originalname} , function(err , f){
               if(err){
                   console.log("Error in creating File" , err);
                    return;
               }
               f.avatar = File.avatarPath+'/'+req.file.filename;
               f.save();
           });
          
         }
     return res.redirect('back');
     }) ;
   }catch(err){
     return res.redirect('back');
   }
}
module.exports.open =  async function(req , res){
    
    let path = req.body.fileName.slice(9);
    path = 'uploads/'+path;
   let newPath = new URL(path , 'http://localhost:7000/');
   
    const file =  await fetch(newPath);
    const data = await file.text();
    console.log(data);
    return res.render('home');
}