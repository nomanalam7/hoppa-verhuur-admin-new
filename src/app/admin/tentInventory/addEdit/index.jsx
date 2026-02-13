import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Stack,
  Typography,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { nl } from "date-fns/locale";
import DynamicDrawer from "../../../../components/customDrawer";
import TextInput from "../../../../components/textInput";
import CustomSelect from "../../../../components/customSelect";
import CustomSwitch from "../../../../components/switch";
import CustomInputLabel from "../../../../components/customInputLabel";
import GooglePlacesInput from "../../../../components/googlePlaceInput";
import { CustomButton } from "../../../../components";
import { Upload, X } from "lucide-react";
import {
  uploadMedia,
  transformApiResponseToFormData,
  transformFormDataToApiPayload,
  formatNLCurrency,
} from "../../../../helper";
import { validateInventoryForm } from "../../../../utils/validations";
import GlobalStyle from "../../../../style/style";
import moment from "moment";
import useVatStore from "../../../../zustand/useVatStore";

const getInitialFormData = () => ({
  itemName: "",
  category: "",
  quantityAvailable: "",
  pricePerDay: "",
  description: "",
  warehouseLocation: "",
  warehouseLat: "",
  warehouseLng: "",
  image: [],
  serviceFeeEnabled: true,
  baseService: "",
  isServiceFeeAlwaysIncluded: false,
  eveningServiceEnabled: false,
  eveningServiceFee: "",
  eveningTimeWindow: null,
  morningServiceEnabled: false,
  morningServiceFee: "",
  morningTimeWindow: null,
  availableForRental: true,
});

const AddEditTentInventoryDrawer = forwardRef((props, ref) => {
  const drawerRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onSaveHandler, setOnSaveHandler] = useState(null);
  const [categories, setCategories] = useState([]);
  const { getVatPercentage } = useVatStore();

  // Helper function to calculate price with VAT
  const calculatePriceWithVat = useCallback((price) => {
    if (!price || price === "") return null;
  
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return null;
  
    const vatPercentage = getVatPercentage(); // 21
  
    return priceNum * (1 + vatPercentage / 100);
  }, [getVatPercentage]);
  

  useImperativeHandle(ref, () => ({
    openDrawer: (data = null, options = {}) => {
      if (data) {
        setIsEditMode(true);
        const transformedData = transformApiResponseToFormData(data);
        if (transformedData) {
          setFormData(transformedData);
        }
      } else {
        setIsEditMode(false);
        setFormData(getInitialFormData());
      }

      setOnSaveHandler(() => options.onSave || null);

      if (options.categories) {
        setCategories(options.categories);
      }
      setIsSubmitting(!!options.loading);

      setErrors({});
      drawerRef.current?.openDrawer();
    },

    closeDrawer: () => drawerRef.current?.closeDrawer(),
  }));

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const handleImageUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = files.map((file) => uploadMedia(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  }, []);

  const handleRemoveImage = useCallback((indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, index) => index !== indexToRemove),
    }));
  }, []);

  const handleSave = useCallback(async () => {
    console.trace("🔥 HANDLE SAVE TRACE");
    const validationErrors = validateInventoryForm(formData);
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );
    if (hasErrors) return;

    if (!onSaveHandler) {
      console.error("No save handler provided");
      return;
    }

    const payload = transformFormDataToApiPayload(formData);
    const response = await onSaveHandler(payload);

    if (response?.success) {
      drawerRef.current?.closeDrawer();
      setFormData(getInitialFormData());
      setIsEditMode(false);
    }
  }, [formData, onSaveHandler]);

  const handleCancel = useCallback(() => {
    drawerRef.current?.closeDrawer();
    setFormData(getInitialFormData());
    setErrors({});
    setIsEditMode(false);
  }, []);

  const categoryOptions = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));
  }, [categories]);

  return (
    <DynamicDrawer
      ref={drawerRef}
      title={isEditMode ? "Item Bewerken" : "Nieuw Item Toevoegen"}
    >
      <Box sx={{ maxHeight: "calc(95vh - 200px)", overflowY: "auto", pr: 2 }}>
        <Stack spacing={3}>
          {/* Item Name */}
          <Box>
            <TextInput
              showLabel="Itemnaam"
              placeholder="Stoel"
              value={formData.itemName}
              onChange={(e) => handleInputChange("itemName", e.target.value)}
              error={!!errors.itemName}
              helperText={errors.itemName}
              disabled={isSubmitting}
            />
          </Box>

          {/* Category */}
          <Box>
            <CustomInputLabel label="Categorie" />
            <CustomSelect
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="Selecteer Categorie"
              sx={GlobalStyle.datePickerStyle}
              fullWidth={true}
              disabled={isSubmitting}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </CustomSelect>
            {errors.category && (
              <Typography fontSize="10px" color="#d32f2f" mt={0.5} ml={1.5}>
                {errors.category}
              </Typography>
            )}
          </Box>

          {/* Quantity Available */}
          <Box>
            <TextInput
              showLabel="Beschikbare Hoeveelheid"
              type="number"
              placeholder="10"
              value={formData.quantityAvailable}
              onChange={(e) =>
                handleInputChange("quantityAvailable", Math.max(0, parseInt(e.target.value) || 0))
              }
              error={!!errors.quantityAvailable}
              helperText={errors.quantityAvailable}
              disabled={isSubmitting}
            />

          </Box>

          {/* Price per Day */}
          <Box>
            <TextInput
              showLabel="Prijs per Dag"
              type="number"
              placeholder="18.75"
              value={formData.pricePerDay}
              onChange={(e) => handleInputChange("pricePerDay", Math.max(0, parseFloat(e.target.value) || 0))}
              error={!!errors.pricePerDay}
              helperText={errors.pricePerDay}
              disabled={isSubmitting}
            />
            {formData.pricePerDay && calculatePriceWithVat(formData.pricePerDay) && (
              <Typography fontSize="12px" color="#6B7280" mt={0.5} ml={1.5}>
                Inclusief BTW: {formatNLCurrency(calculatePriceWithVat(formData.pricePerDay))}
              </Typography>
            )}
          </Box>

          {/* Description - Optional */}
          <Box>
            <TextInput
              showLabel="Beschrijving"
              multiline
              rows={4}
              placeholder="Optionele Beschrijving"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isSubmitting}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Box>

          {/* Warehouse Location - Google Places */}
          <Box>
            <CustomInputLabel label="Magazijn Locatie" />
            <GooglePlacesInput
              name="warehouseLocation"
              value={formData.warehouseLocation}
              placeholder="Locatie invoeren"
              onChange={(e) =>
                handleInputChange("warehouseLocation", e.target.value)
              }
              onPlaceSelected={(place) => {
                handleInputChange("warehouseLocation", place.address);
                handleInputChange("warehouseLat", place.latitude);
                handleInputChange("warehouseLng", place.longitude);
              }}
              country="nl"
              disabled={isSubmitting}
            />
            {errors.warehouseLocation && (
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "#d32f2f",
                  mt: 0.5,
                  ml: 1.5,
                }}
              >
                {errors.warehouseLocation}
              </Typography>
            )}
          </Box>

          {/* Image Upload */}
          <Box>
            <CustomInputLabel label="Afbeelding Uploaden" />
            <Box
              sx={{
                border: "2px dashed #D1D5DB",
                borderRadius: "10px",
                p: 3,
                textAlign: "center",
                cursor: uploadingImages || isSubmitting ? "wait" : "pointer",
                backgroundColor: "#F9FAFB",
                position: "relative",
                "&:hover": {
                  backgroundColor:
                    uploadingImages || isSubmitting ? "#F9FAFB" : "#F3F4F6",
                },
              }}
              onClick={() =>
                !uploadingImages &&
                !isSubmitting &&
                document.getElementById("image-upload").click()
              }
            >
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleImageUpload}
                disabled={uploadingImages || isSubmitting}
              />
              {uploadingImages ? (
                <CircularProgress size={32} sx={{ color: "#9CA3AF" }} />
              ) : (
                <Upload size={32} color="#9CA3AF" style={{ marginBottom: 8 }} />
              )}
              <Typography
                sx={{ color: "#6B7280", fontSize: "14px", fontWeight: 500 }}
              >
                {uploadingImages
                  ? "Afbeeldingen Uploaden..."
                  : "Klik om Afbeeldingen te Uploaden"}
              </Typography>
            </Box>

            {errors.image && (
              <Typography fontSize="10px" color="#d32f2f" mt={0.5} ml={1.5}>
                {errors.image}
              </Typography>
            )}

            {/* Uploaded Images Preview */}
            {formData.image && formData.image.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {formData.image.map((imageUrl, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`Uploaded ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        disabled={isSubmitting}
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          width: 24,
                          height: 24,
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                          },
                        }}
                      >
                        <X size={14} />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          {/* Service Fee Settings */}
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box>
                <Typography fontSize="16px" fontWeight={600} color="#030229">
                  Servicekosten Instellingen
                </Typography>
                <Typography fontSize="10px" color="#6B7280" mt={0.5}>
                  Configureer basis servicekosten voor opzet, afbraak en
                  avondservicekosten.
                </Typography>
              </Box>
              <CustomSwitch
                checked={formData.serviceFeeEnabled}
                onChange={(e) =>
                  handleInputChange("serviceFeeEnabled", e.target.checked)
                }
                disabled={isSubmitting}
              />
            </Box>

            {formData.serviceFeeEnabled && (
              <>
                {/* Base Service */}
                <Box sx={{ mb: 2 }}>
                  <TextInput
                    showLabel="Basis Service (opzet + afbraak)"
                    type="number"
                    placeholder="500"
                    value={formData.baseService}
                    onChange={(e) =>
                      handleInputChange("baseService", e.target.value)
                    }
                    error={!!errors.baseService}
                    helperText={errors.baseService}
                    disabled={isSubmitting}
                  />
                  {formData.baseService && calculatePriceWithVat(formData.baseService) && (
                    <Typography fontSize="12px" color="#6B7280" mt={0.5} ml={1.5}>
                      Inclusief BTW: {formatNLCurrency(calculatePriceWithVat(formData.baseService))}
                    </Typography>
                  )}
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <CustomSwitch
                      checked={formData.isServiceFeeAlwaysIncluded}
                      onChange={(e) =>
                        handleInputChange(
                          "isServiceFeeAlwaysIncluded",
                          e.target.checked
                        )
                      }
                      disabled={isSubmitting}
                    />
                    <Typography fontSize="10px" color="#6B7280">
                      Wanneer ingeschakeld, wordt deze servicekosten altijd
                      meegenomen in de klantprijs.
                    </Typography>
                  </Box>
                </Box>

                {/* Evening Service Fee Override */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography
                      fontSize="14px"
                      fontWeight={500}
                      color="#030229"
                    >
                      Avondservicekosten (Optionele Overschrijving)
                    </Typography>
                    <CustomSwitch
                      checked={formData.eveningServiceEnabled}
                      onChange={(e) =>
                        handleInputChange(
                          "eveningServiceEnabled",
                          e.target.checked
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </Box>
                  <Typography fontSize="10px" color="#6B7280" mb={1}>
                    Verschillende Avondservicekosten Inschakelen
                  </Typography>

                  {formData.eveningServiceEnabled && (
                    <>
                      <Box mb={2}>
                        <TextInput
                          showLabel="Avondservicekosten"
                          type="number"
                          placeholder="700"
                          value={formData.eveningServiceFee}
                          onChange={(e) =>
                            handleInputChange(
                              "eveningServiceFee",
                              e.target.value
                            )
                          }
                          error={!!errors.eveningServiceFee}
                          helperText={errors.eveningServiceFee}
                          disabled={isSubmitting}
                        />
                        {formData.eveningServiceFee && calculatePriceWithVat(formData.eveningServiceFee) && (
                          <Typography fontSize="12px" color="#6B7280" mt={0.5} ml={1.5}>
                            Inclusief BTW: {formatNLCurrency(calculatePriceWithVat(formData.eveningServiceFee))}
                          </Typography>
                        )}
                        <Typography fontSize="10px" color="#6B7280" mt={0.5}>
                          Deze avondkosten overschrijven de normale
                          servicekosten als de ophaaltijd van de klant binnen
                          het avondvenster valt.
                        </Typography>
                      </Box>

                      <Box mb={2}>
                        <CustomInputLabel label="Avondtijdvenster" />
                        <LocalizationProvider
                          dateAdapter={AdapterDateFns}
                          adapterLocale={nl}
                        >
                          <TimePicker
                            value={formData.eveningTimeWindow}
                            onChange={(newValue) =>
                              handleInputChange("eveningTimeWindow", newValue)
                            }
                            format="HH:mm"
                            ampm={false}
                            sx={GlobalStyle.datePickerStyle}
                            disabled={isSubmitting}
                            slotProps={{
                              textField: {
                                size: "small",
                                error: !!errors.eveningTimeWindow,
                                helperText: errors.eveningTimeWindow,
                              },
                            }}
                          />
                        </LocalizationProvider>
                        <Typography fontSize="10px" color="#6B7280" mt={0.5}>
                          Avondservicekosten worden toegepast van {formData.eveningTimeWindow ? moment(formData.eveningTimeWindow).format("HH:mm") : "--:--"} tot 23:59 uur.
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>

                {/* Morning Service Fee Override */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography
                      fontSize="14px"
                      fontWeight={500}
                      color="#030229"
                    >
                      Ochtendservicekosten (Optionele Overschrijving)
                    </Typography>
                    <CustomSwitch
                      checked={formData.morningServiceEnabled}
                      onChange={(e) =>
                        handleInputChange(
                          "morningServiceEnabled",
                          e.target.checked
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </Box>
                  <Typography fontSize="10px" color="#6B7280" mb={1}>
                    Verschillende Ochtendservicekosten Inschakelen
                  </Typography>

                  {formData.morningServiceEnabled && (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <TextInput
                          showLabel="Ochtendservicekosten"
                          type="number"
                          placeholder="600"
                          value={formData.morningServiceFee}
                          onChange={(e) =>
                            handleInputChange(
                              "morningServiceFee",
                              e.target.value
                            )
                          }
                          error={!!errors.morningServiceFee}
                          helperText={errors.morningServiceFee}
                          disabled={isSubmitting}
                        />
                        {formData.morningServiceFee && calculatePriceWithVat(formData.morningServiceFee) && (
                          <Typography fontSize="12px" color="#6B7280" mt={0.5} ml={1.5}>
                            Inclusief BTW: {formatNLCurrency(calculatePriceWithVat(formData.morningServiceFee))}
                          </Typography>
                        )}
                        <Typography fontSize="10px" color="#6B7280" mt={0.5}>
                          Deze ochtendkosten overschrijven de normale
                          servicekosten als de ophaaltijd van de klant binnen
                          het ochtendvenster valt.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <CustomInputLabel label="Ochtendtijdvenster" />
                        <LocalizationProvider
                          dateAdapter={AdapterDateFns}
                          adapterLocale={nl}
                        >
                          <TimePicker
                            value={formData.morningTimeWindow}
                            onChange={(newValue) =>
                              handleInputChange("morningTimeWindow", newValue)
                            }
                            format="HH:mm"
                            ampm={false}
                            sx={GlobalStyle.datePickerStyle}
                            disabled={isSubmitting}
                            slotProps={{
                              textField: {
                                size: "small",
                                error: !!errors.morningTimeWindow,
                                helperText: errors.morningTimeWindow,
                              },
                            }}
                          />
                        </LocalizationProvider>
                        <Typography fontSize="10px" color="#6B7280" mt={0.5}>
                          Ochtendservicekosten worden toegepast van {formData.morningTimeWindow ? moment(formData.morningTimeWindow).format("HH:mm") : "--:--"} tot 08:00 uur.
                        </Typography>


                      </Box>
                    </>
                  )}
                </Box>
              </>
            )}
          </Box>

          {/* Available For Rental */}
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontSize="14px" fontWeight={500} color="#030229">
                Beschikbaar voor Verhuur
              </Typography>
              <CustomSwitch
                checked={formData.availableForRental}
                onChange={(e) =>
                  handleInputChange("availableForRental", e.target.checked)
                }
                disabled={isSubmitting}
              />
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Action Buttons */}
      <Box
        display="flex"
        justifyContent="flex-end"
        gap={2}
        mt={4}
        pt={3}
        borderTop="1px solid #E5E7EB"
      >
        <CustomButton
          variant="customOutlined"
          btnLabel="Annuleren"
          handlePressBtn={handleCancel}
          width="120px"
          disabled={isSubmitting}
          loading={isSubmitting}
        />
        <CustomButton
          variant="gradient"
          btnLabel={isSubmitting ? "Opslaan..." : "Opslaan"}
          handlePressBtn={handleSave}
          width="120px"
          disabled={isSubmitting}
          loading={isSubmitting}
        />
      </Box>
    </DynamicDrawer>
  );
});

AddEditTentInventoryDrawer.displayName = "AddEditTentInventoryDrawer";

export default AddEditTentInventoryDrawer;
