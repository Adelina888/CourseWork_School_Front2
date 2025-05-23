import axios from "axios";

export default class InterestModel { 
    constructor() {
        this.data = [];
    }

    async getAll(userId, token) {
        //alert("MODEL getall model token " + token);
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
            alert("ОШИБКА " + error)
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
            alert("ОШИБКА " + error)
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
            alert("ОШИБКА " + error)
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
            alert("ОШИБКА " + error)
        }
    }

    /*async updatePost(postId, url, text) {
        const post = updateItem(PATH, postId, {
            "userId": "3",
            "profileAvatar": "profile/ava4.jpg",
            "profileName": "name 1",
            "postContentImage": `${url}`,
            "postContentText": `${text}`,
            "like": "false"
        })

        return post;
    }
    
    async addComment(postId, profileId, profileName, profileAvatar, commentContentText) {
        const newComment = {
            postId,
            profileId,
            profileName,
            profileAvatar,
            commentContentText
        };
        
        const savedComment = await createItem(COMMENT_PATH, newComment);

        const post = this.data.find(p => p.id == postId);
        if (post) {
            post.comments.push(savedComment);
        }

        return savedComment;
    }

     async delete(item) {
        const _id = item?.id || item;
        await deleteItem(PATH, _id);

        // Также удаляем из локального массива
        this.data = this.data.filter(p => p.id != _id);
    }

    // Сохраняем посты в localStorage (если надо)
    saveToLocalStorage() {
        lsSave(PATH, this.data);
    }

    // Загружаем посты из localStorage
    loadFromLocalStorage() {
        this.data = lsReadArray(PATH);
    }*/
}