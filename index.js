const app = require('./app')

app.listen(3000 || process.env.PORT, () => {
  console.log('Started express server at port 3000')
})
