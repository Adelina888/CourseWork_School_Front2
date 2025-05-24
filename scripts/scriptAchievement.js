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
    try {
        const name = achievementNameInput.value.trim();
        const lessonId = lessonSelect.value;
        const description = achievementDescInput.value.trim();
        
        controller.createAchievement(name, lessonId, description);
        clearForm();
    } catch (error) {
        console.error("Ошибка при создании достижения:", error);
        alert(error.message || "Ошибка при создании достижения");
    }
}

function updateAchievement() {
    try {
        if (!achievementId) {
            throw new Error("Сначала выберите достижение для редактирования");
        }

        const name = achievementNameInput.value.trim();
        const lessonId = lessonSelect.value;
        const description = achievementDescInput.value.trim();
        
        controller.updateAchievement(achievementId, name, lessonId, description);
        clearForm();
    } catch (error) {
        console.error("Ошибка при обновлении достижения:", error);
        alert(error.message || "Ошибка при обновлении достижения");
    }
}

export function takeDataToUpdateAchievementInTextarea(controller, id, name,  desc, lessonId) {
    achievementId = id;
    achievementNameInput.value = name || "";
    lessonSelect.value = lessonId || "";
    achievementDescInput.value = desc || "";
    
    document.getElementById("updateAchievementButton").style.display = "inline-block";
    document.getElementById("createAchievementButton").style.display = "none";
}

function clearForm() {
    achievementId = null;
    achievementNameInput.value = "";
    lessonSelect.value = "";
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