const sid = require('shortid')
const multer = require('multer')
const fs = require('fs')
const Links = require('../models/Link')

exports.uploadFile = async (req, res, next) => {
  const multerConfig = {
    limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads')
      },
      filename: (req, file, cb) => {
        let extension = file.originalname.split('.')
        extension = extension[extension.length - 1]
        cb(null, `${sid.generate()}.${extension}`)
      },
    })),
  }

  const upload = multer(multerConfig).single('file')

  upload(req, res, async error => {
    if (!error) {
      res.json({ file: req.file.filename })
    } else {
      console.log(error)
      return next()
    }
  })
}

exports.deleteFile = async (req, res) => {
  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.file}`)
  } catch (error) {
    console.log(error)
  }
}

exports.downloadFile = async (req, res, next) => {
  const { file } = req.params
  const link = await Links.findOne({ name: file })

  const download_file = __dirname + '/../uploads/' + file
  res.download(download_file)

  //Delete file and db data
  const { downloads, name } = link

  if (downloads === 1) {
    //Delete file
    req.file = name

    //Delete entry from DB
    await Links.findOneAndRemove(link.id)
    next()
  } else {
    link.downloads--
    await link.save()
  }
}
