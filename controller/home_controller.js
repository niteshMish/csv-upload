const fs = require('fs');
const parse = require('csv-parser');
const assert = require('assert');
const multer = require('multer');
const File = require('../model/files');


///////////
const storage =  multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/avatars')
    },
    filename: async function(req,file,cb){
        // rename file
        let fileName = "file-"+ Date.now() + ".csv";
        let path = "./uploads/avatars/" + fileName;

        // store file path in moongose
        
        cb(null, fileName);
        await File.create({
            fileName: file.originalname,
            avatar: fileName,
            path: path      
        })
    }
})
const upload = multer({
    storage: storage,
    fileFilter: (req,file,cb)=>{

        // CSV validator
        if(file.mimetype == 'text/csv'){
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("lnly .csv file allowed !"));
        }
    }
}).single('avatar');

//////////
module.exports.home = function(req , res){
    File.find({}).exec(function(err , files){
        return res.render('home',{
            files:files
        });
    })
}
module.exports.addFile = (req, res) =>{

    try{
       upload (req,res,function(err) {
            if(err) {  
                console.log(err);
                return res.end("Error uploading file.");  
            }  
            console.log('uploaded')
            File.find({}).exec(function(err , files){
                return res.render('home',{
                    files:files
                });
            })
    
           
        });  
    
    }catch(err){
        console.log(err);
        res.redirect('back');

    }
}
module.exports.open = (req, res) => {
    console.log(req.params.id);
    try{
        if(req.params.id){
            var csvData = [];
            let flag = true;
            fs.createReadStream('./uploads/avatars/' + req.params.id)
            .pipe(parse())
            .on('data', (row) => {
                if(flag){
                    let keys = Object.keys(row);
                    flag = false;
                    csvData.push(keys);
                }
                let dataArray = Object.keys(row).map(function(k){return row[k]});
                csvData.push(dataArray);
            })
            .on('end', ()=> {
                console.log('csv file processed successfully');
                res.render('file_view', { fileData: csvData})
            });
        } else {
            res.redirect('/')
        }

    }catch(err){
        console.log(err);
        res.redirect('back');
    }   
}