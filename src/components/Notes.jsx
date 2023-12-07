// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { Container, Grid, Paper,  IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import { v4 as uuidv4 } from "uuid";
import { openDB } from "idb";

import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export const Notes = () => {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    // Load available notes titles when the component mounts
    loadNotesTitles();
  }, []);

  const loadNotesTitles = async () => {
    // Load notes from IndexedDB
    const db = await openDB("DocumentsDB", 1);
    const transaction = db.transaction("documents", "readonly");
    const store = transaction.objectStore("documents");
    const notesData = await store.getAll();

    setNotes(notesData);
  };
  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1.5rem",
    maxWidth: "120px",
    height: "160px", // Adjust the height as needed
    textAlign: "center",
  };

  const handleDeleteNote = async (noteId) => {
    // Delete the note from IndexedDB
    const db = await openDB("DocumentsDB", 1);
    const transaction = db.transaction("documents", "readwrite");
    const store = transaction.objectStore("documents");
    await store.delete(noteId);

    // Update the frontend by removing the deleted note from the state
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  return (
    <Container
      maxWidth="md"
      style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
    >
        <Grid item xs={6} sm={4} md={3} lg={3}>
          <Link to={`/text-editor/${uuidv4()}`}>
            <Paper style={cardStyle}>
              <AddIcon fontSize="large" />
              <Typography variant="subtitle1" style={{ marginTop: "0.5rem" }}>
                Add New Item
              </Typography>
            </Paper>
          </Link>
        </Grid>
      <Grid container justifyContent="center" spacing={2}>
        {/* Plus Icon Card */}
        

        {/* Other Cards */}
        {notes.map((note) => (
          <Grid key={note.id} item xs={6} sm={4} md={4} lg={4}>
            <Card className="mt-6 w-96">
            <Link to={`/text-editor/${note.id}`}>
              <CardBody>
              <DescriptionIcon  fontSize="large" />
                <Typography variant="h5" color="blue-gray" className="my-2">
                {note.name}
                </Typography>
              </CardBody>
              </Link>
              <CardFooter className="pt-0">
                <Button color="red" onClick={() => handleDeleteNote(note.id)}>Delete</Button>
              </CardFooter>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
