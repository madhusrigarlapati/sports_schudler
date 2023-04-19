/* eslint-disable no-var */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable indent */
/* eslint-disable quotes */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

const passport = require("passport")
const connectEnsureLogin = require("connect-ensure-login")
const session = require("express-session")
const LocalStrategy = require("passport-local")


app.use(bodyParser.json())

app.use(
  session({
    secret: "my-super-secret-key-21728172615261562",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
)
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (username, password, done) => {
      Player.findOne({ where: { email: username, password } })
        .then((user) => {
          console.log(user)
            return done(null, user)
        })
        .catch((error) => {
          return error
        })
    }
  )
)

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id)
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  Player.findByPk(id)
    .then((user) => {
      done(null, user)
    })
    .catch((error) => {
      done(error, null)
    })
})

app.use(express.urlencoded({ extended: false }))


const { Sport, Player } = require('./models')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// const { Op } = require('sequelize')
const db = require('./models/index')

app.get("/", async (req, res) => {
    res.render("index")
})

app.get('/sport', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  res.render('/sport')
})

app.post("/sport", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  res.render("/sport")
})
app.post(
  "/sess",
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    if (req.body.email.length === 0) {
      return res.redirect("/login")
    }
    if (req.body.password.length === 0) {
      return res.redirect("/login")
    }
    // console.log(req.user.id)
    res.redirect('/sport')
  }
)




app.post("/users", async (req, res) => {
    // console.log(req.body.lastName);
    try {
      const player = await Player.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      })
      req.login(player, (err) => {
        if (err) {
          console.log(err)
        }
        res.redirect("/sport")
      })
        //console.log(user)
        //res.render("sport")
    } catch (error) {
      console.log(error)
    }
  })

app.post("/session", async (req, res) => {
    const sname = req.body.s
    // console.log(req.body.s)
    // console.log("hello")
    console.log(req.user.id)
    console.log(sname)
    try {
      //  const [sport, created] = await Sport.findOrCreate({ where: { name: sname } })
         const sp = await Sport.createsport({ name: req.body.s, userId: req.player.id })
        // const sp = await Sport.createsport(req.body.s)
        if (await sp) {
          console.log('New sport created: ' + sname)
        } else {
          console.log('This sport already exists.')
        }
      } catch (err) {
        console.error('Error creating sport:', err)
      }
    res.send(req.body.s)
})
app.get('/signup', async (req, res) => {
    res.render("signup", { title: "Signup" })
})
app.get('/login', async (req, res) => {
    res.render("login", { title: "Login" })
})


app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

module.exports = app
