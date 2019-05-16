const fs = require('fs')

const PostDB = artifacts.require("PostDB");
const srcPath = 'app/src/contracts/'

module.exports = function(deployer) {
  deployer.deploy(PostDB)
    .then(() => {
      if(PostDB._json) {
        fs.writeFile(srcPath + 'deployedABI', JSON.stringify(PostDB._json),
          (err) => {
            if(err) throw err
            console.log("파일에 ABI입력 성공")
          }
        )

        fs.writeFile(srcPath + 'deployedAddress', PostDB.address,
          (err) => {
            if(err) throw err
            console.log("파일에 주소 입력 성공")
          }
        )
      }
    })
};
