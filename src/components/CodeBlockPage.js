import "../index.css";
import { useEffect, useState } from "react";
import throttle from "lodash.throttle";
import { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import useWebSocket from "react-use-websocket";

import "highlight.js/styles/default.css";

export default function CodeBlockPage(props) {
  const [textValue, setTextValue] = useState(props.item.code);

  const WS_URL = "ws://localhost:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: "shir",
  });

  useEffect(() => {
    props.fetchNumOfClients();
  }, []);

  useEffect(() => {
    if (lastJsonMessage) {
      Object.keys(lastJsonMessage).map((uuid) => {
        const user = lastJsonMessage[uuid];
        if (props.item.title === user.state.title) {
          setTextValue(user.state.code);
        }
      });
    }
  }, [lastJsonMessage]);

  const handleChange = (value, event) => {
    setTextValue(value);
    sendJsonMessageThrottle.current({
      code: value,
      title: props.item.title,
    });
  };

  const THROTTLE = 50;
  const sendJsonMessageThrottle = useRef(throttle(sendJsonMessage, THROTTLE));

  return (
    <div className="container">
      <Header title={props.item.title} />
      <Editor
        height="300px"
        width="600px"
        theme="vs-dark"
        defaultLanguage="javascript"
        value={textValue}
        options={{ readOnly: props.isFirstClient }}
        onChange={handleChange}
      ></Editor>
    </div>
  );
}

function Header(props) {
  return (
    <header className="second-header">
      <h1>{props.title}</h1>
    </header>
  );
}
