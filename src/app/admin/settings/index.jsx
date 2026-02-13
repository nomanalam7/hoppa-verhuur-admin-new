import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ProfileSettings from "./profileSettings";
import ChangePassword from "./changePassword";
import NotificationSettings from "./notificationSettings";
import { useAuth } from "../../../hooks/features/auth";
import { useSuccessDialog } from "../../../lib/context/successDialogContext";

const SettingsPage = () => {
  const { handleGetUserDetails, handleUserUpdate } = useAuth();
  const { showSuccess } = useSuccessDialog();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [emailNotifications, setEmailNotifications] = useState(false);

  // 🔹 Get user details
  const fetchUserData = async () => {
    try {
      const res = await handleGetUserDetails();
      if (res?.success) {
        const user = res?.data?.admin || res?.data || {};
        setUserData(user);
        setProfileForm({
          fullName: user?.name || "",
          email: user?.email || "",
          phoneNumber: user?.contactNumber || "",
        });
        setEmailNotifications(user?.emailNotifications ?? false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // 🔹 Input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Save profile
  const handleProfileSave = async () => {
    setLoading(true);
    try {
      const res = await handleUserUpdate({
        name: profileForm.fullName,
        contactNumber: profileForm.phoneNumber,
      });

      if (res?.success) {
        showSuccess("Profiel succesvol bijgewerkt");
        await fetchUserData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cancel
  const handleProfileCancel = () => {
    if (!userData) return;
    setProfileForm({
      fullName: userData?.name || "",
      email: userData?.email || "",
      phoneNumber: userData?.contactNumber || "",
    });
  };


  const handleNotificationToggle = async (checked) => {
    setEmailNotifications(checked);

    try {
      const res = await handleUserUpdate({
        emailNotifications: checked,
      });

      if (res?.success) {
        showSuccess("Notification settings updated");
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Box bgcolor="#fff" p={3} borderRadius="16px" mt={3}>
        <ProfileSettings
          formData={profileForm}
          loading={loading}
          onChange={handleProfileChange}
          onSave={handleProfileSave}
          onCancel={handleProfileCancel}
        />

        <Divider sx={{ my: 3 }} />

        <ChangePassword />
      </Box>

      <Box bgcolor="#fff" p={3} borderRadius="16px" mt={3}>
        <NotificationSettings
          checked={emailNotifications}
          onToggle={handleNotificationToggle}
        />

      </Box>
    </Box>
  );
};

export default SettingsPage;
