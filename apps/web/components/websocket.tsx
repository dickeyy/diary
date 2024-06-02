"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function WebSocketDemo() {
    //Public API that will echo messages sent to it back to the client
    const { getToken } = useAuth();
    const [socketUrl, setSocketUrl] = useState("ws://localhost:8080/documents/ws");
    const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
    const [token, setToken] = useState("");

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: () => true
    });

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage]);

    useEffect(() => {
        // on load, get the token
        getToken().then((token: any) => {
            setToken(token);
        });
    }, []);

    const handleClickSendMessage = () => {
        sendJsonMessage({ message: "Hello", token: token });
    };

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated"
    }[readyState];

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <button onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
                Click Me to send &apos;Hello&apos;
            </button>
            <span>The WebSocket is currently {connectionStatus}</span>
            <span className="text-[2px]">Token: {token}</span>
            {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
            <ul>
                {messageHistory.map((message, idx) => (
                    <span key={idx}>{message ? message.data : null}</span>
                ))}
            </ul>
        </div>
    );
}
