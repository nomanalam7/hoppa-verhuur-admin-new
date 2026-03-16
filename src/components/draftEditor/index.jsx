import { Box, Dialog, TextField, Button, Stack } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useCallback, useState } from "react";
import { uploadMedia } from "../../helper";

const DraftEditor = ({
  value = "",
  onChange,
  onBlur,
  placeholder = "Enter text...",
  error = false,
  helperText = "",
  name,
}) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Image.configure({ inline: true, allowBase64: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.({ target: { name, value: editor.getHTML() } });
    },
    onBlur: () => {
      onBlur?.({ target: { name } });
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        "data-placeholder": placeholder,
      },
    },
  });

  // Update editor content when value prop changes
  if (editor && value !== editor.getHTML()) {
    editor.commands.setContent(value, false);
  }

  // Image upload handler
  const handleImageUpload = useCallback(() => {
    if (!editor) return;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Selecteer een geldige afbeelding.");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("Afbeelding mag maximaal 5MB zijn.");
        return;
      }

      try {
        const imageUrl = await uploadMedia(file);
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Afbeelding uploaden mislukt.");
      }
    };
  }, [editor]);

  const handleLinkClick = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setLinkDialogOpen(true);
  }, [editor]);

  const handleLinkSubmit = () => {
    if (!editor) return;

    if (linkUrl.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
  };

  const ToolbarButton = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: "6px 10px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: isActive ? "#D1D5DB" : "transparent",
        color: "#6B7280",
        cursor: "pointer",
        minWidth: "32px",
        minHeight: "32px",
        fontSize: "14px",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.target.style.backgroundColor = "#E5E7EB";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.target.style.backgroundColor = "transparent";
      }}
    >
      {children}
    </button>
  );

  if (!editor) return null;

  return (
    <Box
      sx={{
        backgroundColor: "#EFEFEF",
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          border: error ? "1px solid #DC2626" : "none",
          borderRadius: "14px",
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            padding: "10px",
            borderBottom: "1px solid #E5E7EB",
            backgroundColor: "transparent",
            alignItems: "center",
          }}
        >
          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline"
          >
            <u>U</u>
          </ToolbarButton>

          <Box
            sx={{
              width: "1px",
              height: "24px",
              backgroundColor: "#E5E7EB",
              mx: 1,
            }}
          />

          {/* Headings */}
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>

          <Box
            sx={{
              width: "1px",
              height: "24px",
              backgroundColor: "#E5E7EB",
              mx: 1,
            }}
          />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            •
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            1.
          </ToolbarButton>

          <Box
            sx={{
              width: "1px",
              height: "24px",
              backgroundColor: "#E5E7EB",
              mx: 1,
            }}
          />

          {/* Link and Image */}
          <ToolbarButton
            onClick={handleLinkClick}
            isActive={editor.isActive("link")}
            title="Link"
          >
            🔗
          </ToolbarButton>
          <ToolbarButton onClick={handleImageUpload} title="Insert Image">
            🖼️
          </ToolbarButton>
        </Box>

        {/* Editor Content */}
        <Box
          sx={{
            "& .ProseMirror": {
              minHeight: "200px",
              maxHeight: "400px",
              overflowY: "auto",
              padding: "12px",
              fontSize: "14px",
              fontFamily: "Helvetica",
              outline: "none",
              "& p.is-editor-empty:first-child::before": {
                content: `"${placeholder}"`,
                float: "left",
                color: "#9CA3AF",
                pointerEvents: "none",
                height: 0,
              },
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                margin: "8px 0",
              },
              "& a": {
                color: "#3B82F6",
                textDecoration: "underline",
              },
              "& ul, & ol": {
                paddingLeft: "24px",
                margin: "8px 0",
              },
              "& h1": {
                fontSize: "24px",
                fontWeight: "bold",
                margin: "12px 0",
              },
              "& h2": {
                fontSize: "20px",
                fontWeight: "bold",
                margin: "10px 0",
              },
              "& h3": { fontSize: "18px", fontWeight: "bold", margin: "8px 0" },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>

      {/* Link Dialog */}
      <Dialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleLinkSubmit();
              }
            }}
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => setLinkDialogOpen(false)}>
              Annuleren
            </Button>
            <Button variant="contained" onClick={handleLinkSubmit}>
              Toevoegen
            </Button>
          </Stack>
        </Box>
      </Dialog>

      {helperText && (
        <Box
          sx={{
            color: error ? "#DC2626" : "#9CA3AF",
            fontSize: "12px",
            mt: 1,
            px: 1,
          }}
        >
          {helperText}
        </Box>
      )}
    </Box>
  );
};

export default DraftEditor;
