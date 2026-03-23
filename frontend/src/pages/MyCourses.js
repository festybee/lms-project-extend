import { useState, useEffect } from 'react';
import { getMyCourses } from '../services/api';
import Navbar from '../components/Navbar';

function MyCourses() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const res = await getMyCourses();
                setEnrollments(res.data);
            } catch (err) {
                setError('Failed to load your courses');
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-blue-600">My Courses</h1>
                    <p className="text-gray-500 mt-1">Courses you are enrolled in</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="text-center text-gray-400 mt-20 text-lg">
                        Loading your courses...
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20 text-lg">
                        You have not enrolled in any courses yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                className="bg-white rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                            >
                                {/* Card Body */}
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-2">
                                        {enrollment.course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-3">
                                        {enrollment.course.description}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        By {enrollment.course.created_by?.username}
                                    </span>
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 pb-5">
                                    <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                        ✅ Enrolled
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyCourses;