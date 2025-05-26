import axios from "axios";

export default class LessonModel { 
    constructor() {
        this.data = [];
    }

async getAll(userId, token) {
    try {
        const response = await axios.get(`https://localhost:7235/api/lessons/getallrecords`, {
            params: { workerId: userId, includeInterests: true }, 
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        if (response.status === 200) {
            this.data = response.data;
            return response.data;
        }
    } catch (error) {
        console.error("Ошибка при загрузке занятий:", error);
        throw error;
    }
}

    async createLesson(userId, token, data) {
        try {
            const response = await axios.post(`https://localhost:7235/api/lessons/register`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при создании занятия:", error);
            throw error;
        }
    }

    async update(token, data) {
        try {
            const response = await axios.put(`https://localhost:7235/api/lessons/changeinfo`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при обновлении занятия:", error);
            throw error;
        }
    }

    async delete(workerId, token, lessonId) {
        try {
            const response = await axios.delete(`https://localhost:7235/api/lessons/${lessonId}`, {
                params: { workerId },
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при удалении занятия:", error);
            throw error;
        }
    }
}