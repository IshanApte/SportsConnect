import React, { useState, useEffect } from "react";
import SocialButtons from "../../Components/common/socialButtons";
import { useAuth } from "../../services/useAuth"; // Ensure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Card, Button, Form, FormControl } from "react-bootstrap";

function Post({
  _id,
  author,
  content,
  image,
  deletePost,
  likesCount,
  onCommentAdded,
  comments = [],
  updatePostLikes,
  shared,
}) {
  const [localComments, setLocalComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn, currentUser } = useAuth(); // Now using currentUser from useAuth

  // useEffect(() => {
  //   setLocalComments(comments);
  // }, [comments]);
  useEffect(() => {
    // Only update if there is a real change to avoid infinite loops
    if (JSON.stringify(localComments) !== JSON.stringify(comments)) {
      setLocalComments(comments || []);
    }
  }, [comments]); // Ensure comments is correctly passed as a prop

  // Handles the increment or decrement of likes
  const handleLike = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/${currentUser}/posts/${_id}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update like status");
      }
      const updatedPost = await response.json();
      updatePostLikes(updatedPost); // This function should handle updating the likes count in the parent component's state
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      content: commentText,
      commenter: currentUser ? currentUser : "Anonymous", // Assuming currentUser has a name property
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/${currentUser}/posts/${_id}/comment`,
        {
          method: "PUT", // Use 'POST' if your API expects it
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newComment),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const updatedPost = await response.json();
      onCommentAdded(updatedPost);
      setCommentText(""); // Clear the input field
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  const sharePost = async () => {
    // Log the current user object to ensure it's correctly obtained
    console.log("Current user: ", currentUser);

    // Assuming `currentUser` has a `username` property you want to use in the URL
    const username = currentUser;
    console.log("Username for sharing: ", username); // This will confirm you're getting the right username

    const url = `${process.env.REACT_APP_API_URL}/${username}/posts/${_id}/share`;
    console.log("Constructed URL for sharing: ", url); // Check the constructed URL is as expected

    try {
      console.log("Attempting to share post with ID: ", _id); // Confirm the ID of the post being shared

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to share the post. Status: ${response.status}`);
      }

      console.log("Share response: ", await response.json()); // Log the response from the server
      alert("Post shared successfully!");
    } catch (error) {
      console.error("Error sharing the post: ", error.message);
      alert("Post already reshared");
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      {shared && shared.length > 0 && (
        <Card.Header>
          <small className="text-muted">{shared[0].userId} reshared this post.</small>
        </Card.Header>
      )}
      <Card.Body>
        <Card.Title>{author}</Card.Title>
        <Card.Text>{content}</Card.Text>
        {image && image.url && (
          <Card.Img variant="top" src={image.url} alt="Post" />
        )}
        <SocialButtons
          onLike={handleLike}
          likesCount={likesCount}
          onCommentToggle={() => setShowComments(!showComments)}
          commentsCount={comments.length}
          onShare={() => sharePost(_id)}
        />
      </Card.Body>
      {showComments && (
        <Card.Footer>
          <div className="comments-section">
            {localComments.map((comment, index) => (
              <Card.Text key={index}>
                <strong>{comment.commenter}:</strong> {comment.content}
              </Card.Text>
            ))}
            <Form inline onSubmit={handleCommentSubmit}>
              <FormControl
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="mr-2 flex-grow-1"
              />
              <Button variant="primary" type="submit">Comment</Button>
            </Form>
          </div>
        </Card.Footer>
      )}
      {error && <Card.Footer className="text-danger">{error}</Card.Footer>}
    </Card>
  );
}

export default Post;
