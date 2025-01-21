import { Tag } from "antd";

const TagInput = ({
  value,
  onChange,
  label,
}: {
  value: string[];
  onChange: any;
  label: string;
}) => {
  const handleClose = (removedTag: any) => {
    const newTags = value.filter((tag: any) => tag !== removedTag);
    onChange(newTags);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 8,
          fontSize: "16px",
          color: "#072854",
          fontWeight: "700",
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: 4,
          border: "1px solid #d9d9d9",
          borderRadius: 4,
          minHeight: 80,
          backgroundColor: "#d9d9d9",
        }}
      >
        {value.map((tag: any) => (
          <Tag
            key={tag}
            closable
            onClose={() => handleClose(tag)}
            style={{ margin: 4, color: "#072854" }}
          >
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
