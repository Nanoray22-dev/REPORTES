import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const CommentSection = ({ reportId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/report/${reportId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments", error);
      }
    };

    fetchComments();
  }, [reportId]);

  const handleAddComment = async () => {
    try {
      const response = await axios.post(`/report/${reportId}/comment`, { text: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <div className="mb-4 h-64 overflow-y-auto">
        {comments.map((comment, index) => (
          <div key={index} className="bg-gray-100 p-2 rounded-md mb-2">
            <p className="text-gray-700 font-bold">{comment.createdBy.username}</p>
            <p className="text-gray-500 text-sm">
              {moment(comment.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
            <p className="text-gray-700">{comment.text}</p>
          </div>
        ))}
      </div>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full p-2 rounded-md border border-gray-300"
        placeholder="Add a comment..."
      />
      <button
        onClick={handleAddComment}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mt-2"
      >
        Add Comment
      </button>
    </div>
  );
};

export default CommentSection;
