import { useState } from "react";
import useFetchUsers from "./userManagement hooks/useFetchUsers";
import setSuspended from "./userManagement hooks/setSuspended";
import useAdminSubjProgressBar from "./userManagement hooks/useAdminSubjProgressBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

function UserManagement() {
  const [openUserId, setOpenUserId] = useState(null);
  const queryClient = useQueryClient();

  // List of subjects to track
  const subjects = ["Html", "Css", "JavaScript", "Database"];

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allUser"],
    queryFn: useFetchUsers,
  });

  // Toggle suspend/activate user
  const mutation = useMutation({
    mutationFn: ({ uid, isSuspended }) => setSuspended(uid, isSuspended),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allUser"] }),
  });

  // Find currently selected user
  const currentUser = users.find((u) => u.uid === openUserId);

  // Hook progress for each subject for the selected user
  const userProgress = subjects.map((subject) =>
    useAdminSubjProgressBar(subject, openUserId)
  );

  // Loading and error handling for user list
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-white text-xl">
        Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center text-red-500 text-xl">
        Failed to load users.
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b border-white h-auto flex flex-col justify-between p-5">
        <div className="flex text-white font-exo justify-between p-10">
          <h1 className="text-[3.2rem] font-bold">User Management</h1>
        </div>
      </div>

      {/* User List */}
      <div className="h-[65%] overflow-y-auto p-5 scrollbar-custom mt-5">
        {users.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
              <div
                key={user.uid}
                className="bg-gray-800 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition flex gap-8">
                {/* User Avatar */}
              <div className="flex-shrink-0 w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full overflow-hidden border border-white">
                <img
                  src={user.profileImage || "/defaultAvatar.png"}
                  alt={`${user.username || "User"}'s profile`}
                  className="w-full h-full object-cover"/>
              </div>
                {/* User Info */}
                <div>
                  <p className="font-bold text-lg">
                    <span>Username: </span>
                    {user.username || "Unnamed User"}
                  </p>
                  <p className="text-sm opacity-80">
                    <span>Email: </span>
                    {user.email || "No Email"}
                  </p>
                  <p className="text-xs mt-2">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        user.suspend ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {user.suspend ? "Suspended" : "Active"}
                    </span>
                  </p>
                </div>

                {/* Progress Button */}
                <motion.button
                  onClick={() =>
                    setOpenUserId((prev) => (prev === user.uid ? null : user.uid))
                  }
                  className="ml-auto px-5 py-2 border mt-auto mb-auto cursor-pointer rounded-md text-sm font-semibold">
                  Progress
                </motion.button>

                {/* Suspend/Activate Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2 mt-auto mb-auto cursor-pointer rounded-md text-sm font-semibold transition duration-200 ${
                    user.suspend
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  onClick={() =>
                    mutation.mutate({ uid: user.uid, isSuspended: user.suspend })
                  }>
                  {user.suspend ? "Activate" : "Suspend"}
                </motion.button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center">No users found.</p>
        )}
      </div>

      {/* Progress Popup */}
      <AnimatePresence>
        {openUserId && (
          <motion.div
            key="progress-popup"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] h-[50%] bg-gray-900 text-white z-50 p-6 shadow-xl rounded-t-2xl overflow-y-auto scrollbar-custom">
            {/* Popup Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentUser?.username || "User"}'s Progress
              </h2>
              <button
                onClick={() => setOpenUserId(null)}
                className="text-white text-lg font-bold"
                aria-label="Close progress popup">
                ✕
              </button>
            </div>
            {/* Progress Content */}
            {currentUser ? (
              userProgress.some((subj) => subj.total === 0) ? (
                <p>Loading progress...</p>
              ) : (
                subjects.map((subject, idx) => {
                  const { animatedBar, total } = userProgress[idx];
                  const percent = Math.round(animatedBar);

                  return (
                    <div key={subject} className="mb-4">
                      <h3 className="capitalize mb-1">{subject}</h3>
                      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                        <motion.div
                          className="bg-green-500 h-4"
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}/>
                      </div>
                      <p className="mt-1 text-sm">
                        Completed {percent}% ({Math.round((percent / 100) * total)}
                        /{total} levels)
                      </p>
                    </div>
                  );
                })
              )
            ) : (
              <p>User not found.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserManagement;
