import React, { useMemo, useRef, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { CustomButton } from "../../../components";
import { Plus } from "lucide-react";
import TableWrapper from "../../../components/tableWrapper";
import PaginatedTable from "../../../components/dynamicTable";
import Filter from "../../../components/filter";
import { FILTER_MODES } from "../../../utils/filterConfig";
import AddEditBlogDrawer from "./addEdit";
import { useBlog } from "../../../hooks/features/blog";
import ConfirmationDialog from "../../../components/popups/confirmation";
import deleteIcon from "../../../assets/icons/delete.svg";
import useFilterSliceKey from "../../../zustand/filter_slice_key";
import moment from "moment";

export default function BlogPage() {
  const drawerRef = useRef(null);
  const confirmationDialogRef = useRef(null);
  const {
    handleGetBlogById,
    handleAddBlog,
    handleUpdateBlog,
    handleDeleteBlog,
    blogData,
    loading,
  } = useBlog();

  const { filters } = useFilterSliceKey();
  const blogFilters = filters[FILTER_MODES.BLOG] || {};

  // Handle Add New Blog - Opens drawer for new blog
  const handleAddNewBlog = () => {
    drawerRef.current?.openDrawer(null, {
      onSave: handleAddBlog,
      loading,
    });
  };

  // Handle Edit Blog - Fetch data and open drawer
  const handleEditBlog = async (row) => {
    const blogId = row._id || row.id || row;
    try {
      const response = await handleGetBlogById(blogId);
      if (response.success && response.data) {
        drawerRef.current?.openDrawer(response.data, {
          onSave: (payload) => handleUpdateBlog(blogId, payload),
          loading,
        });
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    }
  };

  const tableHeader = [
    { id: "title", label: "Titel" },
    { id: "slug", label: "Slug" },
    { id: "keywords", label: "Keywords" },
    { id: "createdAt", label: "Gemaakt op" },
    { id: "actions", label: "Acties" },
  ];

  // Client-side filtering and formatting
  const filteredAndFormattedData = useMemo(() => {
    if (!blogData || !Array.isArray(blogData)) return [];

    let filtered = blogData;

    // Apply search filter
    if (blogFilters.search) {
      const searchTerm = blogFilters.search.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          (blog.title || "").toLowerCase().includes(searchTerm) ||
          (blog.slug || "").toLowerCase().includes(searchTerm) ||
          (blog.keywords || "").toLowerCase().includes(searchTerm)
      );
    }

    // Apply date filter
    if (blogFilters.createdAt) {
      const filterDate = moment(blogFilters.createdAt).format("DD-MM-YYYY");
      filtered = filtered.filter((blog) => {
        const blogDate = moment(blog.createdAt || blog.created_at).format(
          "DD-MM-YYYY"
        );
        return blogDate === filterDate;
      });
    }

    // Format data for table
    return filtered.map((blog) => ({
      _id: blog._id,
      id: blog._id,
      title: blog.title || "",
      slug: blog.slug || "",
      keywords: blog.keywords || "",
      createdAt: blog.createdAt || blog.created_at,
      image: blog.image || "",
      description: blog.description || "",
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
    }));
  }, [blogData, blogFilters]);

  const DISPLAY_ROWS = ["title", "slug", "keywords", "createdAt", "actions"];

  const handleDeleteItem = async (row) => {
    const blogId = row._id || row.id;
    confirmationDialogRef.current.open({
      title: "Weet je zeker dat je deze blog wilt verwijderen?",
      description: "Deze blog zal permanent worden verwijderd.",
      onConfirm: () => handleDeleteBlog(blogId),
      icon: deleteIcon,
    });
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Blog
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          width={{ xs: "100%", sm: "auto" }}
        >
          <CustomButton
            variant="mainButton"
            btnLabel="Nieuwe blog toevoegen"
            handlePressBtn={handleAddNewBlog}
            startIcon={<Plus />}
            width={{ xs: "100%", sm: "auto" }}
          />
        </Stack>
      </Box>

      <TableWrapper title="Blogs">
        <Box mb={3}>
          <Filter mode={FILTER_MODES.BLOG} />
        </Box>

        <PaginatedTable
          tableData={filteredAndFormattedData}
          displayRows={DISPLAY_ROWS}
          tableHeader={tableHeader}
          showViewDetail={true}
          showDelete={true}
          onViewDetail={handleEditBlog}
          onDelete={handleDeleteItem}
          isLoading={loading}
          showCheckbox={false}
        />
      </TableWrapper>

      {/* Add/Edit Drawer */}
      <AddEditBlogDrawer ref={drawerRef} />
      <ConfirmationDialog ref={confirmationDialogRef} />
    </>
  );
}
