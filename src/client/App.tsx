import React from "react";
import { useEffect, useState } from 'react';
import { ApiResponse } from '../shared/interface';
import { io } from 'socket.io-client';

const socket = io();

function App() {
  const [greetings, setGreetings] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('events', (e) => {
      setMessages((messages) => [e, ...messages]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('events');
    };
  }, []);

  const getGreetings = () => {
    fetch('/api/hello')
      .then(response => response.json())
      .then((data: ApiResponse) => setGreetings(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }

  const sendPing = () => {
    socket.emit()
  }


  return (
    <div>
      <p>Client: <span><button onClick={getGreetings}>Hi, server</button></span></p>
      <p>Server: {greetings}</p>
      {
        greetings && <>
          <p>Client: Real time chat?</p>
          <p>Server: { isConnected ? 'Sure, no problem' : 'Sorry, no dude'}</p>        
        </>
      }
    </div>
  );
}

export default App;