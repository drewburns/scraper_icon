const axios = require("axios");
const { parse } = require("node-html-parser");
const converter = require("json-2-csv");
var fs = require("fs");

const scrape = async () => {
  const data = [];
  var counter = 20;
  while (data.length < 1200) {
    console.log("getting page: ", counter);
    console.log("we have so far: ", data.length);
    try {
      // const res = await axios.get(`https://www.flaticon.com/packs/${counter}?color=black&shape=outline`);
      const res = await axios.get(
        `https://www.flaticon.com/authors/basic-straight/lineal/${counter}`
      );
      const html = parse(res.data);
      const testBoxes = html.querySelectorAll(".box");
      for (const x in testBoxes) {
        console.log("getting test box");
        const testBox = testBoxes[x];
        const setName = testBox
          .querySelector("a")
          .attributes.title.toLowerCase();
        const setLink = testBox.querySelector("a").attributes.href;

        if (setName.includes("logo") || setName.includes("flag")) continue;
        await new Promise((r) => setTimeout(r, 10000));

        const rows = await goToSetPage(setLink, setName);
        for (const i in rows) {
          data.push(rows[i]);
        }
      }
    } catch(err) {
      console.log("failed and waiting");
      console.log(err)
      await new Promise((r) => setTimeout(r, 1000 * 60 * 2));
    }
    counter += 1;
  }

  saveData(data);
};

const saveData = (data) => {
  let json2csvCallback = function (err, csv) {
    if (err) throw err;
    fs.writeFile("lineal1.csv", csv, "utf8", function (err) {
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

const goToSetPage = async (setLink, setName) => {
  const data = [];
  try {
    const res = await axios.get(setLink);
    const html = parse(res.data);
    const iconBoxes = html.querySelectorAll(".link-icon-detail");
    const style = html
      .querySelectorAll(".title-style")[0]
      .innerText.split("|")[1]
      .trim();
    for (const x in iconBoxes.slice(0, 5)) {
      // await new Promise((r) => setTimeout(r, 300));

      const iconBox = iconBoxes[x];
      const iconTitle = iconBox.attributes.title;
      const iconRef = iconBox.attributes.href;

      const row = await getIconPage(iconRef, iconTitle, setName, style);
      data.push(row);
    }
    return data;
  } catch(err) {
    console.log("failed and waiting set page");
    console.log(err)
    await new Promise((r) => setTimeout(r, 1000 * 60 ));
    return data;
  }
};

const getIconPage = async (pageLink, title, setName, style) => {
  try {
    const res = await axios.get(pageLink);
    const html = parse(res.data);
    const iconSrc = html.querySelector(".main-icon-without-slide").attributes[
      "data-png"
    ];
    const tags = html
      .querySelectorAll(".tag--related")
      .map((e) => e.innerText.trim());

    const data = {
      title,
      setName,
      style,
      iconSrc,
      tags: tags.join(","),
    };
    console.log("got data", data)
    return data;
  } catch(err) {
    console.log("failed and waiting icon page");
    console.log(pageLink, err)
    await new Promise((r) => setTimeout(r, 1000 * 60 ));
    return;
  }
};

scrape();
// getIconPage(
//   "https://www.flaticon.com/free-icon/signboard_4692299?related_id=4692299&origin=pack",
//   "Signboard",
//   "Summer",
//   "Flat"
// );
