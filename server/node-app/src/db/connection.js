const mongoose = require('mongoose')
const config = require('./config')
const url = 'mongodb+srv://' + config.username + ":" + config.password + '@cluster0.ww93z.mongodb.net/' + config.db + '?retryWrites=true&w=majority'
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})