const ImageKit = require("imagekit");
require('dotenv').config();

// console.log("PUBLIC:", process.env.IMAGEKIT_PUBLIC_KEY);
// console.log("PRIVATE:", process.env.IMAGEKIT_PRIVATE_KEY);
// console.log("ENDPOINT:", process.env.IMAGEKIT_URL_ENDPOINT);

const imagekit = new ImageKit({
  publicKey: 'public_ORsOJGJqd8Mq46SL6EZVoKlN3L4=',
  privateKey: 'private_TFrpfF6MempXBN1b5i4XjVsh3ec=',
  urlEndpoint: 'https://ik.imagekit.io/satyamAPI',
});

module.exports = {imagekit};