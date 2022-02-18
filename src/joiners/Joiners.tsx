import { useEffect, useRef, useState } from "react";
import "./Joiners.scss";

export interface IJoiner {
  senderId: string;
  message: string;
  timestamp: string;
}

export const Joiners = ({ joiners }: { joiners: IJoiner[] }) => {
  const [show, setShow] = useState("hide");
  const initialJoiners = useRef(joiners);

  useEffect(() => {
    if (joiners.length !== initialJoiners.current?.length) {
      setShow("show");
      setTimeout(() => {
        setShow("hide");
      }, 3000);
    }
  }, [joiners]);
  return (
    <div className={`joiners-${show}`}>
      <ul>
        {joiners.map((j, i) => (
          <li key={`${j.senderId}-${i}`}>
            <span className="joiner_message">{j.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
