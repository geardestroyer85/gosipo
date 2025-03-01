import React from "react";
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io();

function App() {
  const [greetings, setGreetings] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('events', (e) => {
      setHistory((newHistory) => [e, ...newHistory]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('events');
    };
  }, []);

  const getGreetings = () => {
    setGreetings('');

    fetch('/api/hello')
      .then(response => response.json())
      .then((data) => setGreetings(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }

  const sendMessage = () => {
    socket.emit('events', message)
    setMessage('')
  }


  return (
    <div className="p-4">
      <p className="mb-4">Client: <span><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={getGreetings}>Hi, server</button></span></p>
      <p className="mb-4">Server: {greetings}</p>
      {
        greetings && <>
          <p className="mb-4">Client: Real time chat?</p>
          <p className="mb-4">Server: { isConnected ? 'Sure, no problem' : 'Sorry, no dude'}</p>
          {
            isConnected && <>
              <form className="mb-4" onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}>
                <span className="mr-2">
                  Client:{" "}
                  <input
                    className="border rounded py-1 px-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </span>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit">
                  Send Message
                </button>
              </form>
              <p className="mb-4">Server: Below is message history from you and your mates!</p>
              <div className="space-y-2">
                {history?.map((message) => {
                  return <p className="bg-gray-100 p-2 rounded">{message}</p>;
                })}
              </div>
            </>
          }   
        </>
      }
    </div>
  );
}

export default App;