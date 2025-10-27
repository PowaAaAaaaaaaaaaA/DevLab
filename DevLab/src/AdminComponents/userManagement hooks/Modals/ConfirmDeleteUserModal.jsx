import { motion } from "framer-motion";

export default function ConfirmDeleteUserModal({
  isOpen,
  onConfirm,
  onCancel,
  username,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-[90%] max-w-sm text-center"
      >
        <h2 className="text-xl font-bold mb-3">Confirm Deletion</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-400">{username}</span>?
          <br /> This action cannot be undone.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
