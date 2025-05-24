import axios from "axios";

export default class AchievementModel { 
    constructor() {
        this.data = [];
    }

    async getAll(userId, token) {
        try {
            const response = await axios.get(`https://localhost:7235/api/achievements/getallrecords`, {
                params: { workerId: userId }, 
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            if (response.status === 200) {
                this.data = response.data;
                return response.data;
            }
            //throw new Error("Не удалось загрузить достижения");
        } catch (error) {
            console.error("Ошибка при загрузке достижений:", error);
            throw error;
        }
    } 

    async createAchievement(userId, token, data) {
        try {
            alert("model")
            var response = await axios.post(`https://localhost:7235/api/achievements/register`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        }
        catch (error) {
            alert("ОШИБКА " + error)
        }
        
    }

    async update(token, data) {
        try {
            const response = await axios.put(`https://localhost:7235/api/achievements/changeinfo`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при обновлении достижения:", error);
            throw error;
        }
    }

    async delete(workerId, token, achievementId) {
        try {
            const response = await axios.delete(`https://localhost:7235/api/achievements/${achievementId}`, {
                params: { workerId },
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при удалении достижения:", error);
            throw error;
        }
    }

    async getLessons(userId, token) {
        try {
            const response = await axios.get(`https://localhost:7235/api/lessons/getallrecords`, {
                params: { workerId: userId },
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при загрузке занятий:", error);
            throw error;
        }
    }
}