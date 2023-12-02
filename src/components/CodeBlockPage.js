import "../index.css";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { useRef } from "react";

export default function CodeBlockPage(props) {
  const [textValue, setTextValue] = useState(props.item.code);

  const WS_URL = "ws://localhost:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: "shir",
  });

  useEffect(() => {
    if (lastJsonMessage) {
      Object.keys(lastJsonMessage).map((uuid) => {
        const user = lastJsonMessage[uuid];
        if (props.item.title === user.state.title) {
          setTextValue(user.state.code);
        }
        // const blockToUpdate = props.codeBlocksData.find(
        //   (block) => block.title === props.item.title
        // );
        // blockToUpdate.code = user.state.code;
      });
    }
  }, [lastJsonMessage]);

  // useEffect(() => {
  //   const currentBlock = props.codeBlocksData.find(
  //     (block) => block.title === props.item.title
  //   );
  //   setTextValue(currentBlock.code);
  // }, []);

  const handleChange = (event) => {
    setTextValue(event.target.value);
    sendJsonMessageThrottle.current({
      code: event.target.value,
      title: props.item.title,
    });
  };

  const THROTTLE = 50;
  const sendJsonMessageThrottle = useRef(throttle(sendJsonMessage, THROTTLE));

  return (
    <div className="container">
      <Header title={props.item.title} />

      <textarea
        value={textValue}
        onChange={handleChange}
        placeholder="Enter text here"
        rows={5} // Specify the number of visible rows
        cols={40} // Specify the number of visible columns
        //disabled={isFirstClient}
      />
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
