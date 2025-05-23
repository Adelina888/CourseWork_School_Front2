import LessonController from "../components/lessonEntity/controller";

const textareaName = document.getElementById("textareaName");
const textareaDesc = document.getElementById("textareaDesc");
const textareaDate = document.getElementById("textareaDate");

let controller = null;
let lessonId = null;


document.addEventListener("DOMContentLoaded", () => {
    controller = new LessonController();
});

document.addEventListener("DOMContentLoaded", () => {
    
    const createLessonButton = document.getElementById("createLessonButton");
    createLessonButton.addEventListener("click", function (e) {
        const name = textareaName.value.trim();
        const lessonDate = textareaDate.value.trim();
        const description = textareaDesc.value.trim();
        controller.createLesson(name, lessonDate,description);
        textareaName.value = "";
        textareaDate.value = "";
        textareaDesc.value = "";

    });
});

document.addEventListener("DOMContentLoaded", () => {
    
    const updateLessonButton = document.getElementById("updateLessonButton");
    updateLessonButton.addEventListener("click", function (e) {
        const name = textareaName.value.trim();
        const lessonDate = textareaData.value.trim();
        const description = textareaDesc.value.trim();
        controller.updateLesson(lessonId, name,lessonDate, description);
        textareaName.value = "";
        textareaDate.value = "";
        textareaDesc.value = "";

    });
});

function takeDataToUpdateLessonInTextarea(binController, id, name,lessonDate, desc) {
    controller = binController;
    lessonId = id;

    textareaName.textContent = name;
    textareaDate.textContent = lessonDate;
    textareaDesc.textContent = desc;

    const updateLessonButton = document.getElementById("updateLessonButton");
    updateLessonButton.classList.add('show');
}

export {takeDataToUpdateLessonInTextarea}; 