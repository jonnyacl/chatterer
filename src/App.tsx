import { useEffect, useState } from "react";
import "./App.scss";
import { w3cwebsocket } from "websocket";
import { Chat, IChat } from "./chat/Chat";
import { Joiners, IJoiner } from "./joiners/Joiners";

const client: w3cwebsocket = new w3cwebsocket("ws://localhost:5009/chat");

function App() {
  const [chat, setChat] = useState<IChat[]>([]);
  const [joiners, setJoiners] = useState<IJoiner[]>([]);
  const [myId, setMyId] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {
    // get token, set id from jwt
    if (myId) {
      client.send(JSON.stringify({ userId: myId, event: "SET_ID" }));
    }
  }, [myId]);
  useEffect(() => {
    client.onopen = () => {
      console.log("Websocket connected");
    };
    client.onmessage = (messageBroadcast) => {
      const wsData = JSON.parse(messageBroadcast.data.toString());
      console.log(wsData.event, wsData);
      switch (wsData.event) {
        case "CHAT":
          setChat([...chat, wsData.data.message]);
          break;
        case "INITIAL_CONNECTION":
          setChat(wsData.data.messages);
          break;
        case "CLIENT_JOIN":
          console.log();
          setJoiners([
            ...joiners,
            {
              message: wsData.data.message,
              timestamp: wsData.data.timestamp,
              senderId: wsData.data.senderId,
            } as IJoiner,
          ]);
          break;
        default:
          console.warn("Unexpected event recieved", wsData.event);
      }
    };
  }, [chat, joiners]);
  return (
    <div className="App">
      <header className="App-header">Chatterbox</header>
      {myId ? (
        <>
          <Chat chat={chat} client={client} myId={myId} />
          <Joiners joiners={joiners} />
        </>
      ) : (
        <div className="set-name">
          <input
            onChange={(e) => setId(e.target.value)}
            value={id}
            onKeyPress={(event) => {
              if (event.key === "Enter" && id) {
                setMyId(id);
              }
            }}
          />
          <button
            onClick={() => {
              setMyId(id);
            }}
          >
            Set name
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
