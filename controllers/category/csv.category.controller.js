const db = require("../../models");
const Category = db.category;
const fs = require("fs");
const csv = require("fast-csv");
const upload_category = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }
    let category=[];
    let path = __basedir + "/openwork4/samples/csv/" + req.file.filename;
    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        category.push(row);
        //console.log(titles);
      })
      .on("end",()=>{
        Category.bulkCreate(category)
          .then(() => {
            res.status(200).send({
              message:
                "Uploaded the file successfully: " + req.file.originalname,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Fail to import data into database!",
              error: error.message,
            });
          });
        });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
const get_Category = (req, res) => {
    Category.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving title.",
      });
    });
};
module.exports = {
  upload_category,
  get_Category
};