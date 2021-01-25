const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose');
var fs = require('fs');
let Image = require('../models/image.model');
var grid = require('gridfs-stream');
var db = require('mongodb').Db;
var formidable = require('formidable');
var util = require('util');
const { resolve } = require('path');


router.route('/:user/getDev').get((req, res) => {
    console.log("Get image dev route executed");

    var connection = mongoose.connection;
    grid.mongo = mongoose.mongo;
    var gfs = grid(connection.db);

    Image.find({username : req.params.user})
        .then(images => {
            promiseArr = [];
            images.forEach( function(img){
                promiseArr.push( 
                    new Promise((resolve, reject) => {
                        gfs.files.find({ filename: img.imageId }).toArray((err, files) => {
                        if(!files || files.length === 0){
                            return res.status(404).json({
                                message: "Could not find file"
                            });
                        }
                        // result.push(files)
                        // console.log(img.imageName)
                        // console.log(util.inspect({files: files}));
                        resolve({name:img.imageName, file : files[0]});
                        })
                    })
                )
            })
            Promise.all(promiseArr)
                .then((result) => {
                    console.log(util.inspect({result: result}));
                    res.json(result);
                })
                .catch((err) => {res.send(err)});
        })
        .catch(err => {
            console.log(err);    
            res.status(400).json('Error: '+ err)
        });
});

router.route('/getImage').post((req, res) => {
    console.log('The real get image route executed!');
    
    var connection = mongoose.connection;
    grid.mongo = mongoose.mongo;
    var gfs = grid(connection.db);
    var readstream = gfs.createReadStream({
        filename: req.body.filename
    })
    readstream.on("error", function(err){
        res.send("No image found with that title"); 
    });
    // res.setHeader("Content-Type", "image/jpg");
    var media = '';
    readstream.on('data', (chunk) => {
        media = media + chunk.toString('base64');
    });
    readstream.on('close', () => {
        console.log('file read successfully');
        res.send({data: media, name: req.body.imgName});
    })
});

router.route('/:user/').get((req, res) => {
    console.log("Get image route executed");
    Image.find()
        .then(images => {
            var result = []
            for(var img of images){
                if(img.username==req.params.user){
                    //add the uuid for the image in the array that will be returned in resp for now
                    result.push(img);
                    
                    //gridfs get image for putting the image in the destination folder.
                    var connection = mongoose.connection;
                    if(connection!='undefined'){
                        //var dest = process.env.DEST_PATH + '\\'+img.imageName;
                        //console.log(dest);
                        grid.mongo = mongoose.mongo;    //set the connection for gridfs
                        var gridfs = grid(connection.db)
                        if(gridfs) {
                            //var fsstreamwrite = fs.createWriteStream(dest);
                            var readstream = gridfs.createReadStream({
                                filename: img.imageId
                            })
                            readstream.pipe(res);
                            readstream.on('close', () =>{
                                console.log('file read successfully from the database!')
                            });

                        }
                        else{
                            console.log("No gridfs object found!");
                        }
                    }
                    else{
                        console.log("not connected to the database!")
                    }
                    break;
                }
            }
            //res.json(result);
        })
        .catch(err => {console.log(err)
        res.status(400).json('Error: ' + err)});
});



router.route('/addDev').post((req, res) => {
    console.log('add image dev route executed!');
    
    let form = new formidable.IncomingForm();
    let response = '';

    form.parse(req, function(err, fields, files) {
        if (err) {
  
          // Check for and handle any errors here.
  
          console.error(err.message);
          return;
        }
  
        // This last line responds to the form submission with a list of the parsed data and files.
  
        console.log(util.inspect({fields: fields, files: files}));

        console.log('the type of the file is: '+typeof files['image0'] +' and the name is: ' + files['image0'].name);

        var connection = mongoose.connection;   //get the connection object
        var username = fields['username'];
        Object.keys(files).forEach(function(key) {
            console.log(key);
            let imageId = uuidv4().toString();
            console.log("image id is: " + imageId);

            if(connection!='undefined') {
                console.log(connection.readyState.toString());
                //var path = process.env.DEST_PATH; //get the path of the destination folder
                //var file_src = req.body.path; //path of the source file wil be provided by the request
                // console.log("the grid is: " + grid);
                grid.mongo = mongoose.mongo;    //establish a connection between mongo and gridFS

                gridfs = grid(connection.db);
                if(gridfs){
                    var streamWrite = gridfs.createWriteStream({
                        filename: imageId
                    });
                    
                    fs.createReadStream(files[key].path).pipe(streamWrite);
                    streamWrite.on("close", () => {
                        var imageName = files[key].name;
                        console.log(imageName + " successfully written to the database");
                        
                        // console.log(req.body.path);
                        var image = new Image({username, imageName, imageId});
                        // console.log(image);
                        image.save()
                            .then(() => response+=(imageName+' Uploaded successfully!'))
                            .catch(err => response +='Error: ' + err);
                    })
                } else {
                    response+='Sorry no grid fs object found';
                    console.log("Sorry no grid fs object found");
                }
            } else {
                console.log("Sorry, connection not found.")
            }
            console.log("done");
        });
      });
      res.json(response);
});




router.route('/add').post((req, res) => {
    console.log('add Image Route Executed');
    //generate a random image id
    let imageId = uuidv4().toString();
    console.log("image id is: " + imageId);
    //upload image using GridFS here
    // mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useCreateIndex: true}
    //     );   //connect to the mongoDB database
    
    var connection = mongoose.connection;   //get the connection object
    if(connection!='undefined') {
        console.log(connection.readyState.toString());
        //var path = process.env.DEST_PATH; //get the path of the destination folder
        var file_src = req.body.path; //path of the source file wil be provided by the request
        // console.log("the grid is: " + grid);
        grid.mongo = mongoose.mongo;    //establish a connection between mongo and gridFS
        // connection.once("open", () => {
            // console.log("connection open");
            gridfs = grid(connection.db);
            if(gridfs){
                var streamWrite = gridfs.createWriteStream({
                    filename: imageId
                });
                
                fs.createReadStream(file_src).pipe(streamWrite);
                streamWrite.on("close", (file) => {
                    console.log(file+ " successfully written to the database");
                    var username = req.body.username;
                    var imageName = req.body.path.split('\\');
                    imageName = imageName[imageName.length-1];
                    console.log(req.body.path);
                    var image = new Image({username, imageName, imageId});
                    console.log(image);
                    image.save()
                        .then(() => res.json('Image Uploaded successfully!'))
                        .catch(err => res.status(400).json('Error: ' + err));
                })
            } else {
                res.json('Sorry no grid fs object found');
                console.log("Sorry no grid fs object found");
            }
        // });
    } else {
        console.log("Sorry, connection not found.")
    }
    console.log("done");
});

module.exports=router;