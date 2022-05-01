const UploadRoute = require("express").Router();
const cloudinary = require("cloudinary");
const verify = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const asyncHandler = require("express-async-handler");
const fs = require('fs')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

UploadRoute.post(
  "/api/upload",
  
  asyncHandler(async (req, res) => {
    try {
      console.log(req.files);
      if (!req.files || Object.keys(req.files).length === 0)
        return res.send("you did not upload an image");

      const file = req.files.file;

      if (file.size > 1024 * 1024) {

        removeTmpFile(file.tempFilePath)

        return res.json({
          msg: "size image is large, please choose another one!",
        }); }

      if (
        file.mimetype !== 'image/jpeg' &&
        file.mimetype !== 'image/jpg' &&
        file.mimetype !== 'image/png'
      ) {

        removeTmpFile(file.tempFilePath)

        return res.json({ msg: "file format is invalid." }); }

cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "testing"
}, async(err, result) => {

    if(err) throw err

    removeTmpFile(file.tempFilePath)

    res.json({publlic_id: result.public_id, url: result.secure_url})


})


      // res.json({ msg: "test upload" });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  })
);

const removeTmpFile = (path) => {
fs.unlink(path, err=> {

  if(err) throw err;



})

}

UploadRoute.delete('/api/delete_image', verify, authAdmin, asyncHandler(async(req, res) => {

try {

  const {public_id} = req.body

  if(!public_id) return res.json({msg: "no images selected to delete"})

  cloudinary.v2.uploader.destroy(public_id, async(err, result)=> {

    if(err) throw err

    res.json({msg: "image deleted."})


  })




  
} catch (error) {
  return res.json({msg: error.message})
}

}))



module.exports = UploadRoute;
