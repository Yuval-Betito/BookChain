import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Displays the main landing page with animated coins and navigation buttons.
 * Allows users to go to Author Dashboard, Marketplace, or Reader Dashboard.
 */
export default function HomePage() {
  const navigate = useNavigate();
  const coins = Array.from({ length: 20 });

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-4">
      {coins.map((_, index) => (
        <img
          key={index}
          src="/coin.png"
          alt="coin"
          className="absolute w-10 opacity-70 animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}

      <img
        src="/coin.png"
        alt="coin"
        className="absolute w-10 opacity-70 animate-fall"
        style={{ left: '8%', animationDelay: '1s', animationDuration: '6s' }}
      />
      <img
        src="/coin.png"
        alt="coin"
        className="absolute w-10 opacity-80 animate-fall"
        style={{ left: '12%', animationDelay: '2.5s', animationDuration: '7s' }}
      />
      <img
        src="/coin.png"
        alt="coin"
        className="absolute w-10 opacity-75 animate-fall"
        style={{ left: '17%', animationDelay: '3.2s', animationDuration: '5s' }}
      />

      <div className="z-10 text-center text-white max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-md mb-4">
          Make Your Books <br /> Work For You
        </h1>
        <p className="text-gray-300 text-lg mb-10">
          Manage, sell and mint your digital books on the blockchain in one powerful platform.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate('/author')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded shadow-md transition duration-200"
          >
            Author Dashboard
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded shadow-md transition duration-200"
          >
            Marketplace
          </button>
          <button
            onClick={() => navigate('/reader')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded shadow-md transition duration-200"
          >
            Reader Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}




