// scripts/scriptAchievement.js
import AchievementController from "../components/achievementEntity/controller";

const achievementNameInput = document.getElementById("textareaName");
const lessonSelect = document.getElementById("lessonSelect");
const achievementDescInput = document.getElementById("textareaDesc");

let controller = null;
let achievementId = null;

document.addEventListener("DOMContentLoaded", () => {
    controller = new AchievementController();
    
    document.getElementById("createAchievementButton").addEventListener("click", createAchievement);
    document.getElementById("updateAchievementButton").addEventListener("click", updateAchievement);
    
    document.getElementById("updateAchievementButton").style.display = "none";
});

function createAchievement() {
    const lessonId = lessonSelect.value;
    const name = achievementNameInput.value.trim();
    const description = achievementDescInput.value.trim();
    
    if (!name) {
        alert("Пожалуйста, заполните название достижения");
        return;
    }

    controller.createAchievement( lessonId,name, description);
    clearForm();
}

function updateAchievement() {
    if (!achievementId) {
        alert("Сначала выберите достижение для редактирования");
        return;
    }
    const lessonId = lessonSelect.value;
    const name = achievementNameInput.value.trim();
    const description = achievementDescInput.value.trim();
    
    controller.updateAchievement(achievementId,lessonId, name,  description);
    clearForm();
}

export function takeDataToUpdateAchievementInTextarea(controller, id, name, date, desc, lessonId) {
    achievementId = id;
    achievementNameInput.value = name;
    lessonSelect.value = lessonId || "";
    achievementDescInput.value = desc || "";
    
    // Устанавливаем дату в поле, если оно есть
    const dateInput = document.getElementById("achievementDate");
    if (dateInput) {
        dateInput.value = formatDateForInput(date);
    }
    
    document.getElementById("updateAchievementButton").style.display = "inline-block";
    document.getElementById("createAchievementButton").style.display = "none";
}

function clearForm() {
    achievementId = null;
    lessonSelect.value = "";
    achievementNameInput.value = "";
    achievementDescInput.value = "";
    document.getElementById("updateAchievementButton").style.display = "none";
    document.getElementById("createAchievementButton").style.display = "inline-block";
}
function formatDateForInput(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}