import { formatNLCurrency } from "./index";
// Transform order data for table
export const transformOrdersForTable = (orders) => {
  if (!orders || !Array.isArray(orders)) return [];

  return orders.map((order) => ({
    _id: order._id,
    orderId: {
      customerName:
        `${order.customerDetails?.firstName || ""} ${
          order.customerDetails?.lastName || ""
        }`.trim() || "N/A",
      orderId: order.orderId || "N/A",
      email: order.customerDetails?.email || "",
      phone: order.customerDetails?.phoneNumber || "",
    },
    products: {
      items:
        order.rentalItems?.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          pricePerDay: item.pricePerDay,
          totalPrice: item.totalPrice,
        })) || [],
      totalItems: order.rentalItems?.length || 0,
    },
    deliveryDate: order.deliveryDate || null,
    pickupDate: order.pickupDate || null,
    totalAmount: formatNLCurrency(order.total) || 0, 
    status: order.status || "N/A",
    paymentStatus: order.paymentStatus || "N/A",
    createdAt: order.createdAt || null,
    deliveryMethod: order.pickupDeliveryType || "N/A",
    // Extra useful data
    deliveryAddress: order.deliveryAddress || "",
    deliveryTime: order.deliveryTime || "",
    pickupTime: order.pickupTime || "",
    subtotal: formatNLCurrency(order.subtotal) || 0,
    transportCost: formatNLCurrency(order.transportCost) || 0,
    serviceFees: formatNLCurrency(order.serviceFees?.total) || 0,
    isDelivered: order.isDelivered || false,
    isPickedUp: order.isPickedUp || false,
  }));
};
