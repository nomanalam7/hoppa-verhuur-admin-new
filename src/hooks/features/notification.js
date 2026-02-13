import { useCallback, useEffect, useState } from "react";
import { getNotifications } from "../../api/modules/notificationApi";


export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getNotifications();
            if (response?.status === 200 || response.status === 201) {
                setNotifications(response.data.data);
            }
            return response?.data;
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to fetch notifications");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        loading,
        error,
        fetchNotifications,
    };
};