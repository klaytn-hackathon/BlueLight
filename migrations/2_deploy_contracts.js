const fs = require('fs')

const PostDB = artifacts.require("PostDB");

module.exports = function(deployer) {
  deployer.deploy(PostDB)
    .then(() => {
      if(PostDB._json) {
        fs.writeFile('deployedABI', JSON.stringify(PostDB._json),
          (err) => {
            if(err) throw err
            console.log("파일에 ABI입력 성공")
          }
        )

        fs.writeFile('deployedAddress', PostDB.address,
          (err) => {
            if(err) throw err
            console.log("파일에 주소 입력 성공")
          }
        )
      }
    })
};
