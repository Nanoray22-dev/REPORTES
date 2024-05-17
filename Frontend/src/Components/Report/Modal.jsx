import CommentSection from './CommentSection';

const Modal = ({ isOpen, onClose, report, onUpdateReport }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-3/4 lg:w-1/2 p-6">
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors float-right"
        >
          Close
        </button>
        <h1 className="text-2xl font-bold mb-4">Report Details</h1>
        <div className="mb-4">
          <p><strong>Title:</strong> {report.title}</p>
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>State:</strong> {report.state}</p>
          <p><strong>Created By:</strong> {report.createdBy}</p>
          <p><strong>Incident Date:</strong> {new Date(report.incidentDate).toLocaleDateString()}</p>
        </div>
        <button
          onClick={() => onUpdateReport(report._id, 'IN_PROGRESS')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mr-2"
        >
          Mark as In Progress
        </button>
        <button
          onClick={() => onUpdateReport(report._id, 'COMPLETED')}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Mark as Completed
        </button>
        <CommentSection reportId={report._id} />
      </div>
    </div>
  );
};

export default Modal;
