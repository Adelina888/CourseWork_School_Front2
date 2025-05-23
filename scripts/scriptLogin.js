
import {fetchLogin} from "../components/api/client"


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const loginButton = document.getElementById("loginButton");

    loginButton.addEventListener('click', async (e) => {
        
        e.preventDefault();

        const UserLogin = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        const data = {
            UserLogin,
            role: "worker",
            password
        };

        console.log("Данные к отправке:", data);

        try {
            let responce = fetchLogin(data);
            if (responce.Ok) {
                //window.location.href = "MainMenu.html";
            }
            
        } catch (err) {
            console.error("Ошибка запроса:", err);
            alert("Ошибка сети");
        }
    });
});