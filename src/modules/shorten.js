const validator = require("validator");
const shortid = require("shortid");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../../")

class Shorten {
  constructor(obj = {}) {
    this.url = obj.url;
    this.hash = shortid.generate()
  }

  isURL() {
    return validator.isURL(this.url)
  }

  getAll() {
    try {
      const dataBuffer = fs.readFileSync(dataDir + "data.json")
      const dataJSON = dataBuffer.toString()
      return JSON.parse(dataJSON)
    } catch (e) {
      return []
    }
  }

  add() {
    if (!this.url) return
    const data = this.getAll()
    data.push({
      url: this.url,
      hash: this.hash
    })
    const dataJSON = JSON.stringify(data)
    fs.writeFileSync(dataDir + "data.json", dataJSON)
  }

  findByHash(v) {
    const data = this.getAll()
    const found = data.find(e => e.hash === v)
    return found
  }
}


module.exports = Shorten;