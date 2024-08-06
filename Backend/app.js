const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const fs = require("fs");

mongoose
  .connect("mongodb://localhost/data")
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log("Couldn't Connect to MongoDB", err));

const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  phone: { type: String, required: true },
  images: { type: [String] },
  video: { type: String },
  localID: { type: String, default: () => new Date().getTime().toString() },
});

const Data = mongoose.model("Data", dataSchema);
// async function createData() {
//   const data = new Data({
//     name: "Sulaiman",
//     shortDescription: "كاسكو افريقي العمر ٣ سنوات اليف جدا مع الاطفال",
//     description: "كاسكو افريقي العمر ٣ سنوات اليف جدا مع الاطفال",
//     price: "200",
//     phone: "55885252",

//     images: [
//       "https://images.pexels.com/photos/13078123/pexels-photo-13078123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//       "https://media.istockphoto.com/id/1398856548/photo/portrait-of-a-young-woman-with-a-hungarian-pointer-dog-and-a-small-kitten-in-her-arms-lying.jpg?s=2048x2048&w=is&k=20&c=TtmZ0eJTzIuypnKd0Kf0pyLn2Bzx-hYFaPhjW8fqtc8=",
//       "https://media.istockphoto.com/id/1345473066/photo/woman-stroking-a-cat-while-sitting-on-her-desk.jpg?s=2048x2048&w=is&k=20&c=3MUbZ8B6aE1bpFCa6s5Z1PlfxVO-uqfqdXArFxl6jtI=",
//     ],
//     video: "",
//   });
//   const result = await data.save();
//   console.log(result);
// }
// createData();
async function getData({ filter }, L = 0, sort = {}, select = "") {
  try {
    const data = await Data.find(filter).limit(L).sort(sort).select(select);
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return [];
  }
}
// createData();
// getData();

app.get("/data", async (req, res) => {
  try {
    const data = await getData({}, 0, { localID: 1 }, "");
    const formattedData = JSON.stringify(data, null, 3);
    res.header("Content-Type", "application/json");
    res.send(formattedData);
  } catch (error) {
    res.status(500).send("Error Retrieving Data!!");
  }
});

app.listen(port, () => {
  console.log(`Port: ${port}`);
  console.log(`Link: http://localhost:${port}/`);
});
