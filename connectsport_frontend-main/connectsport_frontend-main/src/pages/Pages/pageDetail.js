import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import styles from "../../Styles/Pages/pageDetail.css"; // Update the path as needed
import { useAuth } from "../../services/useAuth";
import Navbar from "../../Components/layout/navbar"; // Ensure this path is correct
import PostForm from "../post_item/postForm"; // Make sure you have this component
import Post from "../post_item/post";
import MockPaymentPortal from "./mockPaymentPortal";
import SearchComponent from "../../Components/common/searchComponent";

const PageDetail = () => {
  const [pageDetails, setPageDetails] = useState({ posts: [], title: "" });
  const [showPostForm, setShowPostForm] = useState(false);
  const { id } = useParams();
  const { isLoggedIn, currentUser, handleLogout } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPageDetailsAndPosts = async () => {
      try {
        console.log("Fetching page details and posts for ID:", id);
        // Fetch page details
        const pageDetailsResult = await axios.get(
          `${process.env.REACT_APP_API_URL}/pages/${id}`
        );
        console.log("Page Details Result:", pageDetailsResult.data);
        if (pageDetailsResult.status === 200) {
          setPageDetails(pageDetailsResult.data);

          // Check if page detail includes followers to determine following status
          setIsFollowing(
            pageDetailsResult.data.followers?.includes(currentUser)
          );
        }

        // Fetch posts for the page
        const postsResult = await axios.get(
          `${process.env.REACT_APP_API_URL}/pages/${id}/posts`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust as per your auth setup
            },
          }
        );
        if (postsResult.status === 200) {
          // Update pageDetails with posts
          console.log(
            "pageDetails.posts",
            pageDetails.posts,
            Array.isArray(pageDetails.posts)
          );
          setPageDetails((prevDetails) => ({
            ...prevDetails,
            posts: Array.isArray(postsResult.data) ? postsResult.data : [],
          }));
          // setPageDetails((prevDetails) => ({ ...prevDetails, posts: postsResult.data }));
        }
      } catch (error) {
        console.error("Error fetching page details or posts:", error);
        navigate("/error"); // Adjust as per your routing setup
      }
    };

    fetchPageDetailsAndPosts();
  }, [id, currentUser, navigate]);

  const toggleFollow = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/pages/${id}/toggle-follow`,
        { userId: currentUser } // Sending the userId in the request body
      );

      if (response.status === 200) {
        setIsFollowing(response.data.isFollowing); // Update based on the server's response
        // Optionally, update the local state to reflect the new followers list
        setPageDetails((prevDetails) => ({
          ...prevDetails,
          followers: response.data.isFollowing
            ? [...prevDetails.followers, currentUser]
            : prevDetails.followers.filter((userId) => userId !== currentUser),
        }));
      } else {
        console.error("Failed to toggle follow status");
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  // Format the date in a more readable form
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShare = () => {
    console.log("Sharing page", { userId: currentUser, pageId: id }); // Log the data being sent
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/sharePage`,
        {
          userId: currentUser, // Assuming you have the current user's ID
          pageId: id, // The ID of the page being shared, from useParams()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // If your endpoint requires authentication
          },
        }
      )
      .then((response) => {
        console.log("Page shared successfully response:", response); // Log success response
        alert("Page shared successfully!"); // Or any other feedback mechanism
      })
      .catch((error) => {
        console.error("Failed to share the page:", error);
        // Handle errors (e.g., show an error message)
      });
  };

  // To handle post creation
  const handleCreatePost = () => {
    setShowPostForm(!showPostForm); // Toggle the visibility of the PostForm
  };

  const updatePostLikes = (updatedPost) => {
    // Assume updatedPost contains the full updated post object, including its new likes count
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  // Example function to add a comment to a post (adjust as needed)
  const onCommentAdded = (postId, updatedPost) => {
    const updatedPosts = pageDetails.posts.map((post) =>
      post._id === postId ? updatedPost : post
    );
    setPageDetails({ ...pageDetails, posts: updatedPosts });
  };

  const handlePostSubmit = async (content, imageFile, tag) => {
    const formData = new FormData();
    //    formData.append("content", content);
    formData.append("content", content.toString()); // Convert to string to ensure no object is passed
    formData.append("tag", tag); // 'tag' should already be a string based on your form
    // formData.append("author", pageDetails.title || "Anonymous"); // Ensure this is correctly set based on your state
    formData.append("author", id || "Anonymous");
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

  // Donation related functionalities
  const handlePaymentSuccess = async (paymentDetails) => {
    setIsLoading(true);
    setSuccessMessage("");
    // Assuming `currentUser` contains user's ID or username needed by the backend
    const donationData = {
      userId: currentUser, // Adjust according to your `currentUser` object structure
      pageId: id,
      amount: paymentDetails.amount,
      cardDetails: {
        cardNumber: paymentDetails.cardNumber,
        expiryDate: paymentDetails.expiryDate,
        cvv: paymentDetails.cvv,
      },
    };

    try {
      console.log(
        `Attempting to process donation for user ${currentUser} on page ${id} with amount ${paymentDetails.amount}`
      );
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/donate`,
        donationData
      );
      if (response.status === 200) {
        setSuccessMessage("Your donation has been processed successfully!");
        // setShowPaymentModal(false);
      } else {
        setSuccessMessage("Failed to process donation.");
        // alert("Failed to process donation.");
      }
    } catch (error) {
      console.error(
        "Error processing donation:",
        error.response ? error.response.data : error
      );
      setSuccessMessage("An error occurred while processing your donation.");
    }
    setIsLoading(false);
    setShowPaymentModal(false);
  };

  return (
    <div className={`container-fluid ${styles.container}`}>
      <Navbar
        user={currentUser}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSearchChange={setSearchInput} // Pass setSearchInput as a prop
      />
      {searchInput && <SearchComponent />}
      <Container>
        {isLoading && (
          <Row>
            <Col className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        )}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Card className="my-4">
          <Card.Body>
            <Card.Title className={styles.pageTitle}>
              {pageDetails.title || "Page Details"}
            </Card.Title>
            <hr />
            <Row className="my-2">
              <Col md={6} lg={3}>
                <strong>Type:</strong> {pageDetails.type}
              </Col>
              <Col md={6} lg={3}>
                <strong>Date Created:</strong>{" "}
                {formatDate(pageDetails.createdAt)}
              </Col>
              <Col md={6} lg={3}>
                <strong>Created By:</strong> {pageDetails.createdBy}
              </Col>
              {pageDetails.type === "event" && (
                <>
                  <Col md={6} lg={3}>
                    <strong>Event Date:</strong> {formatDate(pageDetails.date)}
                  </Col>
                  <Col md={6} lg={3}>
                    <strong>Event Venue:</strong> {pageDetails.venue}
                  </Col>
                </>
              )}
              {pageDetails.type === "organization" && (
                <Col md={6} lg={3}>
                  <strong>Location:</strong> {pageDetails.location}
                </Col>
              )}
              <Col md={6} lg={3}>
                <strong>Contact Number:</strong> {pageDetails.contactNumber}
              </Col>
            </Row>
            <Row className="my-2">
              <Col xs={12}>
                <Button
                  variant={isFollowing ? "success" : "primary"}
                  onClick={toggleFollow}
                  className="mr-2"
                  disabled={!currentUser} // Disable button if there is no logged-in user
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                {pageDetails.askForDonations && (
                  <>
                    <Button
                      variant="success"
                      onClick={() => setShowPaymentModal(true)}
                      className="mx-2"
                    >
                      Donate
                    </Button>
                    <MockPaymentPortal
                      show={showPaymentModal}
                      handleClose={() => setShowPaymentModal(false)}
                      handlePaymentSuccess={handlePaymentSuccess}
                    />
                  </>
                )}
                <Button variant="info" onClick={handleShare}>
                  Share
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        {/* Posts Section */}
        <Row className="my-2">
          <Col xs={12}>
            {currentUser === pageDetails.createdBy && (
              <Button
                variant="primary"
                onClick={() => setShowPostForm(!showPostForm)}
              >
                {showPostForm ? "Cancel" : "Create Post"}
              </Button>
            )}
          </Col>
        </Row>
        {showPostForm && <PostForm onPostSubmit={handlePostSubmit} />}
        {/* Posts Section */}
        <Row>
          <Col>
            <h2>Posts</h2>
            {pageDetails.posts &&
              pageDetails.posts.map((post) => (
                <Post
                  key={post._id}
                  _id={post._id}
                  // author={pageDetails.title} // Ensure these props align with your Post component's expected props
                  author={id}
                  content={post.content}
                  image={post.image}
                  deletePost={() => {}}
                  likesCount={post.likesCount}
                  comments={post.comments}
                  updatePostLikes={updatePostLikes}
                  onCommentAdded={onCommentAdded}
                  currentUser={currentUser}
                />
              ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageDetail;
