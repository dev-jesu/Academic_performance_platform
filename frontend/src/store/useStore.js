import { create } from 'zustand';
import apiClient from '../api/apiClient';

const useStore = create((set, get) => ({
    user: null,
    students: [],
    courses: [],
    isAuthLoading: false,
    isStudentsLoading: false,
    isCoursesLoading: false,
    error: null,

    // Auth actions
    login: async (email, password) => {
        set({ isAuthLoading: true, error: null });
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { access_token, role } = response.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('role', role);
            set({ user: { email, role }, isAuthLoading: false });
            return true;
        } catch (err) {
            set({ error: err.response?.data?.detail || 'Login failed', isAuthLoading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        set({ user: null, students: [], courses: [] });
    },

    // Student actions
    fetchStudents: async (params = {}) => {
        set({ isStudentsLoading: true });
        try {
            const response = await apiClient.get('/students', { params });
            set({ students: response.data, isStudentsLoading: false });
        } catch (err) {
            set({ error: 'Failed to fetch students', isStudentsLoading: false });
        }
    },

    addStudent: async (studentData) => {
        set({ isStudentsLoading: true });
        try {
            const response = await apiClient.post('/students', studentData);
            set((state) => ({
                students: [...state.students, response.data],
                isStudentsLoading: false
            }));
            return true;
        } catch (err) {
            set({ error: 'Failed to add student', isStudentsLoading: false });
            return false;
        }
    },

    deleteStudent: async (id) => {
        set({ isStudentsLoading: true });
        try {
            await apiClient.delete(`/students/${id}`);
            set((state) => ({
                students: state.students.filter(s => s.id !== id),
                isStudentsLoading: false
            }));
            return true;
        } catch (err) {
            set({ error: 'Failed to delete student', isStudentsLoading: false });
            return false;
        }
    },

    // Course actions
    fetchCourses: async (params = {}) => {
        set({ isCoursesLoading: true });
        try {
            const response = await apiClient.get('/courses', { params });
            set({ courses: response.data, isCoursesLoading: false });
        } catch (err) {
            set({ error: 'Failed to fetch courses', isCoursesLoading: false });
        }
    },

    // Helper to clear error
    clearError: () => set({ error: null }),
}));

export default useStore;
