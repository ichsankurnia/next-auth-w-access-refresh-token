import mongoose, { MongooseError } from "mongoose";

// MONGODB CONNECTTION
const { MONGODB_NAME, MONGODB_USER, MONGODB_PASS } = process.env
const connection_url = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.ynrf1.mongodb.net/${MONGODB_NAME}`

// mongoose.connect(connection_url, (err: any) => {
//     if(err) console.log('Error connect to mongodb => ', err)
// })
mongoose.connect(connection_url).then(res => {
    console.log("CONNECT TO MONGO SERVER", connection_url)
}).catch(err => {
    console.log('Error connect to mongodb => ', err)
})

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.', ref);
});

mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});

export default mongoose
