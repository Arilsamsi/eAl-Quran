import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

function ClaimPrize() {
  const [gameId, setGameId] = useState('');
  const [selectedPrize, setSelectedPrize] = useState('');
  const navigate = useNavigate();

  const prizes = [
    { id: 'diamonds', name: 'Diamond Bundle', value: '1000 Diamonds' },
    { id: 'character', name: 'Character Skin', value: 'Legendary Character Skin' },
    { id: 'weapon', name: 'Weapon Bundle', value: 'Rare Weapon Skins' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gameId || !selectedPrize) {
      toast.error('Please fill in all fields');
      return;
    }

    // Here you would typically submit the claim to your backend
    toast.success('Prize claim submitted! Please wait for processing.');
    setGameId('');
    setSelectedPrize('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-500">Claim Your Prize</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Free Fire Game ID</label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="Enter your Game ID"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Select Prize</label>
              <select
                value={selectedPrize}
                onChange={(e) => setSelectedPrize(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                required
              >
                <option value="">Select a prize</option>
                {prizes.map((prize) => (
                  <option key={prize.id} value={prize.id}>
                    {prize.name} - {prize.value}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded transition duration-300"
            >
              Claim Prize
            </button>
          </form>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-500 mb-4">Important Notes:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Make sure your Game ID is correct before submitting</li>
            <li>Prize delivery may take up to 24 hours</li>
            <li>Each account can only claim one prize per day</li>
            <li>Keep your account information secure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ClaimPrize;