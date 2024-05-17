import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Comments = ({ reportId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyComment, setReplyComment] = useState({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/report/${reportId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [reportId]);

  const handleAddComment = async () => {
    if (!newComment) {
      toast.error('Comment text is required');
      return;
    }

    try {
      const response = await axios.post(`/report/${reportId}/comment`, {
        text: newComment,
      });
      setComments(response.data.comments);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    }
  };

  const handleAddReply = async (parentId) => {
    if (!replyComment[parentId]) {
      toast.error('Reply text is required');
      return;
    }

    try {
      const response = await axios.post(`/report/${reportId}/comment`, {
        text: replyComment[parentId],
        parentId: parentId,
      });
      setComments(response.data.comments);
      setReplyComment((prev) => ({ ...prev, [parentId]: '' }));
      toast.success('Reply added successfully');
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Error adding reply');
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <div>
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p>{comment.text}</p>
            <p>By: {comment.createdBy.username}</p>
            <div className="reply-section">
              <input
                type="text"
                value={replyComment[comment._id] || ''}
                onChange={(e) =>
                  setReplyComment({ ...replyComment, [comment._id]: e.target.value })
                }
                placeholder="Add a reply..."
              />
              <button onClick={() => handleAddReply(comment._id)}>Reply</button>
            </div>
            {comment.replies &&
              comment.replies.map((reply) => (
                <div key={reply._id} className="reply">
                  <p>{reply.text}</p>
                  <p>By: {reply.createdBy.username}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="add-comment-section">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Comment</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Comments;
