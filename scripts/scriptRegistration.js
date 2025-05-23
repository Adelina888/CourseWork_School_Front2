
import {fetchRegistration} from "../components/api/client"

document.addEventListener("DOMContentLoaded", () => {
    const likeButton = document.getElementById("registrationButton");
    likeButton.addEventListener("click", function (e) {
        const formElement = document.getElementById('registrationForm'); // извлекаем элемент формы
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formElement);
            
        });
    })
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const registrationButton = document.getElementById("registrationButton");

    registrationButton.addEventListener('click', async (e) => {
        
        e.preventDefault();

        const fio = document.getElementById('fio').value;
        const mail = document.getElementById('email').value;
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        const data = {
            fio,
            login,
            role: "worker",
            password,
            mail
        };

        console.log("Данные к отправке:", data);

        try {
            let responce = fetchRegistration(data);
            if (responce.Ok) {
                //window.location.href = "MainMenu.html";
            }
            
        } catch (err) {
            console.error("Ошибка запроса:", err);
            alert("Ошибка сети");
        }
    });
});