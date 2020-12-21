const args = require("minimist")(process.argv.slice(2))
const info = require("./Info.json")
const api = require("./Api")
const readline = require("readline")

if (args["help"]) {
  console.log(info.help)
  return
}

let params = ""
for (let key in args) {
  if (key != "_") {
    params += `${key}=${args[key]}&`
  }
}

if (!args["dayorder"] && !args["dayofweekstr"]) {
  const date = new Date()
  params += `dayorder=${date.getDay()}&`
}

let offset = 0
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

fetch()
/**
 * fetch and display food trucks
 */
function fetch() {
  api(params + "$offset=" + offset, (err, data) => {
    if (err) {
      console.error("API: " + err.message)
      process.exit(0)
    }

    if (data.length) {
      data.forEach((val) => {
        console.log(
          `${val.applicant}\n` +
            `Hours: ${val.dayofweekstr} from ${val.starttime} - ${val.endtime}\n` +
            `Serving: ${val.optionaltext}\n` +
            `At ${val.location}\n`
        )
      })
    } else {
      console.log(info.nope)
      process.exit(0)
    }

    question()
  })
}

/**
 * display user input prompt
 */
function question() {
  rl.question(
    `Above is result from ${offset} to ${offset + 9}\n${info.next}`,
    (code) => {
      if (!code) {
        offset += 10
        fetch()
      } else {
        rl.close()
      }
    }
  )
}
