const mongoose = require("mongoose");
const config = require("config");

module.exports = async function() {
  const options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  };
  // const db = config.get("db-rs") + "replicaSet=rs";
  const db = config.get("db");
  try {
    await mongoose.connect(db, options);

    mongoose.connection.on("error", err => {
      console.log("established Connection error: ", err);
    });
    console.log(`Connected to : ${db}...`);
    
    mongoDebuger();

  } catch (error) {
    console.log("Catch Error :", error.name);
  }
};

async function mongoDebuger() {
  await mongoose.set("debug", (collectionName, Method, query, doc) => {
    console.log(`${collectionName}.${Method}`, JSON.stringify(query), doc);
  });
}
