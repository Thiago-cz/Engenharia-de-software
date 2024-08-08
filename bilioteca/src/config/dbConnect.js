import mongoose from "mongoose";

mongoose.connect(process.env.DB_CONNECTION_STRING_MONGO);

let db = mongoose.connection;

export default db;