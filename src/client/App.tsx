import React from "react";
import { useEffect, useState } from 'react';
import { ApiResponse } from '../shared/interface';


function App() {
  const [message, setMessage] = useState('');

  const getHelloFromServer = () => {
    fetch('/api/hello')
      .then(response => response.json())
      .then((data: ApiResponse) => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }


  return (
    <div>
      <p>Client: <span><button onClick={getHelloFromServer}>Hi, server</button></span></p>
      <p>Server: {message}</p>
    </div>
  );
}

export default App;