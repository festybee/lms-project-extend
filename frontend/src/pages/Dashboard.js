import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Dashboard() {
    const { user } = useAuth();

    const studentLinks = [
        { to: '/courses', label: '📚 Browse Courses', desc: 'Explore all available courses' },
        { to: '/my-courses', label: '🎓 My Courses', desc: 'View your enrolled courses' },
    ];

    const teacherLinks = [
        { to: '/courses', label: '📚 Browse Courses', desc: 'Explore all available courses' },
        { to: '/manage-courses', label: '✏️ Manage Courses', desc: 'Create and edit your courses' },
    ];

    const adminLinks = [
        { to: '/courses', label: '📚 Browse Courses', desc: 'Explore all available courses' },
        { to: '/manage-courses', label: '✏️ Manage Courses', desc: 'Create and edit all courses' },
        { to: '/users', label: '👥 Manage Users', desc: 'View and manage all users' },
    ];

    const links =
        user?.role === 'student' ? studentLinks :
        user?.role === 'teacher' ? teacherLinks :
        user?.role === 'admin' ? adminLinks : [];

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-10">
                {/* Welcome Header */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h1 className="text-2xl font-bold text-blue-600">
                        Welcome back, {user?.username}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        You are logged in as{' '}
                        <span className="capitalize font-semibold text-gray-700">
                            {user?.role}
                        </span>
                    </p>
                </div>

                {/* Quick Access Cards */}
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Quick Access
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                        >
                            <p className="text-2xl mb-2">{link.label.split(' ')[0]}</p>
                            <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition">
                                {link.label.split(' ').slice(1).join(' ')}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;