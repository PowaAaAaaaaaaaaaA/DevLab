import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProgress } from "../Functions/useDeleteProgress";
import { useEditUser } from "../Functions/useEditUser";
import { useDeleteAllProgress } from "../Functions/useDeleteAllProgress";

const categories = ["Html", "Css", "JavaScript", "Database"];

const EditUserModal = ({ visibility, closeModal, uid, activeLevel }) => {
  const queryClient = useQueryClient();
  const deleteProgress = useDeleteProgress();
  const editUserMutation = useEditUser();
  const deleteAllProgress = useDeleteAllProgress();

  const users = queryClient.getQueryData(["allUser"]) || [];
  const userInfo = useMemo(() => users.find((u) => u.id === uid), [users, uid]);

  const [toggleView, setToggleView] = useState(false);
  const [state, setState] = useState({
    username: "",
    bio: "",
    coins: 0,
    exp: 0,
    userLevel: 0,
  });

  useEffect(() => {
    if (!userInfo) return;
    setState({
      username: userInfo.username || "",
      bio: userInfo.bio || "",
      coins: userInfo.coins || 0,
      exp: userInfo.exp || 0,
      userLevel: userInfo.userLevel || 0,
    });
  }, [userInfo]);

  if (!userInfo) return null;

  return (
    <AnimatePresence>
      {visibility && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900 text-white w-[90%] max-w-2xl rounded-xl p-5 relative border border-red-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{userInfo.username}'s Info</h2>
              <button
                onClick={closeModal}
                className="text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <button
              onClick={() => setToggleView((prev) => !prev)}
              className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              {toggleView ? "Show Info" : "Show Progress"}
            </button>

            {toggleView ? (
              <div>
                {categories.map((category) => {
                  const completedLevels = userInfo.levelCount[category] || 0;
                  const totalLevels =
                    activeLevel[category]?.levelCounter || 100;
                  const percent = Math.min(completedLevels, totalLevels);

                  return (
                    <div key={category} className="mb-3">
                      <h3 className="capitalize mb-1">{category}</h3>
                      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                        <motion.div
                          className="bg-green-500 h-4"
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                      </div>
                      <p className="mt-1 text-sm">
                        Completed {completedLevels}/{totalLevels} levels
                      </p>
                      <button
                        onClick={() =>
                          deleteProgress.mutate({ uid, subject: category })
                        }
                        className="mt-1 text-red-500 text-xs underline"
                      >
                        Reset {category} Progress
                      </button>
                    </div>
                  );
                })}
                {/* DELETE ALL PROGRESS BUTTON */}
                <button
                  onClick={() => deleteAllProgress.mutate({ uid })}
                  className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                >
                  Reset All Progress
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* User info inputs */}
                <div>
                  <label className="text-xs text-gray-400">USERNAME</label>
                  <input
                    type="text"
                    value={state.username}
                    onChange={(e) =>
                      setState({ ...state, username: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">BIO</label>
                  <input
                    type="text"
                    value={state.bio}
                    onChange={(e) =>
                      setState({ ...state, bio: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">COINS</label>
                  <input
                    type="number"
                    value={state.coins}
                    onChange={(e) =>
                      setState({ ...state, coins: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">EXP</label>
                  <input
                    type="number"
                    value={state.exp}
                    onChange={(e) =>
                      setState({ ...state, exp: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">USER LEVEL</label>
                  <input
                    type="number"
                    value={state.userLevel}
                    onChange={(e) =>
                      setState({ ...state, userLevel: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                </div>
                <button
                  onClick={() => editUserMutation.mutate({ uid, state })}
                  className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                >
                  SAVE
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditUserModal;
