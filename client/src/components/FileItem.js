import React from "react";
import { Button, Divider, List, Avatar } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const FileItem = ({ filename, ip, port, size, modified, updateFileList }) => {
  function formatBytes(byte, size) {
    if (0 === byte) return "0 Bytes";
    var c = 1024,
      d = size || 2,
      e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      f = Math.floor(Math.log(byte) / Math.log(c));
    return parseFloat((byte / Math.pow(c, f)).toFixed(d)) + " " + e[f];
  }

  function downloadFile() {
    // fetch(`/download/${filename}`).then(res => console.log(res));
    window.location.href = `http://${ip}:${port}/download/${filename}`;
  }

  function deleteFile(event) {
    event.stopPropagation();
    console.log("Delete", filename);
    fetch(`/delete/${filename}`).then(res => {
      console.log("calling upate");
      updateFileList();
    });
  }

  let date = new Date(modified);
  let formattedDate = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(date);

  return (
    <div className="row" onClick={downloadFile}>
      <div className="col-sm" style={{ textAlign: "center" }}>
        <List.Item.Meta avatar={<Avatar src="./logo.png" />} title={filename} />
      </div>
      <div className="col-sm" style={{ textAlign: "center" }}>
        {formattedDate}
      </div>
      <div className="col-sm" style={{ textAlign: "center" }}>
        {formatBytes(size, 2)}
      </div>
      <div className="col-sm" style={{ textAlign: "center" }}>
        <Button
          size="large"
          danger
          type="link"
          icon={<DeleteOutlined />}
          onClick={deleteFile}
        ></Button>
      </div>
      <Divider />
    </div>
  );
};

export default FileItem;
