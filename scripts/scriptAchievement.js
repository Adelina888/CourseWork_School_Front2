// scriptAchievement.js
import AchievementController from "../components/achievementEntity/controller";

const achievementNameInput = document.getElementById("textareaName");
const achievementDescInput = document.getElementById("textareaDesc");
const lessonSelect = document.getElementById("lessonSelect");
const achievementDateInput = document.getElementById("achievementDate");

let controller = null;
let achievementId = null;

document.addEventListener("DOMContentLoaded", () => {
    controller = new AchievementController();
    
    // Инициализация кнопок
    document.getElementById("createAchievementButton").addEventListener("click", createAchievement);
    document.getElementById("updateAchievementButton").addEventListener("click", updateAchievement);
    
    // Скрываем кнопку обновления по умолчанию
    document.getElementById("updateAchievementButton").style.display = "none";
    
    // Загрузка списка занятий
    loadLessons();
});

async function loadLessons() {
    try {
        const usersData = JSON.parse(sessionStorage.getItem("usersData"));
        const response = await axios.get(`https://localhost:7235/api/lessons/getallrecords`, {
            params: { workerId: usersData.id },
            headers: {
                "Authorization": `Bearer ${usersData.token}`,
                "Content-Type": "application/json"
            }
        });
        
        lessonSelect.innerHTML = '<option value="">Не привязано к занятию</option>';
        response.data.forEach(lesson => {
            const option = document.createElement("option");
            option.value = lesson.id;
            option.textContent = lesson.lessonName;
            lessonSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Ошибка при загрузке занятий:", error);
    }
}

function createAchievement() {
    const name = achievementNameInput.value.trim();
    const description = achievementDescInput.value.trim();
    const lessonId = lessonSelect.value || null;
    const date = achievementDateInput.value || new Date().toISOString();
    
    if (!name) {
        alert("Пожалуйста, заполните название достижения");
        return;
    }

    controller.createAchievement(name, description, lessonId, date);
    clearForm();
}

function updateAchievement() {
    if (!achievementId) {
        alert("Сначала выберите достижение для редактирования");
        return;
    }

    const name = achievementNameInput.value.trim();
    const description = achievementDescInput.value.trim();
    const lessonId = lessonSelect.value || null;
    const date = achievementDateInput.value || new Date().toISOString();
    
    controller.updateAchievement(achievementId, name, description, lessonId, date);
    clearForm();
}

export function takeDataToUpdateAchievementInTextarea(controller, id, name, desc, lessonName, date) {
    achievementId = id;
    achievementNameInput.value = name;
    achievementDescInput.value = desc || "";
    

    // Находим ID занятия по его названию
    if (lessonName && lessonName !== "Не указано") {
        const options = Array.from(lessonSelect.options);
        const foundOption = options.find(option => option.text === lessonName);
        if (foundOption) {
            lessonSelect.value = foundOption.value;
        } else {
            lessonSelect.value = "";
            console.warn(`Занятие "${lessonName}" не найдено в списке`);
        }
    } else {
        lessonSelect.value = "";
    }
    //lessonSelect.value = lessonName || "";
    achievementDateInput.value = formatDateForInput(date);
    
    // Показываем кнопку обновления
    document.getElementById("updateAchievementButton").style.display = "inline-block";
    document.getElementById("createAchievementButton").style.display = "none";
}

function clearForm() {
    achievementId = null;
    achievementNameInput.value = "";
    achievementDescInput.value = "";
    lessonSelect.value = "";
    achievementDateInput.value = "";
    document.getElementById("updateAchievementButton").style.display = "none";
    document.getElementById("createAchievementButton").style.display = "inline-block";
}
function formatDateForInput(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    // Получаем локальные компоненты даты
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}