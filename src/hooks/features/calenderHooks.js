import { useState, useCallback, useRef } from "react";
import { getCalanderData } from "../../api/modules/calander";
import {
  markAsPickedUpOrder,
  markAsDeliveredOrder,
  markAsCompletedOrder,
} from "../../api/modules/order";
import { useErrorDialog } from "../../lib/context/errorDialogContext";
import { useSuccessDialog } from "../../lib/context/successDialogContext";

const useCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useErrorDialog();
  const { showSuccess } = useSuccessDialog();
  const lastParamsRef = useRef(null);

  const fetchData = useCallback(async (month, year) => {
    setIsLoading(true);
    try {
      lastParamsRef.current = { month, year };
      const body = {
        month: month.toString(),
        year: year.toString(),
      };

      const response = await getCalanderData(body);

      if (response?.status >= 200 && response?.status < 300) {
        const calendarData = response?.data?.data?.calendarData || {};
        console.log(calendarData, "calendarData");
        const eventsList = [];

        Object.keys(calendarData).forEach((dateStr) => {
          const dateParts = dateStr.split("-");
          if (dateParts.length !== 3) return;

          const dateYear = parseInt(dateParts[0], 10);
          const dateMonth = parseInt(dateParts[1], 10);
          const dateDay = parseInt(dateParts[2], 10);

          if (!Array.isArray(calendarData[dateStr])) return;

          calendarData[dateStr].forEach((order) => {
            const timeToUse = order.deliveryTime || order.pickupTime;
            const eventType =
              order.eventType || (order.deliveryTime ? "Delivery" : "Pickup");

            if (timeToUse) {
              const timeParts = timeToUse.split(":");
              if (timeParts.length >= 2) {
                const h = parseInt(timeParts[0], 10);
                const m = parseInt(timeParts[1], 10);

                if (!isNaN(h) && !isNaN(m)) {
                  const startDate = new Date(
                    dateYear,
                    dateMonth - 1,
                    dateDay,
                    h,
                    m
                  );
                  const endDate = new Date(
                    dateYear,
                    dateMonth - 1,
                    dateDay,
                    h,
                    m + 30
                  );

                  console.log(order, "ordeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                  eventsList.push({
                    id: order._id,
                    start: startDate,
                    end: endDate,
                    type: eventType,
                    status: order.status || "Planned",
                    orderId: order.orderId,
                    customerName: order.customerName,
                    address: order.address,
                    city: order.city,
                    deliveryTime: order.deliveryTime || "",
                    pickupTime: order.pickupTime || "",
                    paymentStatus: order.paymentStatus || "",
                    totalAmount: order.totalAmount,
                    itemCount: order.itemCount,
                    items: order.items || [],
                  });
                }
              }
            }
          });
        });

        setEvents(eventsList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchLast = useCallback(async () => {
    const params = lastParamsRef.current;
    if (params) {
      await fetchData(params.month, params.year);
    }
  }, [fetchData]);

  // Mark as Picked Up
  const handleMarkAsPickedUp = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        const response = await markAsPickedUpOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await refetchLast();
          showSuccess({
            title: response.data.message,
          });
        } else {
          showError({
            title: response.data.message,
          });
        }
        return response?.data;
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to mark as picked up",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [refetchLast, showError, showSuccess]
  );

  // Mark as Delivered
  const handleMarkAsDelivered = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        const response = await markAsDeliveredOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await refetchLast();
          showSuccess({
            title: response.data.message,
          });
        } else {
          showError({
            title: response.data.message,
          });
        }
        return response?.data;
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to mark as delivered",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [refetchLast, showError, showSuccess]
  );

  // Mark as Completed
  const handleMarkAsCompleted = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        const response = await markAsCompletedOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await refetchLast();
          showSuccess({
            title: response.data.message,
          });
        } else {
          showError({
            title: response.data.message,
          });
        }
        return response?.data;
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to mark as completed",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [refetchLast, showError, showSuccess]
  );
  return {
    events,
    isLoading,
    fetchData,
    handleMarkAsPickedUp,
    handleMarkAsDelivered,
    handleMarkAsCompleted,
  };
};

export default useCalendar;
