import hljs from "highlight.js";
import "highlight.js/styles/agate.css"; // Replace with your preferred style
import { useRef } from "react";
import { useEffect } from "react";

export default function CodeEditor({ content, onChange, disabled }) {
  const divRef = useRef(null);

  useEffect(() => {
    hljs.highlightBlock(divRef.current);
  }, []);

  const handleInputChange = () => {
    const newText = divRef.current.textValue;
    onChange(newText);

    hljs.highlightBlock(divRef.current);
  };

  return (
    <div
      ref={divRef}
      contentEditable="true"
      onInput={handleInputChange}
      disabled={disabled}
      style={{
        width: "100%",
        height: "300px",
        border: "1px solid #ccc",
        padding: "5px",
      }}
    >
      {content}
    </div>
  );
}
