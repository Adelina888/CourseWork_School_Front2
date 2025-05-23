import UsersData from "../user-data.js";
import axios from "axios";

const URL = "http://localhost:5281/";

/*---------------------------------------------------------------------------------------------------------------------*/
let usersData = null;

export const fetchRegistration = async (userData) => {
    try{
        var response = await axios.post(`http://localhost:5281/api/userloginaccaunt/Register`, userData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(response);
        if (response.status === 200) {
            fetchGetUser(userData.login);
            window.location.href = "MainMenu.html";
        }
        return response;
    }
    catch (err) {
        alert("ОШИБКА: " + err);
    }
    
}

export const fetchLogin = async (userData) => {
    try{
        var response = await axios.post(`http://localhost:5281/api/userloginaccaunt/login`, userData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(response);
        if (response.status === 200) {
            let resData = new UsersData(response.data.id, response.data.userLogin, response.data.userFIO, response.data.accessToken);
            sessionStorage.setItem("usersData", JSON.stringify(resData));
            console.log(resData)
            window.location.href = "MainMenu.html";
        }
        return response;
    }
    catch (error) {
        if (error.response) {
            console.error(`Ошибка ${error.response.status}: ${error.response.statusText}`);
            
            if (error.response.status === 500) {
                alert("нет пользователя")
            }
        } else {
            console.error("Ошибка запроса:", error.message);
            alert("Ошибка сети, проверьте соединение.");
        }
    }    
}

/*тут нужно поменять на worker*/
export const fetchGetUser = async (userLogin) => {
    try{
        alert("fetchGetUser " + userLogin)
        var response = await axios.get(`http://localhost:5281/api/Worlers/GetUserByLogin`, {
            params: { login: userLogin }, 
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(response);
        if (response.status === 200) {
            let resData = new UsersData(response.data.id, response.data.login, response.data.fio);
            sessionStorage.setItem("usersData", JSON.stringify(resData));
        }
        return response;
    }
    catch (error) {
        if (error.response) {
            console.error(`Ошибка ${error.response.status}: ${error.response.statusText}`);
            
            if (error.response.status === 500) {
                alert("нет пользователя")
            }
        } else {
            console.error("Ошибка запроса:", error.message);
            alert("Ошибка сети, проверьте соединение.");
        }
    }    
}

/*---------------------------------------------------------------------------------------------------------------------*/

export const fetchLessonsGetAllRecords = async () => {
    //const usersData = JSON.parse(sessionStorage.getItem("usersData"));
    try {
        var response = await axios.post(`https://localhost:7235/api/lessons/getallrecords`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (error) {
        alert("ОШИБКА: " + error);
    }
}