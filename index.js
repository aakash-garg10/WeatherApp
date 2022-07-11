const http = require("http");
const fs = require("fs");
//requests is a module which is used to fetch websites like we do when we create server using req and res
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

//utility function to get the weather data from the api
const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=ghaziabad&appid=793cf588a7479816bdb35d604e245f7d"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");  //to convert it back to string so we can write in brower
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } 
  else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");
