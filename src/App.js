import "./index.css";
import LobbyPage from "./components/LobbyPage";
import CodeBlockPage from "./components/CodeBlockPage";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    const fetchCodeBlocks = async () => {
      try {
        const response = await fetch("http://localhost:8000/codeblocks");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setCodeBlocks(data);
      } catch (error) {
        console.error("Error fetching code blocks:", error);
      }
    };

    fetchCodeBlocks();
  }, []);

  return selectedItem ? (
    <div className="container">
      <CodeBlockPage item={selectedItem} codeBlocksData={codeBlocks} />
    </div>
  ) : (
    <div className="container">
      <LobbyPage
        codeBlocksData={codeBlocks}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
}

export default App;
