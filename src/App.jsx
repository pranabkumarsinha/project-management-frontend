import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/Projects";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import Tasks from "./pages/Tasks";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import ProjectDetails from "./pages/ProjectDetails";
import { ToastContainer } from "react-toastify";

// import About from "./pages/About";
// import Contact from "./pages/Contact";

function Layout() {
  const location = useLocation();
  // Show Navbar only on these pages

  const showNavbar = ["/", "/login", "/register"].includes(location.pathname);
  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* public route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* protected route */}
        <Route
          path="/dashboard"
          element={           
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-project"
          element={           
            <ProtectedRoute>
              <AddProject />       
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-project/:id"          
          element={           
            <ProtectedRoute>
              <EditProject />                        
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={           
            <ProtectedRoute>
              <Projects />            
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={           
            <ProtectedRoute>
              <Tasks />                        
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-task"
          element={           
            <ProtectedRoute>
              <AddTask />                       
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-task/:id"          
          element={           
            <ProtectedRoute>
              <EditTask />                                     
            </ProtectedRoute>
          }
        />

        <Route
          path="/project-details/:id"          
          element={           
            <ProtectedRoute>
              <ProjectDetails />                                   
            </ProtectedRoute>
          }
        />

        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
    </>
  );
}
function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
