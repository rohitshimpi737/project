// Frontend: ProfilePage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import authApi from "../api/authApi";


const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.updateProfile({
        username: formData.username,
        email: formData.email,
      });
      updateUser(response.data.user);
      setMessage("Profile updated successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error updating profile");
      setMessage("");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      await authApi.updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      setMessage("Password changed successfully!");
      setError("");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Error changing password");
      setMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Profile Settings
        </h1>

        {/* Profile Update Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Personal Information
          </h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Password Change Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Account Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="font-medium">Account Role:</p>
              <p className="capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="font-medium">Member Since:</p>
              <p>{new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
