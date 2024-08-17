import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/UpdateNoteForm.css"; 

function UpdateNoteForm({ note, onUpdate, onCancel }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .put(`/api/notes/update/${note.id}/`, { title, content })
      .then((res) => {
        if (res.status === 200) {
          onUpdate(res.data);
          alert("Note Updated successfully");
        } else {
          alert("Failed to update the note");
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="update-note-form">
      <h2>Update Note</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <div className="button-container">
          <button className="update-button" type="submit">Update</button>
          <button className="cancel-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateNoteForm;
