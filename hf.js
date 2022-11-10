const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const converter = require("json-2-csv");

const data = [];
fs.createReadStream(path.resolve(__dirname, "data1.csv"))
  .pipe(csv.parse({ headers: false }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    if (row[2] === "Flat") {
      const rowData = {
        title: row[0],
        setName: row[1],
        style: row[2],
        image: row[3],
        tags: row[4],
      };
      data.push(rowData);
    }
  })
  .on("end", (rowCount) => {
    // const flatRows = data.filter((r) => r[2] === "Flat");
    console.log(data);
    saveData(data, "flat_icons.csv");
  });

const saveData = (data, name) => {
  let json2csvCallback = function (err, csv) {
    if (err) throw err;
    fs.writeFile(name, csv, "utf8", function (err) {
      if (err) {
        console.log(
          "Some error occured - file either not saved or corrupted file saved."
        );
      } else {
        console.log("It's saved!");
      }
    });
  };

  converter.json2csv(data, json2csvCallback, {
    prependHeader: false, // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
  });
};
