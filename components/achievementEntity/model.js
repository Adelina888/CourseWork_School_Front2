import axios from "axios";

export default class AchievementModel { 
    constructor() {
        this.data = [];
    }

    async getAll(userId, token) {

        try {
            var response = await axios.get(`https://localhost:7235/api/achievements/getallrecords`, {
                params: { workerId: userId }, 
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            console.log(response);
            if (response.status === 200) {
                this.data = response.data;
                return response.data;
            }
        }
        catch (error) {
            console.error("Ошибка при загрузки всех достижений:", error);
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
            if (response.status === 200) {
                this.data = response.data;
                return response;
            }
        }
        catch (error) {
            console.error("Ошибка при создании достижения:", error);
            throw error;
        }
    }

     async update(token, data) {
        try {
            alert(JSON.stringify(data))
            const response = await axios.put(`https://localhost:7235/api/achievements/changeinfo`, JSON.stringify(data), {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
        }
        catch (error) {
            console.error("Ошибка при обновлении достижения:", error);
            throw error;
        }
    }

    async delete(workerId, token, achievementId) {
        try{
            const response = await axios.delete(`https://localhost:7235/api/achievements/${achievementId}`, {
                params: {
                    workerId: workerId
                },
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
        }
        catch (error) {
            console.error("Ошибка при удалении достижения:", error);
            throw error;
        }
    }
    
}

