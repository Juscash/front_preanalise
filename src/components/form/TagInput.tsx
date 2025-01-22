import React from "react";
import { Tag } from "antd";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label: string;
}

const TagInput: React.FC<TagInputProps> = ({ value, onChange, label }) => {
  const handleClose = (removedTag: string) => {
    const newTags = value.filter((tag) => tag !== removedTag);
    onChange(newTags);
  };

  return (
    <div className="tag-input-container">
      <label className="tag-input-label" htmlFor="tags">
        {label}
      </label>
      <div className="tag-input-tags">
        {value.map((tag) => (
          <Tag key={tag} closable onClose={() => handleClose(tag)} className="tag-input-tag">
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
