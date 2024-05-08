import React from 'react';
import Post from './post'; // Correct import path
import PollDisplay from '../poll_item'; // Correct import path

function PostList({ posts, currentUser, onVote, updatePostLikes, onCommentAdded }) {
  const seen = new Set();

  posts.forEach(post => {
    if (seen.has(post._id)) {
      console.error("Duplicate key found:", post._id);
    }
    seen.add(post._id);
  });

  return (
    <div>
      {posts.map((post) => {
        const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
        return post.type === 'poll' ? (
          <PollDisplay key={post.id} poll={post} onVote={onVote} />
        ) : (
          <Post
            key={post._id}
            _id={post._id} // Explicitly passing _id to Post
            author={post.userId}
            content={post.postDescription}
            image={post.image}
            deletePost={post.deletePost} // Assuming deletePost function is passed down or managed in Post
            // likesCount={post.likes.length}
            likesCount={likesCount}
            comments={post.comments}
            updatePostLikes={updatePostLikes} // Assuming updatePostLikes function is passed down or managed in Post
            onCommentAdded = {onCommentAdded}
            currentUser={currentUser}
            shared={post.shared}
          />
        );
      })}
    </div>
  );
}

export default PostList;
