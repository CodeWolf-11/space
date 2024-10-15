"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { io as ClientID } from "socket.io-client";


type socketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<socketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {

    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {

        const socketInstance = new (ClientID as any)(process.env.NEXT_PUBLIC_SITE_URL, {
            path: "/api/socket/io",
            addTrailingSlash: false
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        })

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}
