import React, { useState } from 'react';

function PollForm({ onPollSubmit }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || options.some(option => !option.trim())) {
      console.log('Validation failed: Question or options are empty.');
      return;
    }
  
    console.log('Submitting poll with question and options:', { question, options });
    try {
      // Make sure the URL matches your API endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL}/newpoll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          options, // Adjust this if your backend expects a different format
        }),
      });

      console.log('Response status:', response.status); // Log the response status

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response data:', errorData); // Log any error response data
        throw new Error(errorData.message || 'Failed to create poll');
      }
      const newPoll = await response.json();
      console.log('Poll created successfully:', newPoll); // Log the new poll object
      onPollSubmit(newPoll); // Integrate the new poll into your app
      setQuestion('');
      setOptions(['', '']);
    } catch (error) {
      console.error('Error creating poll:', error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Enter your poll question..."
        style={{ width: '100%', marginBottom: '10px' }}
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          placeholder={`Option ${index + 1}`}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      ))}
      <button type="submit">Create Poll</button>
    </form>
  );
}

export default PollForm;
