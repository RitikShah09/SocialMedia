import React from 'react'

const TextInput = ({ type, label, placeholder, className, value, setValue}) => {
  return (
    <div className={className}>
      <label>{label}</label>
      <input
        className="w-64 px-2 py-1 outline-none border rounded-sm mt-1"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}

export default TextInput
