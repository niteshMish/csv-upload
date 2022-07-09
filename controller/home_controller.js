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
             let filePathLength = req.file.originalname.length; 
             let fileExtention = req.file.originalname.slice(filePathLength-4); 
             
             if( filePathLength <= 4 && fileExtention === '.csv'){
                File.create({fileName:req.file.originalname} , function(err , f){
                    if(err){
                        console.log("Error in creating File" , err);
                         return;
                    }
                    f.avatar = File.avatarPath+'/'+req.file.filename;
                    f.save();
                });
             }else{
                 return res.json(500, {
                     message:"this is not csv file",
                     flag :false
                 });
             }
          }
     return res.redirect('back');
     }) ;
   }catch(err){
     return res.redirect('back');
   }
}

module.exports.sort1 = async function(req , res){
    let a = req.body.fileName;
    let colmmn = req.body.colmmn;
    let sort = req.body.sort;
    console.log( "body",req.body);
    
    const table = a.split('\n');
    let t = [];
  await  table.forEach(row =>{
        let rowx = [];
        const col = row.split(',');
        col.slice(col.length)

        // console.log("colllllll" , col);
        col.forEach(item =>{
            rowx.push(item);
               })
            t.push(rowx);
        })
    console.log("data------------->",t);
    t.sort((a,b)=>{
        if (a[3] === b[3]) {
            return 0;
        }
        else {
            return (a[3] < b[3]) ? 1 : -1;
        }
    });


   console.log(t);
    res.render('home',{
       fileData:t}
     );
}
module.exports.open =  async function(req , res){
    
    let path = req.body.fileName.slice(9);
    console.log(req.body.fileName);
    let extention = path.slice(path.length);
    console.log(extention);
    path = 'uploads/'+path;
   let newPath = new URL(path , 'http://localhost:7000/');
   
    const file =  await fetch(newPath);
    const data = await file.text();
    // console.log(data);
   ////
   
   const table = data.split('\n');
   let t = [];
    table.forEach(row =>{
        let rowx = [];
        const col = row.split(',');
        col.slice(col.length-1)

        // console.log("colllllll" , col);
        col.forEach(item =>{
            rowx.push(item);
               })
            t.push(rowx);
        })
        
    
    return res.render('home',{
        fileData:t
    });
}