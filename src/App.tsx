import { useEffect, useState } from "react";
import "./App.scss";
import { w3cwebsocket } from "websocket";
import { Chat, IChat } from "./chat/Chat";
import { Joiners, IJoiner } from "./joiners/Joiners";
import { SignIn } from "./auth/SignIn";
import { useAuth } from "./auth/useAuth";
import { config } from "./config";

console.log("ENV", process.env.NODE_ENV);

function App() {
  const [chat, setChat] = useState<IChat[]>([]);
  const [client, setClient] = useState<w3cwebsocket | undefined>(undefined);
  const [joiners, setJoiners] = useState<IJoiner[]>([]);
  const { user, signOut, fetchedSession } = useAuth();
  useEffect(() => {
    if (user && !client) {
      setClient(
        new w3cwebsocket(`ws://${config.api}/chat?access_token=${user.idToken}`)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (client && user) {
      client.onopen = () => {
        console.log("Websocket connection open");
        client.send(
          JSON.stringify({
            userId: user.uid,
            event: "USER_JOIN",
            name: user.displayName,
          })
        );
      };
    }
  }, [client, user]);

  useEffect(() => {
    if (user && client) {
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
    }
  }, [user, chat, joiners, client]);
  return (
    <div className="App">
      <header className="App-header">
        <h2>Chatterbox</h2>
        {user && (
          <div>
            <span>{user.displayName}</span>
            <button onClick={signOut}>Sign out</button>
          </div>
        )}
      </header>
      {user ? (
        <>
          <Chat chat={chat} client={client} myId={user.uid} />
          <Joiners joiners={joiners} />
        </>
      ) : (
        fetchedSession && <SignIn />
      )}
    </div>
  );
}

export default App;
