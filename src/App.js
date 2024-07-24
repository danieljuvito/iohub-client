import {Routes, Route} from "react-router-dom";
import LogIn from "./pages/LogIn";
import {ProtectedRoute} from "./components/ProtectedRoute";
import "./App.css";
import Header from "./pages/Header";
import Search from "./pages/Search";
import Feed from "./pages/Feed";
import {Profile} from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Stories from "./pages/Stories";

function App() {
    return (
        <div style={{
            display: 'block',
            padding: 30,
            width: "min(500px, 100%)",
            marginLeft: "auto",
            marginRight: "auto",
        }}>
            <Header/>
            <Routes>
                <Route path="/login" element={<LogIn/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/" element={<ProtectedRoute><Feed/></ProtectedRoute>}/>
                <Route path="/search" element={<ProtectedRoute><Search/></ProtectedRoute>}/>
                <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                <Route path="/stories/:id" element={<ProtectedRoute><Stories/></ProtectedRoute>}/>
            </Routes>
        </div>
    );
}

export default App;