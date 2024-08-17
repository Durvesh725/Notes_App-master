import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import Note from "../components/Note";
import UpdateNoteForm from "../components/UpdateNoteForm"; // Import the new component
import "../styles/Home.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [editingNote, setEditingNote] = useState(null); // State to handle editing
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
    decodeTokenAndFetchUser();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
      })
      .catch((err) => alert(err));
  };

  const decodeTokenAndFetchUser = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const decoded = jwtDecode(token);
      api
        .get("/api/user/")
        .then((res) => {
          setUsername(res.data.username);
        })
        .catch((err) => alert(err));
    }
  };

  const deleteNotes = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted successfully!");
        else alert("Failed to delete the note");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note Created!");
        else alert("Failed to create a note");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      )
    );
    setEditingNote(null); // Close the edit form
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login");
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>{`${getGreeting()}, ${username}`}</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      {editingNote ? (
        <UpdateNoteForm
          note={editingNote}
          onUpdate={handleUpdateNote}
          onCancel={() => setEditingNote(null)}
        />
      ) : (
        <>
          <section className="form-section">
            <h2>Create a new Note</h2>
            <form onSubmit={createNote}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                required
                onChange={(e) => setContent(e.target.value)}
                value={content}
              ></textarea>
              <input type="submit" value="Submit" />
            </form>
          </section>
          <section className="notes-section">
            {notes.length > 0 ? (
              notes.map((note) => (
                <Note
                  note={note}
                  onDelete={deleteNotes}
                  onEdit={setEditingNote}
                  key={note.id}
                />
              ))
            ) : (
              <p>No notes available.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Home;
