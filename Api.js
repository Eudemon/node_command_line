require("dotenv").config()
const info = require("./Info.json")
const https = require("https")

if (!process.env.API_URL) {
  console.error(info.no_file)
  process.exit(0)
}

/**
 *  making api call to socrata
 * @param {*} params
 * @return error, json
 */
function API_call(params, callback) {
  let URI = encodeURI(
    process.env.API_URL + "?" + params + "&$limit=10&$order=applicant"
  )

  https
    .get(URI, (res) => {
      let data = ""
      res.on("data", (d) => {
        data += d
      })
      res.on("end", () => {
        try {
          let json = JSON.parse(data)
          if (json.error) callback({ message: json.message })
          callback(null, json)
        } catch (err) {
          callback(err)
        }
      })
    })
    .on("error", (err) => {
      callback(err)
    })
}

module.exports = API_call
