import { useState } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { useRef } from "react";

export default function TextArea(props) {
  const [textValue, setTextValue] = useState(props.text);
  const [showReplace, setShowReplace] = useState(false);

  const WS_URL = "ws://localhost:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: "shir",
  });

  const handleChange = (event) => {
    //setTextValue(event.target.value);
    sendJsonMessageThrottle.current({
      code: event.target.value,
    });
    setShowReplace(true);
  };

  const THROTTLE = 50;
  const sendJsonMessageThrottle = useRef(throttle(sendJsonMessage, THROTTLE));

  const renderTextArea = (users) => {
    return Object.keys(users).map((uuid) => {
      const user = users[uuid];
      return (
        <textarea
          value={user.state.code}
          onChange={handleChange}
          rows={5}
          cols={40}
        ></textarea>
      );
    });
  };

  return lastJsonMessage ? (
    <>{renderTextArea(lastJsonMessage)}</>
  ) : (
    <textarea
      value={textValue}
      onChange={handleChange}
      placeholder="Enter text here"
      rows={5} // Specify the number of visible rows
      cols={40} // Specify the number of visible columns
      //disabled={true}
    />
  );
}
