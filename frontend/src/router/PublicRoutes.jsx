import { Routes, Route } from 'react-router-dom';
import Home from '../modules/public/pages/Home';
import About from '../modules/public/pages/About';
import Courses from '../modules/public/pages/Courses';
import Contact from '../modules/public/pages/Contact';
import Gallery from '../modules/public/pages/Gallery';
import FAQ from '../modules/public/pages/FAQ';
import Login from '../modules/public/pages/Login';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="courses" element={<Courses />} />
      <Route path="contact" element={<Contact />} />
      <Route path="gallery" element={<Gallery />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
};

export default PublicRoutes;

