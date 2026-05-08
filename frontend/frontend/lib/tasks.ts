import api from "./api";
import type { Task } from "./types";

export async function getTasks(): Promise<Task[]> {
    const res = await api.get('/tasks');
    return res.data;
}

export async function createTask(data: {
    title: string
    description?: string
    priority: 'low' | 'medium' | 'high'
    dueDate?: string
    categoryId?: string
}): Promise<Task> {
    const res = await api.post('/tasks', data);
    return res.data;
}

export async function updateTask(id: string, data: {
    title?: string
    description?: string
    status?: 'todo' | 'in_progress' | 'done'
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
    categoryId?: string
}): Promise<Task> {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
}

export async function deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
}