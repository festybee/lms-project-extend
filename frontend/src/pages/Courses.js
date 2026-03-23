import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCourses, enrollCourse, getMyCourses } from '../services/api';
import Navbar from '../components/Navbar';

function Courses() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrolling, setEnrolling] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesRes = await getCourses();
                setCourses(coursesRes.data);

                if (user?.role === 'student') {
                    const myCoursesRes = await getMyCourses();
                    const ids = myCoursesRes.data.map((e) => e.course.id);
                    setEnrolledIds(ids);
                }
            } catch (err) {
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.role]);
 

    const handleEnroll = async (courseId) => {
        setEnrolling(courseId);
        setSuccessMsg('');
        setError('');
        try {
            await enrollCourse(courseId);
            setEnrolledIds([...enrolledIds, courseId]); // update locally
            setSuccessMsg('Successfully enrolled!');
        } catch (err) {
            setError('Enrollment failed. Please try again.');
        } finally {
            setEnrolling(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-blue-600">Available Courses</h1>
                    <p className="text-gray-500 mt-1">Browse and enroll in courses below</p>
                </div>

                {/* Messages */}
                {successMsg && (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
                        {successMsg}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="text-center text-gray-400 mt-20 text-lg">
                        Loading courses...
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20 text-lg">
                        No courses available yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                            >
                                {/* Card Body */}
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-3">
                                        {course.description}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        By {course.created_by?.username}
                                    </span>
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 pb-5">
                                    {user?.role === 'student' && (
                                        enrolledIds.includes(course.id) ? (
                                            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                ✅ Already Enrolled
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleEnroll(course.id)}
                                                disabled={enrolling === course.id}
                                                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
                                            </button>
                                        )
                                    )}
                                    {(user?.role === 'teacher' || user?.role === 'admin') && (
                                        <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                                            {course.created_by?.username === user?.username
                                                ? 'Your Course'
                                                : 'View Only'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Courses;