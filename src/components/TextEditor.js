import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ButtonGroup, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import Icon from "@mui/material/Icon";
import { openDB } from "idb";
import { useParams } from "react-router-dom";

export const TextEditor = () => {
  const { noteid } = useParams();
  const [content, setContent] = useState("");
  const [currentNote, setCurrentNote] = useState(null);
  const [editedNoteTitle, setEditedNoteTitle] = useState("Untitled Note");

  useEffect(() => {
    // Load existing notes when the component mounts
    loadNotes();
  }, [noteid]);

  const loadNotes = async () => {
    if (!noteid) return;

    // Load note from IndexedDB based on the provided noteid
    const db = await openDB("DocumentsDB", 1);
    const transaction = db.transaction("documents", "readonly");
    const store = transaction.objectStore("documents");
    const note = await store.get(noteid);

    if (note) {
      setCurrentNote(note);
      setContent(note.content);
      setEditedNoteTitle(note.name);
    }
  };

  const handleSave = async () => {
    if (currentNote) {
      // Update the content and title of the current note
      const updatedNote = { ...currentNote, content, name: editedNoteTitle };
      const db = await openDB("DocumentsDB", 1);
      await db.put("documents", updatedNote);

      // Update the current note
      setCurrentNote(updatedNote);
    } else {
      // If there's no current note, it means it's a new note
      handleNewNote();
    }
  };

  const handleNewNote = async () => {
    const documentData = {
      id: noteid,
      name: editedNoteTitle || "Untitled Note", // Use the edited title or a default if none is provided
      content,
    };

    // Check if a note with the same ID already exists
    const db = await openDB("DocumentsDB", 1);
    const existingNote = await db.get("documents", noteid);

    if (existingNote) {
      // If a note with the same ID exists, update it
      await db.put("documents", documentData);
    } else {
      // If no note with the same ID exists, create a new one
      await db.add("documents", documentData);
    }

    // Update the current note
    setCurrentNote(documentData);
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

  const handleNoteSelect = (note) => {
    setCurrentNote(note);
    setContent(note.content);
    setEditedNoteTitle(note.name);
  };

  const handleTitleChange = (event) => {
    setEditedNoteTitle(event.target.value);
  };

  return (
    <>
      <div>
        <span>Note title: </span>
        <input
          type="text"
          value={editedNoteTitle}
          onChange={handleTitleChange}
          onBlur={handleSave}
        />
      </div>
      <div className="flex w-max flex-col gap-4">
        <ButtonGroup size="sm">
          <Link to="/">
            <Button className="flex items-center gap-3">
              <Icon>home</Icon>
              Home
            </Button>
          </Link>
          <Button onClick={handleSave} className="flex items-center gap-3">
            <Icon>save</Icon>
            Save
          </Button>
        </ButtonGroup>
      </div>
      <ReactQuill value={content} onChange={setContent} />
    </>
  );
};
