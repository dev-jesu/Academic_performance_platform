import { create } from 'zustand';
import apiClient from '../api/apiClient';

const useStore = create((set, get) => ({
    user: null,
    students: [],
    courses: [],
    loading: false,
    error: null,

    // Auth actions
    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            // In a real app, you might fetch the user profile here
            set({ user: { email }, loading: false });
            return true;
        } catch (err) {
            set({ error: err.response?.data?.detail || 'Login failed', loading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, students: [], courses: [] });
    },

    // Student actions
    fetchStudents: async () => {
        set({ loading: true });
        try {
            const response = await apiClient.get('/students');
            set({ students: response.data, loading: false });
        } catch (err) {
            set({ error: 'Failed to fetch students', loading: false });
        }
    },

    addStudent: async (studentData) => {
        try {
            const response = await apiClient.post('/students', studentData);
            set((state) => ({ students: [...state.students, response.data] }));
            return true;
        } catch (err) {
            set({ error: 'Failed to add student' });
            return false;
        }
    },

    deleteStudent: async (id) => {
        try {
            await apiClient.delete(`/students/${id}`);
            set((state) => ({ students: state.students.filter(s => s.id !== id) }));
            return true;
        } catch (err) {
            set({ error: 'Failed to delete student' });
            return false;
        }
    },

    // Helper to clear error
    clearError: () => set({ error: null }),
}));

export default useStore;
