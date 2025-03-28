"use client"
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from "@heroui/button";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Interface for the deck structure
interface Deck {
  id?: number;
  ownerID: number;
  user_saved: number[];
  Front: string[];
  Back: string[];
}

const StudyCardDeckCreator: React.FC = () => {
  const router = useRouter();
  
  // State for managing deck creation
  const [deckName, setDeckName] = useState<string>('');
  const [currentFront, setCurrentFront] = useState<string>('');
  const [currentBack, setCurrentBack] = useState<string>('');
  
  // State to track front and back texts before saving
  const [frontTexts, setFrontTexts] = useState<string[]>([]);
  const [backTexts, setBackTexts] = useState<string[]>([]);

  // State for user authentication (placeholder - replace with actual auth)
  const [currentUserID, setCurrentUserID] = useState<number>(1); // Placeholder user ID

  // Add a card to the current deck
  const handleAddCard = () => {
    if (currentFront.trim() && currentBack.trim()) {
      setFrontTexts([...frontTexts, currentFront]);
      setBackTexts([...backTexts, currentBack]);
      
      // Clear input fields
      setCurrentFront('');
      setCurrentBack('');
    }
  };

  // Save the entire deck
  const handleSaveDeck = async () => {
    if (deckName.trim() && frontTexts.length > 0) {
      try {
        // Prepare the deck object
        const newDeck: Deck = {
          ownerID: currentUserID,
          user_saved: [], // Initially empty
          Front: frontTexts,
          Back: backTexts
        };

        // Insert the deck
        const { data, error } = await supabase
          .from('decks')
          .insert(newDeck)
          .select();

        if (error) throw error;

        // Reset form
        setFrontTexts([]);
        setBackTexts([]);
        setDeckName('');
        alert('Deck saved successfully!');
      } catch (error) {
        console.error('Error saving deck:', error);
        alert('Failed to save deck');
      }
    }
  };

  // Remove a card from the current deck
  const handleRemoveCard = (index: number) => {
    const newFrontTexts = [...frontTexts];
    const newBackTexts = [...backTexts];
    
    newFrontTexts.splice(index, 1);
    newBackTexts.splice(index, 1);
    
    setFrontTexts(newFrontTexts);
    setBackTexts(newBackTexts);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white p-4 text-purple-500">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">GitGud At Studying</div>
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => router.push('../')}>Back</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 flex-1">
        <h1 className="text-2xl font-bold mb-6 text-center text-purple-500">Create Study Card Deck</h1>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Front of Card Column */}
          <div className="bg-gray-100 shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Deck Details</h2>
            <input 
              type="text" 
              placeholder="Deck Name" 
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full mb-4 p-2 border rounded focus:ring-2 focus:ring-purple-300"
            />
            <textarea 
              placeholder="Enter front side text" 
              value={currentFront}
              onChange={(e) => setCurrentFront(e.target.value)}
              className="w-full h-40 p-2 border rounded mb-4 focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Back of Card Column */}
          <div className="bg-gray-100 shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Card Back</h2>
            <textarea 
              placeholder="Enter back side text" 
              value={currentBack}
              onChange={(e) => setCurrentBack(e.target.value)}
              className="w-full h-40 p-2 border rounded mb-4 focus:ring-2 focus:ring-purple-300"
            />
            
            <div className="flex space-x-4">
              <Button 
                variant="flat"
                onClick={handleAddCard}
                disabled={!currentFront.trim() || !currentBack.trim()}
                className="flex-1"
              >
                Add Card
              </Button>
              <Button 
                variant="flat"
                onClick={handleSaveDeck}
                disabled={!deckName.trim() || frontTexts.length === 0}
                className="flex-1"
              >
                Save Deck
              </Button>
            </div>
          </div>
        </div>

        {/* Card Preview Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">Current Deck Cards</h2>
          <div className="grid grid-cols-3 gap-4">
            {frontTexts.map((front, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 p-3 rounded shadow-sm relative"
              >
                <button 
                  onClick={() => handleRemoveCard(index)}
                  className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
                <strong className="text-purple-600">Card {index + 1}</strong>
                <p className="text-sm mt-2"><strong>Front:</strong> {front}</p>
                <p className="text-sm mt-1"><strong>Back:</strong> {backTexts[index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyCardDeckCreator;