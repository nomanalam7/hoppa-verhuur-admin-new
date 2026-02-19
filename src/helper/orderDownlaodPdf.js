import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getOrderById } from "../api/modules/order";
import moment from "moment";
import logo from "../assets/images/main-logo.png";
import { formatNLCurrency } from "./index";
import useVatStore from "../zustand/useVatStore";

export const downloadOrderPdf = async (orderId) => {
  const vatPercentage = useVatStore.getState().getVatPercentage();
const zero = 0;
  console.log(vatPercentage, "vatPercentagerrrrrrrrrrrrrrrrrrrrrrrrrrr");
  try {
    const response = await getOrderById(orderId);
    const orderData = response?.data?.data || response?.data || response;
    console.log(orderData, "ejdiwejfiowejfoiwjrfoiwr");

    if (!orderData) {
      console.error("Geen ordergegevens gevonden");
      return;
    }

    const THEME_COLOR = [29, 78, 137]; // #1D4E89
    const doc = new jsPDF("p", "mm", "a4");

    /* ================= HEADER ================= */
    doc.setFillColor(...THEME_COLOR);
    doc.rect(0, 0, 210, 32, "F");

    // Logo
    doc.addImage(logo, "SVG", 14, 6, 20, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Besteloverzicht", 40, 18);

    doc.setFontSize(10);
    doc.text(
      `Besteld op: ${moment(orderData.createdAt).format("DD-MM-YYYY, HH:mm")}`,
      150,
      18
    );

    doc.setTextColor(0, 0, 0);

    /* ================= ORDER INFO ================= */
    let y = 42;

    doc.setFontSize(11);
    doc.text(`Bestelnummer:`, 14, y);
    doc.text(`${orderData.orderId || orderData._id}`, 50, y);

    y += 6;
    doc.text(`Status:`, 14, y);
    doc.text(`${orderData.status}`, 50, y);

    /* ================= CUSTOMER DETAILS ================= */
    y += 14;
    doc.setFontSize(14);
    doc.setTextColor(...THEME_COLOR);
    doc.text("Klantgegevens", 14, y);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    y += 8;

    const customer = orderData.customerDetails || {};
    doc.text(`Naam: ${customer.firstName || ""} ${customer.lastName || ""}`, 14, y);
    y += 5;
    doc.text(`E-mail: ${customer.email || "N.v.t."}`, 14, y);
    y += 5;
    doc.text(`Telefoon: ${customer.phoneNumber || "N.v.t."}`, 14, y);

    /* ================= LOGISTICS ================= */
    const rightX = 110;
    let rightY = 64;

    doc.setFontSize(14);
    doc.setTextColor(...THEME_COLOR);
    doc.text("Logistiek", rightX, rightY);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    rightY += 8;
    doc.text(`Stad: ${orderData.city || "N.v.t."}`, rightX, rightY);

    rightY += 6;
    doc.text("Bezorgadres:", rightX, rightY);
    const deliveryAddress = doc.splitTextToSize(
      orderData.deliveryAddress || "N.v.t.",
      80
    );
    doc.text(deliveryAddress, rightX, rightY + 5);

    rightY += 5 + deliveryAddress.length * 4;
    doc.text(
      `Bezorgdatum: ${orderData.deliveryDate
        ? moment(orderData.deliveryDate).format("DD-MM-YYYY")
        : "N.v.t."
      } ${orderData.deliveryTime || ""}`,
      rightX,
      rightY
    );

    rightY += 8;
    doc.text("Ophaaladres:", rightX, rightY);
    const pickupAddress = doc.splitTextToSize(
      orderData.pickupAddress || "N.v.t.",
      80
    );
    doc.text(pickupAddress, rightX, rightY + 5);

    rightY += 5 + pickupAddress.length * 4;
    doc.text(
      `Ophaaldatum: ${orderData.pickupDate
        ? moment(orderData.pickupDate).format("DD-MM-YYYY")
        : "N.v.t."
      } ${orderData.pickupTime || ""}`,
      rightX,
      rightY
    );


    rightY += 8;
    doc.text("leveringswijze:", rightX, rightY);
    doc.text(orderData.pickupDeliveryType, rightX, rightY + 5);

    /* ================= RENTAL ITEMS TABLE ================= */
    const tableStartY = Math.max(120, rightY + 10);

    const tableColumns = [
      "Product",
      "Aantal",
      "Prijs / dag",
      "Prijs / dag exclusief BTW",
      "Duur",
      "Totaal exclusief BTW",
      "Totaal",
    ];

    const tableRows = [];

    orderData.rentalItems?.forEach((item) => {
      tableRows.push([
        item.productName || item.productId?.name || "N.v.t.",
        item.quantity,
        formatNLCurrency(item.pricePerDay),
        formatNLCurrency(item.pricePerDayExclVAT),
        `${item.rentalDuration} dagen`,
        formatNLCurrency(item.totalPriceExclVAT),
        formatNLCurrency(item.totalPrice),
      ]);
    });

    autoTable(doc, {
      startY: tableStartY,
      head: [tableColumns],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: THEME_COLOR,
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
    });

    /* ================= PRICE SUMMARY ================= */
    let finalY = doc.lastAutoTable.finalY + 12;

    if (finalY > 250) {
      doc.addPage();
      finalY = 30;
    }

    const summaryX = 130;
    doc.setFontSize(10);

    doc.text("Subtotaal:", summaryX, finalY);
    doc.text(formatNLCurrency(orderData.itemsSubtotalExclVAT), 195, finalY, { align: "right" });

 
    finalY += 6;
    doc.text(`Gratis afstand (${orderData.freeDeliveryRadius?.toFixed(2)} km):`, summaryX, finalY);
    doc.text( formatNLCurrency(0), 195, finalY, { align: "right" });

    // finalY += 6;
    // doc.text(`Originele afstand (${orderData.originalDistance?.toFixed(2)} km):`, summaryX, finalY);
    // doc.text((), 195, finalY, { align: "right" });

    finalY += 6;
    doc.text(`Transportkosten  (${orderData.distance?.toFixed(2)} km):`, summaryX, finalY);
    doc.text(formatNLCurrency(orderData.transportCostExclVAT), 195, finalY, { align: "right" });

    if (orderData.serviceFeesBreakdown) {
      const { morningServiceFee, eveningServiceFee, baseServiceFee } =
        orderData.serviceFeesBreakdown;

      if (morningServiceFee > 0) {
        finalY += 6;
        doc.text("Ochtend Servicekosten:", summaryX, finalY);
        doc.text(formatNLCurrency(morningServiceFee / (1 + vatPercentage / 100)), 195, finalY, { align: "right" });
      }

      if (eveningServiceFee > 0) {
        finalY += 6;
        doc.text("Avond Servicekosten:", summaryX, finalY);
        doc.text(formatNLCurrency(eveningServiceFee / (1 + vatPercentage / 100)), 195, finalY, { align: "right" });
      }

      if (baseServiceFee > 0) {
        finalY += 6;
        doc.text("Basis Servicekosten:", summaryX, finalY);
        doc.text(formatNLCurrency(baseServiceFee / (1 + vatPercentage / 100)), 195, finalY, { align: "right" });
      }
    }

    finalY += 6;
    doc.line(summaryX, finalY, 195, finalY);

    finalY += 8;

    /* ================= VAT BREAKDOWN ================= */
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);

    doc.text("Prijs (exclusief BTW):", summaryX, finalY);
    doc.text(formatNLCurrency(orderData.exclVat || 0), 195, finalY, { align: "right" });

    finalY += 6;
    doc.text("BTW bedrag:", summaryX, finalY);
    doc.text(formatNLCurrency(orderData.vatAmount || 0), 195, finalY, { align: "right" });

    finalY += 6;
    doc.line(summaryX, finalY, 195, finalY);

    finalY += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("Totaal (inclusief BTW):", summaryX, finalY);
    doc.text(formatNLCurrency(orderData.total), 195, finalY, { align: "right" });


    /* ================= SAVE ================= */
    doc.save(`Bestelling_${orderData.orderId || orderData._id}.pdf`);
  } catch (error) {
    console.error("PDF genereren mislukt:", error);
    alert("PDF downloaden mislukt");
  }
};
