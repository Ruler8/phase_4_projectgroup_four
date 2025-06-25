import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventList from "./components/EventList";
import BookingForm from "./components/BookingForm";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id/book" element={<BookingForm />} />
      </Routes>
    </Router>
  );
}

export default App;





