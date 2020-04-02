const multer = require('multer');
const pify = require('pify');
const ftp = require('basic-ftp');
const ftpConfig = require('../config/keys');
const path = require('path');

const Storage = multer.diskStorage({
  destination: './public/images',
  filename: (req, file, cb) => {
    const fileName =
      file.originalname.split('.')[0] +
      '-' +
      Date.now() +
      path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = pify(
  multer({
    limits: 10 * 1024 * 1024,
    storage: Storage
  }).single('image')
);

exports.uploadImage = async (req, res) => {
  const client = new ftp.Client();
  try {
    await upload(req, res);

    await client.access({
      host: ftpConfig.host,
      user: ftpConfig.userName,
      password: ftpConfig.pwd
    });

    const p = req.file.path
      .split(path.sep)
      .slice(1)
      .join('/');

    const rawFile = p.split('/');
    const filename = rawFile[1];

    console.log(req.file.path);

    const status = await client.uploadFrom(
      'public' + '/' + p,
      ftpConfig.destPath + '/images/' + filename
    );

    console.log('public' + '/' + p);
    console.log(ftpConfig.destPath + filename);

    res.status(200).json({
      path: p,
      status: status
      // empat: dua
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }

  client.close();
};
