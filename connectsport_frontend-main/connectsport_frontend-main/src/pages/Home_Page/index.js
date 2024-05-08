import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/useAuth"; // Adjust the path as necessary
import Navbar from "../../Components/layout/navbar";
import PostList from "../post_item/postList";
import PostForm from "../post_item/postForm";
import SearchComponent from "../../Components/common/searchComponent";
import PollDisplay from "../poll_item/index"; // Import the PollDisplay component
import "../../Styles/HomePage/mypolls.css"

function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, handleLogout } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [showPollForm, setShowPollForm] = useState(false);
  const [polls, setPolls] = useState([]); // New state for polls

  useEffect(() => {
    // const fetchPosts = async () => {
    //   try {
    //     const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       const postsWithLikes = data.map(post => ({
    //         ...post,
    //         likes: post.likes || [], // Ensures likes is always an array
    //       }));
    //       setPosts(postsWithLikes);
    //     } else {
    //       throw new Error("Failed to fetch posts");
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     navigate("/login"); // Redirect to login if fetching posts fails
    //   }
    // };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();

          // Map through the data to ensure 'likes' is always an array
          const postsWithLikes = data.map((post) => ({
            ...post,
            likes: post.likes || [],
          }));

          // Deduplicate posts based on their '_id'
          const uniquePosts = postsWithLikes.reduce((acc, current) => {
            const x = acc.find((item) => item._id === current._id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

          // Update state with unique posts
          setPosts(uniquePosts);
        } else {
          throw new Error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        navigate("/login"); // Redirect to login if fetching posts fails
      }
    };

    const fetchPolls = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/polls`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPolls(data);
        } else {
          throw new Error("Failed to fetch polls");
        }
      } catch (error) {
        console.error(error);
        navigate("/login"); // Redirect to login if fetching polls fails
      }
    };

    if (isLoggedIn) {
      fetchPosts();
      fetchPolls();
    }
  }, [isLoggedIn, navigate]);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("userName");
  //   setCurrentUser(null);
  //   navigate("/login");
  // };

  const addNewPost = async (content, imageFile, tag) => {
    const formData = new FormData();
    //    formData.append("content", content);
    formData.append("content", content.toString()); // Convert to string to ensure no object is passed
    formData.append("tag", tag); // 'tag' should already be a string based on your form
    formData.append("author", currentUser || "Anonymous"); // Ensure this is correctly set based on your state
    if (imageFile) {
      formData.append("image", imageFile); // Only add if image is selected
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/newpost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure this is correct
          // Do not set 'Content-Type' here, let the browser set it
        },
        body: formData,
      });
      if (response.ok) {
        const newPost = await response.json();
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const goToUserPolls = () => {
    navigate("/user-polls");
  };

  // Add this function inside your HomePage component
  const deletePost = async (postId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust according to your auth method
          },
        }
      );
      if (response.ok) {
        // Filter out the post from the current state
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePollCreated = async (pollData) => {
    console.log("Creating new poll:", pollData);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/newpoll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      });
      if (response.ok) {
        // After successful post submission
        window.location.reload(); // This reloads the entire page
      }
      if (!response.ok) {
        throw new Error("Failed to create poll");
      }
      const newPoll = await response.json();
      console.log("Poll created successfully", newPoll);
      setPosts((prevPosts) => [newPoll, ...prevPosts]);
    } catch (error) {
      console.error("Error creating poll:", error.message);
    }
  };

  const handleVote = async (pollId, optionText) => {
    console.log("Attempting to vote on poll:", pollId); // Debug: Check the poll ID when attempting to vote
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/polls/${pollId}/vote`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: optionText }),
        }
      );

      console.log("Response status:", response.status); // Debug: Check the response status

      if (response.ok) {
        const updatedPoll = await response.json();
        console.log("Vote successful, updated poll:", updatedPoll); // Debug: Log the updated poll
        setPolls((prevPolls) =>
          prevPolls.map((poll) =>
            poll._id === updatedPoll._id ? updatedPoll : poll
          )
        );
      } else {
        const error = await response.text();
        console.error("Failed to cast vote:", error); // Debug: Log detailed error message
        throw new Error("Failed to cast vote");
      }
    } catch (error) {
      console.error("Error in handleVote:", error.message); // Debug: Log errors in the catch block
    }
  };

  const updatePostLikes = (updatedPost) => {
    // Assume updatedPost contains the full updated post object, including its new likes count
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const onCommentAdded = (updatedPost) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  return (
    <div className="container-fluid p-0">
      <Navbar
        user={currentUser}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSearchChange={setSearchInput}
      />
      {searchInput && <SearchComponent />}
      <div className="row">
        <div className="col-md-3 text-center text-md-start">
          <button
            onClick={goToUserPolls}
            className="btn btn-lg px-3 py-2 w-100 w-md-auto mb-3 mb-md-0 shadow-sm btn-my-polls"
          >
            My Polls
          </button>
        </div>
        <div className="col-md-6">
          <PostForm
            onPostSubmit={addNewPost}
            onPollSubmit={handlePollCreated}
          />
          <PostList
            posts={posts}
            currentUser={currentUser}
            onDeletePost={deletePost}
            onVote={handleVote}
            updatePostLikes={updatePostLikes}
            onCommentAdded={onCommentAdded}
          />
          {polls.map((poll) => (
            <PollDisplay key={poll._id} poll={poll} onVote={handleVote} />
          ))}
        </div>
        <div className="col-md-3">{/* Right sidebar content */}</div>
      </div>
    </div>
  );
}

export default HomePage;
