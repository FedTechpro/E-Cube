import MovieDetails from "./pages/MovieDetails";
import BookTicket from "./pages/BookTicket";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import MyTickets from "./pages/MyTickets";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

import { useState } from "react";
import SearchOverlay from "./pages/SearchOverlay";
import BrowseCategory from "./pages/BrowseCategory";
import NotFound from "./pages/NotFound";

function App() {
  const [searchActive, setSearchActive] = useState(false);
  return (
    <Router>
      <AuthProvider>
        <Navbar searchActive={searchActive} setSearchActive={setSearchActive} />
        <div className="mx-2 mt-2 md:mt-6 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/book-ticket/:id" element={<BookTicket />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="more/:category" element={<BrowseCategory />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <SearchOverlay
            searchActive={searchActive}
            setSearchActive={setSearchActive}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
