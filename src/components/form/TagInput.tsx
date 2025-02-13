import React, { useState } from "react";
import { Tag, Checkbox, Button } from "antd";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label: string;
}

const TagInput: React.FC<TagInputProps> = ({ value, onChange, label }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleCheckChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    }
  };

  const handleRemoveSelected = () => {
    const newTags = value.filter((tag) => !selectedTags.includes(tag));
    onChange(newTags);
    setSelectedTags([]);
  };

  return (
    <div className="tag-input-container">
      <label className="tag-input-label" htmlFor="tags">
        {label}
      </label>
      <div className="tag-input-tags">
        {value.map((tag) => (
          <div key={tag} style={{ display: "flex", alignItems: "center" }}>
            <Tag
              closable
              onClose={() => {
                const newTags = value.filter((t) => t !== tag);
                onChange(newTags);
              }}
              className="tag-input-tag"
            >
              <Checkbox
                checked={selectedTags.includes(tag)}
                onChange={(e) => handleCheckChange(tag, e.target.checked)}
              />{" "}
              {tag}
            </Tag>
          </div>
        ))}
      </div>
      {selectedTags.length > 0 && (
        <Button onClick={handleRemoveSelected}>Remover Selecionados</Button>
      )}
    </div>
  );
};

export default TagInput;
