const ftp = require('basic-ftp');
const ftpConfig = require('../config/keys');
const pify = require('pify');
const fs = require('fs');

const fileWrite = pify(fs.writeFile);
const fileRead = pify(fs.readFile);

exports.getConfig = async (req, res) => {
  const client = new ftp.Client();
  try {
    const guid = req.params.guid;

    await client.access({
      host: ftpConfig.host,
      user: ftpConfig.userName,
      password: ftpConfig.pwd
    });

    const filePath = `${ftpConfig.destPath}/config/[${guid}].cfg`;
    const downloadPath = `public/config/[${guid}].cfg`;

    console.log(downloadPath);
    console.log(filePath);

    await client.downloadTo(downloadPath, filePath);

    const data = await fileRead(downloadPath, 'utf-8');

    res.status(200).json({
      data: data
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }

  client.close();
};

exports.setConfig = async (req, res) => {
  const client = new ftp.Client();
  try {
    const client = new ftp.Client();
    const guid = req.body.guid;
    const duration = req.body.duration;

    await client.access({
      host: ftpConfig.host,
      user: ftpConfig.userName,
      password: ftpConfig.pwd
    });

    await fileWrite(`./public/config/[${guid}].cfg`, duration, 'utf-8');

    const status = await client.uploadFrom(
      `public/config/[${guid}].cfg`,
      `${ftpConfig.destPath}/config/[${guid}].cfg`
    );

    res.status(200).json({
      path: 'ok'
      // empat: dua
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
  client.close();
};
