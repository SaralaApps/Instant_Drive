import React, { useState, useEffect } from "react";
import FileItem from "./FileItem";
import { List, Layout } from "antd";

const { Content } = Layout;

const FileList = ({ fileList, updateFileList }) => {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState(0);

  useEffect(() => {
    fetch("/ip")
      .then(res => res.json())
      .then(json => {
        setIp(json.ip);
        setPort(json.port);
      });
  }, []);

  return (
    <Layout>
      <Content style={{ background: "white" }}>
        <div className="cart-items">
          <List
            itemLayout="horizontal"
            dataSource={fileList}
            renderItem={file => (
              <FileItem
                ip={ip}
                port={port}
                filename={file.filename}
                key={file.filename}
                size={file.size}
                modified={file.modified}
                updateFileList={updateFileList}
              />
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default FileList;
