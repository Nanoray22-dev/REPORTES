import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const Comments = ({ reportId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/report/${reportId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments", error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/user/me'); 
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user", error);
      }
    };

    fetchComments();
    fetchCurrentUser();

    let socket;
    // let reconnectAttempts = 0;
    // const maxReconnectAttempts = 10;

    const connectWebSocket = () => {
      socket = new WebSocket("ws://localhost:4040");

      // socket.onopen = () => {
      //   console.log("WebSocket connection established");
      //   reconnectAttempts = 0;
      // };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "new-comment" && message.comment && message.comment.report === reportId) {
            setComments((prevComments) => 
              prevComments.filter((comment) => comment._id === message.comment._id)
            );
            fetchComments();
          }
        } catch (error) {
          console.error("Error processing WebSocket message", error);
        }
      };

      // socket.onerror = (error) => {
      //   console.error("WebSocket error", error);
      // };

      // socket.onclose = (event) => {
      //   console.log("WebSocket closed", event);
      //   if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) { 
      //     console.error(`WebSocket closed unexpectedly with code: ${event.code}. Reconnecting...`);
      //     reconnectAttempts++;
      //     setTimeout(connectWebSocket, Math.min(10000, 1000 * reconnectAttempts));
      //   } else {
      //     console.error("Max reconnect attempts reached. Unable to reconnect to WebSocket.");
      //   }
      // };
    };

    connectWebSocket();

    return () => {
      socket.close();
    };
  }, [reportId]);

  const handleAddComment = async () => {
    try {
      const response = await axios.post(`/report/${reportId}/comment`, { text: newComment });
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const response = await axios.put(`/report/${reportId}/comment/${commentId}`, { text: editingText });
      setComments((prevComments) => 
        prevComments.map((comment) => comment._id === commentId ? response.data : comment)
      );
      setEditingCommentId(null);
      setEditingText('');
    } catch (error) {
      console.error("Error editing comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/report/${reportId}/comment/${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  return (
    <div className="mt-3">
      <div className="mb-3 h-40 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="bg-gray-200 p-3 rounded-md text-center text-gray-600">
            Sé el primero en comentar sobre esta incidencia.
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-100 p-2 rounded-md mb-2">
              <p className="text-gray-700 font-bold text-sm">{comment.createdBy.username}</p>
              <p className="text-gray-500 text-xs">
                {moment(comment.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
              </p>
              <p className="text-gray-700 text-sm">{comment.text}</p>
              {currentUser && currentUser._id === comment.createdBy._id && (
                editingCommentId === comment._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full p-2 rounded-md border border-gray-300"
                    />
                    <button
                      onClick={() => handleEditComment(comment._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors mt-2 mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditingText(comment.text);
                      }}
                      className="text-yellow-500  px-3 py-1 rounded-md hover:bg-yellow-300 transition-colors "
                    >
                     <FaRegEdit /> 
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500  px-3 py-1 rounded-md hover:bg-red-300 transition-colors"
                    >
                     <RiDeleteBin6Line />
                    </button>
                  </div>
                )
              )}
            </div>
          ))
        )}
      </div>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full p-2 rounded-md border border-gray-300"
        placeholder="Add a comment..."
      />
      <button
        onClick={handleAddComment}
        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors mt-2"
      >
        Add Comment
      </button>
    </div>
  );
};

export default Comments;
