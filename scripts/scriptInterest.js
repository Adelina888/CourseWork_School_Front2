import InterestController from "../components/interestEntity/controller";

const interestNameInput = document.getElementById("textareaName");
const interestDescInput = document.getElementById("textareaDesc");

let controller = null;
let currentInterestId = null;

document.addEventListener("DOMContentLoaded", () => {
    controller = new InterestController();
    
    // Инициализация кнопок
    document.getElementById("createInterestButton").addEventListener("click", createInterest);
    document.getElementById("updateInterestButton").addEventListener("click", updateInterest);
    
    // Скрываем кнопку обновления по умолчанию
    document.getElementById("updateInterestButton").style.display = "none";
});

function createInterest() {
    const name = interestNameInput.value.trim();
    const description = interestDescInput.value.trim();
    
    if (!name) {
        alert("Пожалуйста, заполните название интереса");
        return;
    }

    controller.createInterest(name, description);
    clearForm();
}

function updateInterest() {
    if (!currentInterestId) {
        alert("Сначала выберите интерес для редактирования");
        return;
    }

    const name = interestNameInput.value.trim();
    const description = interestDescInput.value.trim();
    
    controller.updateInterest(currentInterestId, name, description);
    clearForm();
}

export function takeDataToUpdateInterestInTextarea(controller, id, name, desc) {
    currentInterestId = id;
    interestNameInput.value = name;
    interestDescInput.value = desc || "";
    
    // Показываем кнопку обновления
    document.getElementById("updateInterestButton").style.display = "inline-block";
    document.getElementById("createInterestButton").style.display = "none";
}

function clearForm() {
    currentInterestId = null;
    interestNameInput.value = "";
    interestDescInput.value = "";
    document.getElementById("updateInterestButton").style.display = "none";
    document.getElementById("createInterestButton").style.display = "inline-block";
}