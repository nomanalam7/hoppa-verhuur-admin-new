import React, { useState } from "react";
import { Box, Typography, TextField, Paper, Stack } from "@mui/material";
import { CustomButton, TextInput } from "../../../components"; // ✓ Import added
import moment from "moment";

const Notes = ({ adminNotes, addAdminNotes }) => {
    const [noteText, setNoteText] = useState("");

    const handleAddNote = () => {
        if (noteText.trim()) {
            addAdminNotes(noteText); // ✓ Correct - OrderDetailsPage handle karega
            setNoteText("");
        }
    };

    return (
        <Box mt={3}>
            {/* Header */}
            <Typography variant="h6" fontWeight={600} mb={2}>
                Beheerder notities
            </Typography>

            {/* Add Note */}
            <Box mb={3}>
                <TextInput
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Notitie toevoegen..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    size="small"
                    inputBgColor={"#ffff"}
                />

                <Box mt={2}>
                    <CustomButton
                        btnLabel="Notitie toevoegen"
                        handlePressBtn={handleAddNote}
                        variant="mainButton"
                        disabled={!noteText.trim()}
                    />
                </Box>
            </Box>


            {/* Notes List */}
            {adminNotes && adminNotes.length > 0 ? (
                <Stack spacing={2}>
                    {adminNotes.reverse().map((note, index) => (
                        <Paper
                            key={index}
                            elevation={0}
                            boxShadow={"none"}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#fff",
                            }}
                        >
                            <Typography variant="body1" mb={1} fontSize={12} fontWeight={500}>
                                {note.note || "---"}
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                                {moment(note.createdAt).format("DD-MM-YYYY HH:mm")}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    Nog geen notities toegevoegd
                </Typography>
            )}
        </Box>
    );
};

export default Notes;