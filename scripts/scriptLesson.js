import LessonController from "../components/lessonEntity/controller";

const lessonNameInput = document.getElementById("textareaName");
const lessonDateInput = document.getElementById("lessonDate");
const lessonDescInput = document.getElementById("textareaDesc");

const bindLessonSelect = document.getElementById("bindLessonSelect");
const bindInterestSelect = document.getElementById("bindInterestSelect");
const bindCategoryInput = document.getElementById("bindCategoryInput");
const bindButton = document.getElementById("bindButton");

let controller = null;
let lessonId = null;

document.addEventListener("DOMContentLoaded", () => {
    controller = new LessonController();
    
    // Инициализация кнопок
    document.getElementById("createLessonButton").addEventListener("click", createLesson);
    document.getElementById("updateLessonButton").addEventListener("click", updateLesson);
    
    // Скрываем кнопку обновления по умолчанию
    document.getElementById("updateLessonButton").style.display = "none";
    bindButton.addEventListener("click", (e) => {
    e.preventDefault();
    controller.bindLessonWithInterest();
});
controller.loadInterestsForBinding();
});

function createLesson() {
    const name = lessonNameInput.value.trim();
    const date = lessonDateInput.value;
    const description = lessonDescInput.value.trim();
    
    controller.createLesson(name, date, description);
    clearForm();
}

function updateLesson() {
    const name = lessonNameInput.value.trim();
    const date = lessonDateInput.value;
    const description = lessonDescInput.value.trim();
    
    controller.updateLesson(lessonId, name, date, description);
    clearForm();
}

export function takeDataToUpdateLessonInTextarea(controller, id, name, date, desc) {
    lessonId = id;
    lessonNameInput.value = name;
    lessonDateInput.value = formatDateForInput(date);
    lessonDescInput.value = desc || "";
    
    document.getElementById("updateLessonButton").style.display = "inline-block";
    document.getElementById("createLessonButton").style.display = "none";
}

function clearForm() {
    lessonId = null;
    lessonNameInput.value = "";
    lessonDateInput.value = "";
    lessonDescInput.value = "";
    document.getElementById("updateLessonButton").style.display = "none";
    document.getElementById("createLessonButton").style.display = "inline-block";
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