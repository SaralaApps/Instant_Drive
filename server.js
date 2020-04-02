const express = require("express");
const fileupload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const ip = require("ip");
var os = require("os");

const storage_dirname = "storage";
const storage_dir = path.join(__dirname, storage_dirname);

if (!fs.existsSync(storage_dir)) {
  fs.mkdirSync(storage_dir);
}

function getIpList() {
  let ipList = [];
  var ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function(ifname) {
    let alias = 0;

    ifaces[ifname].forEach(function(iface) {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        ipList.push({ ifname: ifname + ":" + alias, address: iface.address });
      } else {
        // this interface has only one ipv4 adress
        ipList.push({ ifname: ifname, address: iface.address });
      }
      ++alias;
    });
  });

  return ipList;
}

const app = express();

app.use(fileupload());
const PORT = 4001;

function sendListOfUploadedFiles(res) {
  fs.readdir(storage_dir, (err, files) => {
    if (err) {
      console.log(err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify(err.message));
      res.end();
    } else {
      filelist = [];

      for (i = 0; i < files.length; i++) {
        let stats = fs.statSync(
          path.join(__dirname, storage_dirname, files[i])
        );
        filelist[i] = {
          filename: files[i],
          size: stats["size"],
          modified: stats["mtime"]
        };
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(filelist));
      res.end();
    }
  });
}

function deleteUploadedFile(url, res) {
  let file = path.join(__dirname, url);
  fs.unlink(file, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text" });
      res.write("File Not Found!");
      res.end();
    }
  });
}

app.get("/*", (req, res) => {
  let request = req.url.split("/");

  if (request[1] === "list") {
    sendListOfUploadedFiles(res);
  } else if (request[1] === "ip") {
    const reqIp = req.headers.referer.split("/")[2].split(":")[0];
    console.log("Sending IP:", reqIp, "Port:", PORT);
    res.write(JSON.stringify({ ip: reqIp, port: PORT }));
    res.end();
  } else if (request[1] === "server") {
    console.log("Sending Server IP List:", getIpList());
    res.write(JSON.stringify({ iplist: getIpList() }));
    res.end();
  } else if (request[1] === "download" || request[1] === "delete") {
    filename = request[2];
    filename = filename.split("%20");
    filename = filename.join(" ");

    if (request[1] === "download") {
      console.log("Downloading ", filename);
      res.download(path.join(storage_dirname, filename));
    } else if (request[1] === "delete") {
      console.log("Deleting ", filename);
      deleteUploadedFile(path.join(storage_dirname, filename), res);
      res.end();
    }
  }
});

app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "Choose File to Upload" });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/storage/${file.name}`, err => {
    console.log("Uploading", file.name);
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json({
      fileName: file.name,
      filePath: `${__dirname}/storage/${file.name}`
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started..`);
});
