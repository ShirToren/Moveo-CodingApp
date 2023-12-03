import "./index.css";
import LobbyPage from "./components/LobbyPage";
import CodeBlockPage from "./components/CodeBlockPage";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [isFirstClient, setFirstClient] = useState(true);
  const URL = "http://localhost:8000";

  useEffect(() => {
    const fetchCodeBlocks = async () => {
      try {
        const response = await fetch(`${URL}/codeblocks`);
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

  const fetchNumOfClients = async () => {
    try {
      const response = await fetch(`${URL}/numOfClients`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setFirstClient(data === 1 ? true : false);
    } catch (error) {
      console.error("Error fetching code blocks:", error);
    }
  };

  return selectedItem ? (
    <div className="container">
      <CodeBlockPage
        item={selectedItem}
        codeBlocksData={codeBlocks}
        isFirstClient={isFirstClient}
        fetchNumOfClients={fetchNumOfClients}
      />
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
