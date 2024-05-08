import React, { useState } from 'react';
import { useAuth } from "../../services/useAuth";

function Poll({ poll, onVote }) {
  const [selectedOption, setSelectedOption] = useState('');
  const { isLoggedIn, currentUser } = useAuth(); // Assuming handleLogout isn't used here

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) return;
    if (!isLoggedIn) {
      alert('You must be logged in to vote.');
      return;
    }
  
    try {
      console.log('Sending vote:', { option: selectedOption });
      const response = await fetch(`/${currentUser}/polls/${poll.id}/vote`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ option: selectedOption }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cast vote');
      }
      const updatedPoll = await response.json();
      onVote(updatedPoll);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
    setSelectedOption('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>{poll.question}</p>
      {poll.options.map((option, index) => (
        <div key={option.id || index}> {/* Use a unique identifier if available, otherwise use index */}
          <label>
            <input
              type="radio"
              name="pollOption" // Keep the name consistent for all options in the same poll
              value={option.option} // This assumes your option structure includes an 'option' field
              checked={selectedOption === option.option}
              onChange={handleOptionChange}
            />
            {option.option} {/* Render the option text */}
          </label>
        </div>
      ))}
      <button type="submit">Vote</button>
    </form>
  );
}

export default Poll;
