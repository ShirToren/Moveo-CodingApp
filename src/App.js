import "./index.css";
import LobbyPage from "./components/LobbyPage";
import CodeBlockPage from "./components/CodeBlockPage";
import { useState } from "react";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [isFirstClient, setFirstClient] = useState(true);

  const WS_URL = "ws://localhost:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: "shir",
  });

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

  useEffect(() => {
    const fetchNumOfClients = async () => {
      try {
        const response = await fetch("http://localhost:8000/numOfClients");
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

    fetchNumOfClients();
  }, []);

  return selectedItem ? (
    <div className="container">
      <CodeBlockPage
        item={selectedItem}
        codeBlocksData={codeBlocks}
        isFirstClient={isFirstClient}
        sendJsonMessage={sendJsonMessage}
        lastJsonMessage={lastJsonMessage}
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
