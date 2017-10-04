// Mostly From https://www.johnlouros.com/blog/uploading-a-angular-app-to-S3-with-npm
// and https://stackoverflow.com/a/46213474/4212737
// with fixes for geting the relative path from the basepath

const AWS = require("aws-sdk"); // imports AWS SDK
const fs = require("fs"); // utility from node.js to interact with the file system
const mime = require('mime');
const path = require("path"); // utility from node.js to manage file/folder paths
const config = require("./config");

let awsconfig = new AWS.Config({
  accessKeyId: config.aws_access_key_id, secretAccessKey: config.aws_secret_access_key, region: config.s3_region
});

// initialise S3 client
const s3 = new AWS.S3(awsconfig);

// resolve full folder path
const basepath = path.join(__dirname, config.path);

let deleting = 0;

function deleteObject(deleteParams) {
  s3.deleteObject(deleteParams, function (err, data) {
    deleting -= 1;
    if (err) {
      console.log("delete err " + deleteParams.Key);
    } else {
      console.log("deleted " + deleteParams.Key);
    }
    // done deleting, start upload
    if(deleting < 1){
      uploadDir('');
    }
  });
}

function updateBucket() {
  //delete any existing
  s3.listObjects({ Bucket: config.s3_bucket_name }, function (err, data) {
    if (err) {
      console.log("error listing bucket objects " + err);
      return;
    }
    let items = data.Contents;
    deleting = items.length;
    for (let i = 0; i < items.length; i += 1) {
      let deleteParams = { Bucket: config.s3_bucket_name, Key: items[i].Key };
      deleteObject(deleteParams);
    }
  });
}



let uploadDir = (dirPath) => {
  // get of list of files from 'dist' directory
  if (!dirPath) {
    dirPath = path.join(basepath);
  }
  // const dirFullPath = path.join(basepath, dirPath);
  let files = fs.readdirSync(dirPath);
  if (!files || files.length === 0) {
    console.log(`provided folder '${dirPath}' is empty or does not exist.`);
    return;
  }

  // for each file in the directory
  for (const fileName of files) {

    // get the full path of the file
    const filePath = path.join(dirPath, fileName);
    let stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
      uploadDir(filePath);
    } else if (stats.isFile()) {
      // read file contents
      let fileContent = fs.readFileSync(filePath);
      let mt = mime.getType(filePath);
      // upload file to S3
      s3.putObject({
        Bucket: config.s3_bucket_name,
        Key: path.join(path.relative(basepath, dirPath), fileName),
        Body: fileContent,
        ContentType: mt
      }, (err, res) => {
        if (err) {
          console.log('ERROR: ', err);
        } else {
          console.log(`Successfully uploaded '${fileName}'!`);
        }

      });

    }
  }
}

updateBucket();