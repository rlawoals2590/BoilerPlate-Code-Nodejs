if (process.env.NODE_ENV === "production") {
    //process.env.NODE_ENV 이게 production 이면!
    module.exports = require("./prod"); //prod.js 파일에서 가져오고
  } else {
    //만약 process.env.NODE_ENV <-- 이게 development 이면!
    module.exports = require("./dev"); //module exports를 prod에서 하는게 아니라 dev.js 파일에서 하도록 한다.
  }