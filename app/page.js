"use client";
import React, { useState, useEffect } from "react";

const TradePage = () => {
  const [tradeDetails, setTradeDetails] = useState(null);
  const [error, setError] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection using environment variable
    const websocket = new WebSocket(
      "ws://trader-backend-production.up.railway.app"
    );

    websocket.onopen = () => {
      console.log("Connected to the WebSocket server at " + wsUrl);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        setError(data.error);
      } else {
        setTradeDetails(data);
      }
    };

    websocket.onerror = (errorEvent) => {
      console.error("WebSocket error:", errorEvent.message);
      setError("WebSocket connection error");
    };

    websocket.onclose = (closeEvent) => {
      console.log("WebSocket connection closed", closeEvent.reason);
    };

    // Set WebSocket in state
    setWs(websocket);

    // Clean up WebSocket connection when the component unmounts
    return () => {
      if (websocket.readyState === 1) {
        // <-- This is important
        websocket.close();
      }
    };
  }, []);

  const handleTrade = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("Initiate Trade");
    } else {
      console.error("WebSocket is not open.");
      setError("WebSocket connection not established.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleTrade}
      >
        Initiate Trade
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {tradeDetails && (
        <div className="mt-4 p-4 border rounded shadow">
          <h2 className="text-lg font-bold">Trade Details:</h2>
          <pre className="bg-gray-100 p-2 text-black">
            {JSON.stringify(tradeDetails, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TradePage;
