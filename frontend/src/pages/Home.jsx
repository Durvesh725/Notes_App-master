import { useState, useEffect } from "react";
import api from "../api.js";
import Note from "../components/Note"

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  //   function to get all the notes from the backend
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

  //   function to delete the notes from the server
  const deleteNotes = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        // The request was successful, but there is no content to return (often used in DELETE requests).
        if (res.status === 204) alert("Note deleted successfully!");
        else alert("Failed to delete the note");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  //   create new note
  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        // The request was successful, and a new resource was created.
        if (res.status === 201) alert("Note Created!");
        else alert("Failed to create a note");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <div>
        <h1> NOTES </h1>
        {notes.map((note) => (
          <Note note={note} onDelete={deleteNotes} key={note.id} />
        ))}
      </div>
      <h2>Create a new Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br></br>
        <input
          type="text"
          id="text"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <br></br>
        <br></br>
        <label htmlFor="title">Content:</label>
        <br></br>
        <textarea
          type="text"
          id="text"
          name="content"
          required
          onChange={(e) => setContent(e.target.value)}
          value={content}
        ></textarea>
        <br></br>
        <br></br>
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
}

export default Home;
