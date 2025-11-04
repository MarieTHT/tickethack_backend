const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://admin:K2V8BfpuDfe9CA2H@cluster0.dogtozg.mongodb.net/tickethack';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));


// connection à mongoose