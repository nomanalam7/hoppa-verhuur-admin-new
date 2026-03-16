import React, {
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
    useCallback,
} from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    CircularProgress,
} from "@mui/material";
import DynamicDrawer from "../../../../components/customDrawer";
import TextInput from "../../../../components/textInput";
import CustomInputLabel from "../../../../components/customInputLabel";
import DraftEditor from "../../../../components/draftEditor";
import { CustomButton } from "../../../../components";
import { Upload, X } from "lucide-react";
import { uploadMedia } from "../../../../helper";

const getInitialFormData = () => ({
    slug: "",
    image: "",
    title: "",
    description: "",
    keywords: "",
    metaTitle: "",
    metaDescription: "",
});

const AddEditBlogDrawer = forwardRef((props, ref) => {
    const drawerRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(getInitialFormData());
    const [uploadingImage, setUploadingImage] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [onSaveHandler, setOnSaveHandler] = useState(null);

    useImperativeHandle(ref, () => ({
        openDrawer: (data = null, options = {}) => {
            if (data) {
                setIsEditMode(true);
                setFormData({
                    slug: data.slug || "",
                    image: data.image || "",
                    title: data.title || "",
                    description: data.description || "",
                    keywords: data.keywords || "",
                    metaTitle: data.metaTitle || "",
                    metaDescription: data.metaDescription || "",
                });
            } else {
                setIsEditMode(false);
                setFormData(getInitialFormData());
            }

            setOnSaveHandler(() => options.onSave || null);
            setIsSubmitting(!!options.loading);
            setErrors({});
            drawerRef.current?.openDrawer();
        },

        closeDrawer: () => drawerRef.current?.closeDrawer(),
    }));

    const handleInputChange = useCallback(
        (field, value) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
            // Clear error for this field
            if (errors[field]) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        },
        [errors]
    );

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({
                ...prev,
                image: "Please select a valid image file",
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                image: "Image size should be less than 5MB",
            }));
            return;
        }

        setUploadingImage(true);
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.image;
            return newErrors;
        });

        try {
            const imageUrl = await uploadMedia(file);
            handleInputChange("image", imageUrl);
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                image: "Failed to upload image. Please try again.",
            }));
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        handleInputChange("image", "");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.slug?.trim()) {
            newErrors.slug = "Slug is required";
        }

        if (!formData.title?.trim()) {
            newErrors.title = "Title is required";
        }

        // Strip HTML tags for validation
        const descriptionText = formData.description?.replace(/<[^>]*>/g, "").trim() || "";
        if (!descriptionText) {
            newErrors.description = "Description is required";
        }
        if (!formData.keywords?.trim()) {
            newErrors.keywords = "Keywords are required";
        }
        if (!formData.metaTitle?.trim()) {
            newErrors.metaTitle = "Meta Title is required";
        }
        if (!formData.metaDescription?.trim()) {
            newErrors.metaDescription = "Meta Description is required";
        }
        if (!formData.image?.trim()) {
            newErrors.image = "Image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        if (!onSaveHandler) {
            console.error("No save handler provided");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                slug: formData.slug.trim(),
                image: formData.image || "",
                title: formData.title.trim(),
                description: formData.description.trim(),
                keywords: formData.keywords.trim() || "",
                metaTitle: formData.metaTitle.trim() || "",
                metaDescription: formData.metaDescription.trim() || "",
            };

            const response = await onSaveHandler(payload);
            if (response?.success) {
                handleClose();
            }
        } catch (error) {
            console.error("Failed to save blog:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        drawerRef.current?.closeDrawer();
        setFormData(getInitialFormData());
        setErrors({});
        setIsEditMode(false);
    };

    return (
        <DynamicDrawer
            ref={drawerRef}
            title={isEditMode ? "Blog Bewerken" : "Nieuwe Blog Toevoegen"}
        >
            <Box sx={{ overflowY: "auto", pr: 2 }}>
                <Stack spacing={3}>
                    {/* Slug */}
                    <Box>
                        <TextInput
                            showLabel="Slug"
                            placeholder="blog-post-slug"
                            value={formData.slug}
                            onChange={(e) => handleInputChange("slug", e.target.value)}
                            error={!!errors.slug}
                            helperText={errors.slug}
                            disabled={isSubmitting}
                        />
                    </Box>

                    {/* Title */}
                    <Box>
                        <TextInput
                            showLabel="Titel"
                            placeholder="Blog titel"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            error={!!errors.title}
                            helperText={errors.title}
                            disabled={isSubmitting}
                        />
                    </Box>

                    {/* Description */}
                    <Box>
                        <CustomInputLabel label="Beschrijving" />
                        <DraftEditor
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Blog beschrijving"
                            error={!!errors.description}
                            helperText={errors.description}
                            name="description"
                        />
                    </Box>

                    {/* Image Upload */}
                    <Box>
                        <Typography
                            fontSize="14px"
                            fontWeight={600}
                            mb={1}
                            color="#030229"
                        >
                            Afbeelding
                        </Typography>
                        {formData.image ? (
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    maxWidth: "300px",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src={formData.image}
                                    alt="Blog preview"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        display: "block",
                                    }}
                                />
                                <IconButton
                                    onClick={handleRemoveImage}
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "rgba(0,0,0,0.7)",
                                        },
                                    }}
                                >
                                    <X size={20} />
                                </IconButton>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    border: "2px dashed #ccc",
                                    borderRadius: "8px",
                                    p: 3,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    "&:hover": {
                                        borderColor: "#1976d2",
                                        backgroundColor: "#f5f5f5",
                                    },
                                }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                    id="image-upload"
                                    disabled={isSubmitting || uploadingImage}
                                />
                                <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {uploadingImage ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <Upload size={20} color="#666" />
                                        )}
                                        <Typography fontSize="14px" color="#666">
                                            {uploadingImage
                                                ? "Uploading..."
                                                : "Klik om afbeelding te uploaden"}
                                        </Typography>
                                    </Stack>
                                </label>
                            </Box>
                        )}
                        {errors.image && (
                            <Typography fontSize="10px" color="#d32f2f" mt={0.5} ml={1.5}>
                                {errors.image}
                            </Typography>
                        )}
                    </Box>

                    {/* Keywords */}
                    <Box>
                        <TextInput
                            showLabel="Keywords"
                            placeholder="keyword1, keyword2, keyword3"
                            value={formData.keywords}
                            onChange={(e) => handleInputChange("keywords", e.target.value)}
                            error={!!errors.keywords}
                            helperText={errors.keywords}
                            disabled={isSubmitting}
                        />
                    </Box>

                    {/* Meta Title */}
                    <Box>
                        <TextInput
                            showLabel="Meta Titel"
                            placeholder="SEO meta titel"
                            value={formData.metaTitle}
                            onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                            error={!!errors.metaTitle}
                            helperText={errors.metaTitle}
                            disabled={isSubmitting}
                        />
                    </Box>

                    {/* Meta Description */}
                    <Box>
                        <TextInput
                            showLabel="Meta Beschrijving"
                            placeholder="SEO meta beschrijving"
                            value={formData.metaDescription}
                            onChange={(e) =>
                                handleInputChange("metaDescription", e.target.value)
                            }
                            error={!!errors.metaDescription}
                            helperText={errors.metaDescription}
                            disabled={isSubmitting}
                            multiline
                            rows={3}
                        />
                    </Box>

                    {/* Submit Button */}
                    <Box sx={{ pt: 2 }}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <CustomButton
                                btnLabel="Annuleren"
                                handlePressBtn={handleClose}
                                variant="grayButton"
                                disabled={isSubmitting}
                            />
                            <CustomButton
                                btnLabel={isEditMode ? "Bijwerken" : "Toevoegen"}
                                handlePressBtn={handleSubmit}
                                variant="mainButton"
                                loading={isSubmitting}
                            />
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </DynamicDrawer>
    );
});

AddEditBlogDrawer.displayName = "AddEditBlogDrawer";

export default AddEditBlogDrawer;
