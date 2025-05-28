import axios from "axios";

export default class InterestModel { 
    constructor() {
        this.data = [];
    }

    async getAll(userId, token) {
        try {
            var response = await axios.get(`https://localhost:7235/api/interests/getallrecords`, {
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
           console.error("Ошибка при загрузки всех интересов:", error);
            throw error;
        }
    } 


    async createInterest(userId, token, data) {
        try {
            alert("model")
            var response = await axios.post(`https://localhost:7235/api/interests/register`, data, {
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
            console.error("Ошибка при добавлении интереса:", error);
            throw error;
        }
    }

     async update(token, data) {
        try {
            alert(JSON.stringify(data))
            const response = await axios.put(`https://localhost:7235/api/interests/changeinfo`, JSON.stringify(data), {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
        }
        catch (error) {
           console.error("Ошибка при обновлении интереса:", error);
            throw error;
        }
    }

    async delete(workerId, token, interestId) {
        try{
            const response = await axios.delete(`https://localhost:7235/api/interests/${interestId}`, {
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
            console.error("Ошибка при удалении интереса:", error);
            throw error;
        }
    }

}