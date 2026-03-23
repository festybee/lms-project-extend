import { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function ManageCourses() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getCourses();
                if (user?.role === 'teacher') {
                    setCourses(res.data.filter(c => c.created_by?.username === user?.username));
                } else {
                    setCourses(res.data);
                }
            } catch (err) {
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [user?.role, user?.username]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await createCourse(formData);
            setCourses([...courses, res.data]);
            setFormData({ title: '', description: '' });
            setShowForm(false);
            setSuccessMsg('Course created successfully!');
        } catch (err) {
            setError('Failed to create course');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (course) => {
        setEditingCourse(course.id);
        setFormData({ title: course.title, description: course.description });
        setShowForm(false);
        setSuccessMsg('');
        setError('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await updateCourse(editingCourse, formData);
            setCourses(courses.map(c => c.id === editingCourse ? res.data : c));
            setEditingCourse(null);
            setFormData({ title: '', description: '' });
            setSuccessMsg('Course updated successfully!');
        } catch (err) {
            setError('Failed to update course');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingCourse(null);
        setFormData({ title: '', description: '' });
        setError('');
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        setError('');
        setSuccessMsg('');
        try {
            await deleteCourse(courseId);
            setCourses(courses.filter(c => c.id !== courseId));
            setSuccessMsg('Course deleted successfully!');
        } catch (err) {
            setError('Failed to delete course');
        }
    };

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">Manage Courses</h1>
                        <p className="text-gray-500 mt-1">Create and manage your courses</p>
                    </div>
                    {!editingCourse && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            {showForm ? 'Cancel' : '+ New Course'}
                        </button>
                    )}
                </div>

                {/* Create Form */}
                {showForm && !editingCourse && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Create New Course
                        </h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {submitting ? 'Creating...' : 'Create Course'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Edit Form */}
                {editingCourse && (
                    <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-600 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Edit Course
                        </h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition border border-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

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

                {/* Courses List */}
                {loading ? (
                    <div className="text-center text-gray-400 mt-20 text-lg">
                        Loading courses...
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20 text-lg">
                        No courses found. Create your first one!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className={`bg-white rounded-xl shadow-md p-5 flex justify-between items-center ${editingCourse === course.id ? 'border-l-4 border-blue-600' : ''}`}
                            >
                                <div>
                                    <h3 className="text-base font-semibold text-blue-600">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {course.description}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        By {course.created_by?.username}
                                    </span>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEditClick(course)}
                                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageCourses;