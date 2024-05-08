import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap CSS is imported
import '../../Styles/HomePage/pollDisplay.css'; // Path to your CSS file

function PollDisplay({ poll, onVote }) {
  // const totalVotes = poll.options.reduce((total, option) => total + option.voters.length, 0);
  const totalVotes = poll.options.reduce((total, option) => total + (option.voters ? option.voters.length : 0), 0);


  const getPercentage = (votes) => {
    return totalVotes === 0 ? 0 : (votes / totalVotes * 100).toFixed(1);
  };

  const handleOptionClick = (optionText) => {
    console.log(`Voting on Poll ID: ${poll._id} with option: ${optionText}`); // Additional debug info
    onVote(poll._id, optionText);
  };

  return (
    <div className="card poll-display my-3">
      <div className="card-body">
        <h5 className="card-title text-center">{poll.question}</h5>
        <form>
          {poll.options.map((option, index) => (
            <div key={index} className="d-flex align-items-center my-2">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`pollOptions-${poll._id}`} // Ensures unique name for radio group per poll
                  id={`option${index}-${poll._id}`} // Ensures unique ID per option
                  value={option.text}
                  onChange={() => handleOptionClick(option.text)}
                />
                <label className="form-check-label btn btn-outline-primary" htmlFor={`option${index}-${poll._id}`}>
                  {option.text}
                </label>
              </div>
              <div className="progress flex-grow-1 mx-2" style={{ minWidth: '20%' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${getPercentage(option.voters.length)}%` }}
                  aria-valuenow={getPercentage(option.voters.length)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {getPercentage(option.voters.length)}%
                </div>
              </div>
              <span className="ms-2 text-secondary">{getPercentage(option.voters.length)}% ({option.voters.length} votes)</span>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}

export default PollDisplay;
