import React, { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getOrigin } from "../utils";

interface contextType {
  messages: string;
  setMessages: React.Dispatch<React.SetStateAction<string>>;
  filesArr: FileInfoType[];
  setFilesArr: React.Dispatch<React.SetStateAction<FileInfoType[]>>;
  devicesArr: string[];
  setDevicesArr: React.Dispatch<React.SetStateAction<string[]>>;
  socket: Socket | null;
}

export type FileInfoType = {
  fileName: string;
  size: number;
  srcName: string;
  fileMimeType: string;
};

const MyContext = createContext<contextType>({
  messages: "",
  setMessages: () => {},
  filesArr: [] as FileInfoType[],
  setFilesArr: () => {},
  devicesArr: [] as string[],
  setDevicesArr: () => {},
  socket: null,
});

export const useMyContext = () => {
  return useContext(MyContext);
};

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState("");
  const [filesArr, setFilesArr] = useState<FileInfoType[]>([]);
  const [devicesArr, setDevicesArr] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      getOrigin().then((url) => {
        setSocket(io(url));
        console.log("connected to socked!");
      });
    }
    return () => {
      if (socket) {
        socket?.disconnect();
        setSocket(null);
      }
    };
  }, []);

  return (
    <MyContext.Provider
      value={{
        messages,
        setMessages,
        filesArr,
        setFilesArr,
        socket,
        devicesArr,
        setDevicesArr,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default Provider;
