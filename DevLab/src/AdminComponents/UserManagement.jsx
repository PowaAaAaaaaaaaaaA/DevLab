import useFetchUsers from './userManagement hooks/useFetchUsers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function UserManagement() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["allUser"],
    queryFn: useFetchUsers,
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-white text-xl">
        Loading users...
      </div>
    );
  }

  // Handle error state
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

      {/* Body */}
      <div className="h-[70%] overflow-y-auto p-5">
        {users && users.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {users.map((user, index) => (
              <div
                key={user.uid}
                className="bg-gray-800 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
                <p className="font-bold text-lg">{user.name || "Unnamed User"}</p>
                <p className="text-sm opacity-80">{user.email || "No Email"}</p>
                <p className="text-xs mt-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      user.suspend ? "text-red-400" : "text-green-400"
                    }`}>
                    {user.suspend ? "Suspended" : "Active"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
