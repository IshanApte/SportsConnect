import React, { useState, useEffect } from "react";
import BlockUser from './blockUser';
import { useAuth } from "../../services/useAuth";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const { currentUser } = useAuth(); // currentUser is a userId string

  // useEffect(() => {
  //   if (currentUser) {
  //     fetch(`${process.env.REACT_APP_API_URL}/friend-requests?userId=${currentUser}`)
  //       .then(response => response.json())
  //       .then(friendRequests => {
  //         // Fetch additional user details for each friend request
  //         const detailsPromises = friendRequests.map(request =>
  //           fetch(`${process.env.REACT_APP_API_URL}/user-details?userId=${request.userId}`)
  //             .then(response => response.json())
  //         );
  //         Promise.all(detailsPromises)
  //           .then(userDetails => {
  //             // Combine friend request IDs with user details
  //             const combinedData = friendRequests.map((request, index) => ({
  //               ...request,
  //               name: userDetails[index].name, // Adjust according to your user details structure
  //             }));
  //             setRequests(combinedData);
  //           });
  //       })
  //       .catch(console.error);
  //   }
  // }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetch(`${process.env.REACT_APP_API_URL}/friend-requests?userId=${currentUser}`)
        .then(response => response.json())
        .then(setRequests) // Directly set the friend requests with user details
        .catch(console.error);
    }
}, [currentUser]);


  const handleAccept = (friendId) => {
    if (currentUser) {
      console.log(`Accepting friend request from ${friendId}`);
      fetch(`${process.env.REACT_APP_API_URL}/accept-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser, friendId }) // Directly use currentUser
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to accept friend request');
        }
        return response.json();
      }).then(() => {
        console.log(`Friend request from ${friendId} accepted`);
        // Optimistically remove the request from the state
        setRequests(requests.filter(request => request.userId !== friendId));
      }).catch(console.error);
    }
  };

  const handleReject = (friendId) => {
    if (currentUser) {
      console.log(`Rejecting friend request from ${friendId}`);
      fetch(`${process.env.REACT_APP_API_URL}/reject-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser, friendId }) // Directly use currentUser
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to reject friend request');
        }
        return response.json();
      }).then(() => {
        console.log(`Friend request from ${friendId} rejected`);
        // Optimistically remove the request from the state
        setRequests(requests.filter(request => request.userId !== friendId));
      }).catch(console.error);
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Friend Requests</h3>
          {requests.length > 0 ? requests.map((request) => (
            <div key={request.userId} className="list-group mb-2">
              <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                <span>{request.name}</span>
                <div>
                  <button className="btn btn-success me-2" onClick={() => handleAccept(request.userId)}>Accept</button>
                  <button className="btn btn-danger" onClick={() => handleReject(request.userId)}>Reject</button>
                </div>
              </div>
            </div>
          )) : <div>No friend requests</div>}
          <BlockUser />
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;
