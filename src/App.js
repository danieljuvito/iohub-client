import {Routes, Route} from "react-router-dom";
import LogIn from "./pages/LogIn";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {useAuth} from "./hooks/useAuth";
import "./App.css";
import Header from "./pages/Header";
import Search from "./pages/Search";
import Feed from "./pages/Feed";
import {Secret} from "./pages/Secret";
import SignUp from "./pages/SignUp";

function App() {
    const {user} = useAuth()
    return (
        <div style={{
            display: 'block',
            width: 700, padding: 30
        }}>
            {user ? <Header/> : <></>}
            <Routes>
                <Route path="/login" element={<LogIn/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/" element={<ProtectedRoute><Feed/></ProtectedRoute>}/>
                <Route path="/search" element={<ProtectedRoute><Search/></ProtectedRoute>}/>
                <Route path="/secret" element={<ProtectedRoute><Secret/></ProtectedRoute>}/>
            </Routes>
        </div>
    );
}

export default App;