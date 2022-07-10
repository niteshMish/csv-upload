const fs = require('fs');
const parse = require('csv-parser');
const assert = require('assert');
const multer = require('multer');
const File = require('../model/files');



module.exports.home = function(req , res){
    File.find({}).exec(function(err , files){
        return res.render('home',{
            files:files
        });
    })
}
module.exports.addFile = (req, res) =>{

    try{
       File.uploadedAvatar (req,res,function(err) {
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