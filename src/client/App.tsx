import React from "react";
import { useEffect, useState } from 'react';
import { ApiResponse } from '../shared/interface';


function App() {
  const [greetings, setGreetings] = useState('');

  const getHelloFromServer = () => {
    fetch('/api/hello')
      .then(response => response.json())
      .then((data: ApiResponse) => setGreetings(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }


  return (
    <div>
      <p>Client: <span><button onClick={getHelloFromServer}>Hi, server</button></span></p>
      <p>Server: {greetings}</p>
      <p>Client: Real time chat?</p>
      <p>Server: </p>
    </div>
  );
}

export default App;