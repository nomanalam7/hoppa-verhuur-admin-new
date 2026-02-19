import React, { useEffect, useMemo, useState } from "react";
import { Box, Checkbox, Divider, Stack, Typography } from "@mui/material";
import DialogContainer from "../../../components/dialog/dialogContainer";
import DialogHeader from "../../../components/dialog/dialogHeader";
import DialogBody from "../../../components/dialog/dialogBody";
import DialogActionButtons from "../../../components/dialog/dialogAction";
import TextInput from "../../../components/textInput";
import { getAssormentItems } from "../../../api/modules/inventoryApi";

const CATEGORY_CONFIG = [
  { key: "tents", label: "Tents" },
  { key: "partyAccessories", label: "Party Accessories" },
  { key: "tablesAndChairs", label: "Tables & Chairs" },
  { key: "others", label: "Others" },
];

const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const AddItemsDialog = ({ open, onClose, onConfirm , actionLoading  }) => {
  console.log(actionLoading, "actionLoading")
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assortment, setAssortment] = useState({});
  const [expandedCategories, setExpandedCategories] = useState(() => new Set(["tents"]));
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    setIsLoading(true);
    setError(null);
    setSelected({});
    setExpandedCategories(new Set(["tents"]));

    getAssormentItems()
      .then((res) => {
        if (!mounted) return;
        const data = res?.data?.data || {};
        setAssortment(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load items");
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [open]);

  const categories = useMemo(() => {
    return CATEGORY_CONFIG.map((cfg) => {
      const productsRaw = assortment?.[cfg.key];
      const products = Array.isArray(productsRaw) ? productsRaw : [];
      const sorted = [...products].sort((a, b) =>
        String(a?.name || "").localeCompare(String(b?.name || ""), undefined, {
          sensitivity: "base",
        })
      );
      return { ...cfg, products: sorted };
    });
  }, [assortment]);

  const selectedList = useMemo(() => Object.values(selected), [selected]);

  const hasInvalidSelection = useMemo(() => {
    if (selectedList.length === 0) return true;
    return selectedList.some(
      (x) => safeNumber(x.quantity, 0) <= 0 || safeNumber(x.pricePerDay, -1) < 0
    );
  }, [selectedList]);

  const toggleProduct = (category, product) => {
    console.log(category, product, "Category and Product");
    const productId = product?._id;
    if (!productId) return;

    setSelected((prev) => {
      const next = { ...prev };
      if (next[productId]) {
        delete next[productId];
        return next;
      }
      next[productId] = {
        productId: product.productId,
        productObject: product,
        productName: product?.name || "",
        categoryKey: category.key,
        categoryName: category.label,
        quantity: 1,
        pricePerDay: safeNumber(product?.pricePerDay, 0),
      };
      return next;
    });
  };

  const updateSelectedField = (productId, field, value) => {
    setSelected((prev) => {
      const current = prev[productId];
      if (!current) return prev;
      const next = { ...prev };
      next[productId] = { ...current, [field]: value };
      return next;
    });
  };

const handleConfirm = () => {
  const rentalItemsPayload = Object.values(selected).map((x) => ({
    productId: x.productId,
    productName: x.productName,
    quantity: safeNumber(x.quantity, 0),
    pricePerDay: safeNumber(x.pricePerDay, 0),
  }));

  console.log(rentalItemsPayload, "Final Payload");
  onConfirm?.(rentalItemsPayload);
};
  const toggleCategoryExpanded = (key) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <DialogContainer open={open} onClose={onClose} maxWidth="700px">
      <DialogHeader title="Add Rental Items" onClose={onClose} />
      <DialogBody isLoading={isLoading} error={error}>
        <Stack spacing={1.75} sx={{ py: 1 }}>
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.key);
            return (
              <Box key={category.key}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1.25}
                  sx={{ cursor: "pointer", py: 1 }}
                  onClick={() =>
                    toggleCategoryExpanded(category.key)
                  }
                >
                  <Checkbox
                    checked={isExpanded}
                    onChange={() =>
                      toggleCategoryExpanded(category.key)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Typography fontSize={22} fontWeight={700} color="primary.text">
                    {category.label}
                  </Typography>
                </Box>

                {isExpanded && (
                  <Box pl={4.5} pb={1}>
                    {category.products.length === 0 ? (
                      <Typography fontSize={12} color="primary.lightText">
                        No products
                      </Typography>
                    ) : (
                      <Stack spacing={1}>
                        {category.products.map((product) => {
                          const productId = product?._id;
                          const isChecked = Boolean(productId && selected[productId]);
                          const selectedItem = productId ? selected[productId] : null;
                          return (
                            <Box key={productId || product?.name}>
                              <Box display="flex" alignItems="center" gap={1.25}>
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() => toggleProduct(category, product)}
                                />
                                <Typography
                                  fontSize={16}
                                  fontWeight={500}
                                  color="primary.text"
                                >
                                  {product?.name || "-"}
                                </Typography>
                              </Box>

                              {isChecked && selectedItem && (
                                <Box pl={4} pt={1}>
                                  <Box display="flex" gap={2}>
                                    <Box flex={1}>
                                      <Typography
                                        fontSize={12}
                                        fontWeight={600}
                                        color="primary.lightText"
                                        mb={0.5}
                                      >
                                        Qty
                                      </Typography>
                                      <TextInput
                                        type="number"
                                        value={selectedItem.quantity}
                                        onChange={(e) =>
                                          updateSelectedField(
                                            productId,
                                            "quantity",
                                            safeNumber(e.target.value, 0)
                                          )
                                        }
                                      />
                                    </Box>
                                    <Box flex={1}>
                                      <Typography
                                        fontSize={12}
                                        fontWeight={600}
                                        color="primary.lightText"
                                        mb={0.5}
                                      >
                                        Price
                                      </Typography>
                                      <TextInput
                                        type="number"
                                        value={selectedItem.pricePerDay?.toFixed(2)}
                                        onChange={(e) =>
                                          updateSelectedField(
                                            productId,
                                            "pricePerDay",
                                            safeNumber(e.target.value, 0)
                                          )
                                        }
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                      </Stack>
                    )}
                  </Box>
                )}
                <Divider />
              </Box>
            );
          })}
        </Stack>
      </DialogBody>

      <DialogActionButtons
        onCancel={onClose}
        onConfirm={handleConfirm}
        confirmText="Add"
        cancelText="Cancel"
        confirmLoading={actionLoading}
        isConfirmBtnDisable={hasInvalidSelection || isLoading}
      />
    </DialogContainer>
  );
};

export default AddItemsDialog;
