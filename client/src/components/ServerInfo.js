import React, { useEffect } from "react";
import { useState } from "react";
import { List } from "antd";
import { Typography } from "antd";

const { Title, Text } = Typography;

const ServerInfo = () => {
  const [ipList, setIpList] = useState([]);
  //   const port = window.location.href.split("/")[2].split(":")[1];
  const port = 4000;

  useEffect(() => {
    fetch("/server")
      .then(res => res.json())
      .then(obj => {
        setIpList(obj.iplist);
      });
  }, []);

  return (
    <div>
      <List
        className="mt-2"
        itemLayout="vertical"
        dataSource={ipList}
        renderItem={ip => (
          <List.Item>
            <Title level={4}>{ip.ifname}</Title>
            <Text copyable>{`http://${ip.address}:${port}/`}</Text>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ServerInfo;
