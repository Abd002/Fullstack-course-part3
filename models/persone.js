const mongoose = require('mongoose')

const url =process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name required'],
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^(0\d{1,2}-\d{7,8})$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required'],

  },
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', noteSchema)

//UsqZ0HxPJkBdPaZH
