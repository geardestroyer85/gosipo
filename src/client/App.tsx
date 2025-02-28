import { useEffect, useState } from 'react';
import { ApiResponse } from '@shared/interface';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(response => response.json())
      .then((data: ApiResponse) => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Client: React saying Hello</h1>
      <h1>Server: {message}</h1>
    </div>
  );
}

export default App;