import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/api";


function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            logout();
            navigate("/login");
        }
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
            {/* Brand */}
            <Link to="/dashboard" className="text-xl font-bold tracking-wide hover:opacity-90">
                LMS Portal
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-6 text-sm font-medium">
                <Link to="/courses" className="hover:underline">
                    Courses
                </Link>

                {/* Student only */}
                {user?.role === 'student' && (
                    <Link to="/my-courses" className="hover:underline">
                        My Courses
                    </Link>
                )}

                {/* Teacher and Admin */}
                {(user?.role === 'teacher' || user?.role === 'admin') && (
                    <Link to="/manage-courses" className="hover:underline">
                        Manage Courses
                    </Link>
                )}

                {/* Admin only */}
                {user?.role === 'admin' && (
                    <Link to="/users" className="hover:underline">
                        Users
                    </Link>
                )}
            </div>

            {/* User Info + Logout */}
            <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-100">
                    👤 {user?.username}{' '}
                    <span className="capitalize bg-blue-500 px-2 py-0.5 rounded-full text-xs">
                        {user?.role}
                    </span>
                </span>
                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-3 py-1 rounded-lg font-semibold hover:bg-blue-50 transition text-sm"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;