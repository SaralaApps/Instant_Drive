import React from "react";
import ServerInfo from "./ServerInfo";
import { Divider, Typography } from "antd";
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import { useState } from "react";
import { useEffect } from "react";
import SearchBar from "./SearchBar";

const { Title, Text } = Typography;

const MainPage = () => {
  const [fileList, setFileList] = useState([]);

  const updateFileList = () => {
    fetch("/list")
      .then(res => res.json())
      .then(fileList => {
        setFileList(fileList);
      });
  };

  const search = newSearchTerm => {
    if (newSearchTerm) {
      fetch("/list")
        .then(res => res.json())
        .then(fileList => {
          fileList = fileList.filter(function(file) {
            return file.filename
              .toLowerCase()
              .includes(newSearchTerm.toLowerCase());
          });
          console.log(fileList);
          setFileList(fileList);
        });
    } else {
      updateFileList();
    }
  };

  useEffect(() => {
    updateFileList();
  }, []);

  return (
    <div className="container-xl mt-4">
      <div style={{ textAlign: "center" }}>
        <Title>Instant Drive</Title>
        <Text>Instant Drive Server is running on following IP address(es)</Text>
        <ServerInfo />
      </div>
      <Divider />
      <FileUpload updateFileList={updateFileList} />
      <SearchBar search={search} />
      <Divider />
      <FileList fileList={fileList} updateFileList={updateFileList} />
    </div>
  );
};

export default MainPage;
