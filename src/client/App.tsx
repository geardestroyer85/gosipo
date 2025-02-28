import React from "react";
import { useEffect, useState } from 'react';
import { ApiResponse } from '../shared/interface';
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
      .then((data: ApiResponse) => setGreetings(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }

  const sendMessage = () => {
    socket.emit('events', message)
    setMessage('')
  }


  return (
    <div>
      <p>Client: <span><button onClick={getGreetings}>Hi, server</button></span></p>
      <p>Server: {greetings}</p>
      {
        greetings && <>
          <p>Client: Real time chat?</p>
          <p>Server: { isConnected ? 'Sure, no problem' : 'Sorry, no dude'}</p>
          {
            true && <>
              <form onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}>
                <span>
                  Client:{" "}
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </span>
                <button type="submit">
                  Send Message
                </button>
              </form>              <p>Server: Below is message history from you and your mates!</p>
            {history?.map((message) => {
              return <p>{message}</p>;
            })}
            </>
          }   
        </>
      }
    </div>
  );
}

export default App;