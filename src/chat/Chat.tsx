import { useState } from "react";
import "./Chat.scss";
import { w3cwebsocket } from "websocket";

export interface IChat {
  senderId: string;
  timestamp: string;
  message: string;
}

export const Chat = ({
  chat,
  client,
  myId,
}: {
  chat: IChat[];
  client: w3cwebsocket;
  myId: string;
}) => {
  const [message, setMessage] = useState<string>("");
  const onSubmit = () => {
    if (message) {
      client.send(JSON.stringify({ message, userId: myId, event: "CHAT" }));
      setMessage("");
    }
  };
  return (
    <div className="chat">
      <ul>
        {chat.map((c, i) => (
          <li
            key={`${c.senderId}-${i}`}
            className={`message_${c.senderId === myId ? "right" : "left"}`}
          >
            <div className="sender">
              {c.senderId === myId && (
                <span className="_time">
                  {new Date(c.timestamp).toDateString()}
                </span>
              )}
              <span style={c.senderId === myId ? { color: "blue" } : {}}>
                <b>{c.senderId}</b>
              </span>
              {c.senderId !== myId && (
                <span className="_time">
                  {new Date(c.timestamp).toDateString()}
                </span>
              )}
            </div>
            <div className="content">
              <span className="_message">{c.message}</span>
            </div>
          </li>
        ))}
      </ul>
      <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            onSubmit();
          }
        }}
      />
      <button onClick={onSubmit}>Message</button>
    </div>
  );
};
