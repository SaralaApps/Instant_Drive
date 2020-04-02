import React from "react";
import { Input } from "antd";

const { Search } = Input;

const SearchBar = ({ search }) => {
  return (
    <div className="mt-5">
      <Search placeholder="Search" allowClear onSearch={search} />
    </div>
  );
};

export default SearchBar;
