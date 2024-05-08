import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileUpload,
  faPoll,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "../../Styles/HomePage/postForm.css";

function PostForm({ onPostSubmit, onPollSubmit }) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [selectedSport, setSelectedSport] = useState(""); // Sport selection state
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Initialize with current timestamp

  const sports = ["Soccer", "Basketball", "Tennis", "Baseball", "Cricket"]; // List of sports

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
  };

  const submitPoll = async () => {
    if (!pollQuestion.trim() || pollOptions.some((option) => !option.trim())) {
      console.log('Validation failed: Question or options are empty.');
      return;
    }

    const pollData = {
      question: pollQuestion,
      options: pollOptions.filter((option) => option.trim()),
    };
    onPollSubmit(pollData); // Call the passed in onPollSubmit prop with the prepared data
    resetForm(); // Reset form fields after submission
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showPollCreator) {
      submitPoll();
    } else {
      if (!content.trim() && !media) return;
      onPostSubmit(content, media, selectedSport || "No Sport Selected");
      resetForm();
    }
  };

  const resetForm = () => {
    setContent("");
    setMedia(null);
    setSelectedSport("");
    setShowPollCreator(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setFileInputKey(Date.now()); // Reset the file input by updating its key
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const removePollOption = (indexToRemove) => {
    setPollOptions(pollOptions.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="postFormCard"> {/* Add this wrapper */}
    <form onSubmit={handleSubmit} className="formStyle">
      <select
        value={selectedSport}
        onChange={(e) => setSelectedSport(e.target.value)}
        className="inputStyle"
      >
        <option value="">Select a Sport</option>
        {sports.map((sport) => (
          <option key={sport} value={sport}>
            {sport}
          </option>
        ))}
      </select>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="textareaStyle"
      />

      <div className="buttonsContainerStyle d-flex flex-column flex-md-row justify-content-md-between justify-content-center align-items-center my-2">
        {!showPollCreator && (
          <label
          className="btn btn-primary btn-lg mb-2 mb-md-0 me-md-2" style={{ flexGrow: 1 }}
          >
            <FontAwesomeIcon icon={faFileUpload} className="me-2" />
            Upload Image/Video
            <input
              key={fileInputKey}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="fileInputStyle"
              style={{ display: "none" }}
            />
          </label>
        )}

        <button
          type="button"
          onClick={() => setShowPollCreator(!showPollCreator)}
          className={`btn ${showPollCreator ? "btn-secondary" : "btn-primary"} btn-lg w-100 w-md-auto ms-md-2`}
        >
          {showPollCreator ? (
            "Back to Post"
          ) : (
            <>
              <FontAwesomeIcon icon={faPoll} className="me-2" /> Create Poll
            </>
          )}
        </button>
      </div>

      {showPollCreator ? (
        <>
          <input
            type="text"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            placeholder="Poll question..."
            className="inputStyle"
          />
          {pollOptions.map((option, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...pollOptions];
                  newOptions[index] = e.target.value;
                  setPollOptions(newOptions);
                }}
                placeholder={`Option ${index + 1}`}
                className="inputStyle" style={{ flex: 1 }}
              />
              {pollOptions.length > 2 && (
                <button
                  onClick={() => removePollOption(index)}
                  className="buttonStyle"
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#dc3545",
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addPollOption}
            className="buttonStyle" 
            style={{ marginTop: "10px" }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Option
          </button>
        </>
      ) : null}

      <button type="submit" className="submitButtonStyle">
        {showPollCreator ? "Post Poll" : "Post"}
      </button>
    </form>
    </div>
  );
}

export default PostForm;
