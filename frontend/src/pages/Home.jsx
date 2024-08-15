import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api.js";
import Note from "../components/Note";
import "../styles/Home.css";
import { ACCESS_TOKEN } from "../constants";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");

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
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  // getusername
  const decodeTokenAndFetchUser = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;

      api
        .get("/api/user/")  
        .then((res) => {
          setUsername(res.data.username);
          // console.log(res.data.username);
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

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>{`${getGreeting()}, ${username}`}</h1>
      </header>
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
            <Note note={note} onDelete={deleteNotes} key={note.id} />
          ))
        ) : (
          <p>No notes available.</p>
        )}
      </section>
    </div>
  );
}

export default Home;
