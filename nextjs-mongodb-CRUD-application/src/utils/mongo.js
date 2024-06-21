//Util to connect to mongoDB
import mongoose from "mongoose";

export async function dbConnect() {
    try {
        let conn = await mongoose
            .connect("mongodb+srv://namasricharan:mWm4y4vAwX2NA4k1@cluster0.7bpiu4a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
            .then(console.log("Connected to db"));
        return conn;
    } catch (e) {
        throw new Error(e);
    }
}
