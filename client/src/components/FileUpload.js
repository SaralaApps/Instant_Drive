import React, { Fragment, useState } from "react";
import axios from "axios";
import Progress from "./Progress";
import { message } from "antd";

const FileUpload = ({ updateFileList }) => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {
          let percentage = parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );

          if (percentage < 100) {
            setUploadPercentage(percentage);
          } else if (percentage === 100) {
            setUploadPercentage(100);
            setTimeout(() => {
              setUploadPercentage(0);
              setFile("");
              setFilename("Choose File");
            }, 1000);
          }
        }
      });
      message.success("Upload Complete");
      updateFileList();
    } catch (err) {
      if (err.response.status === 500) {
        message.error("There was a problem with the server");
      } else {
        message.error(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="inputGroupFile02"
            onChange={onChange}
          />
          <label
            className="custom-file-label"
            htmlFor="inputGroupFile02"
            aria-describedby="inputGroupFileAddon02"
          >
            {filename}
          </label>
        </div>
        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mb-2"
        />
        <Progress percentage={uploadPercentage} />
      </form>
    </Fragment>
  );
};

export default FileUpload;
