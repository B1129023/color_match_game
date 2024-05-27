// src/components/DataForm.js
import React, { useState } from 'react';

const DataForm = ({ addData }) => {
  const [formData, setFormData] = useState({ name: '', value: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addData(formData);
    setFormData({ name: '', value: '' });
  };

  return (
    <div>
      <h2>添加新数据</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="名称"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="value"
          placeholder="值"
          value={formData.value}
          onChange={handleInputChange}
        />
        <button type="submit">添加数据</button>
      </form>
    </div>
  );
};

export default DataForm;
