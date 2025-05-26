import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to BookChain</h1>
      <p>Select where you want to go:</p>

      <button onClick={() => navigate('/author')} style={buttonStyle}>
        Author Dashboard
      </button>

      <button onClick={() => navigate('/marketplace')} style={buttonStyle}>
        Marketplace
      </button>

      <button onClick={() => navigate('/reader')} style={buttonStyle}>
        Reader Dashboard
      </button>
    </div>
  );
}

const buttonStyle = {
  margin: '10px',
  padding: '12px 24px',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '8px',
  border: '1px solid gray',
  backgroundColor: '#f0f0f0'
};
