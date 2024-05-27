// src/components/DataList.js
import React from 'react';

const DataList = ({ data, loading, fetchData }) => {
  return (
    <div>
      <h1>来自 Firestore 的数据</h1>
      <button onClick={fetchData} disabled={loading}>
        {loading ? "加载中..." : "获取数据"}
      </button>
      <ul>
        {data.map(item => (
          <li key={item.id}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataList;
