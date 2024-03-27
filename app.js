const express = require('express')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const app = express()
const path = require('path')

let db = null
const dbPath = path.join(__dirname, 'userData.db')

app.use(express.json())

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log('DB error:${e.message}')
    process.exit(1)
  }
}
initializeDBandServer()

app.post('/register', async (request, response) => {
  const {username, name, password, gender, location} = request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const selectUserQuery = `SELECT * FROM user WHERE username= ${username};`
  const dbUser = await db.get(selectUserQuery)
  if (dbUser === undefined) {
    const createUserQuery = `INSERT INTO user(username,name,password,gender,location) VALUES('${username}','${name}','${password}','${gender}','${location}');`
    const dbresponse = await db.run(createUserQuery)
    const newUserId = dbResponse.lastID
  } else {
    response.status = 400
    response.send('User Already exists')
  }
})
