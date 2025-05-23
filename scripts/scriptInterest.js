import InterestController from "../components/interestEntity/controller";

const textareaName = document.getElementById("textareaName");
const textareaDesc = document.getElementById("textareaDesc");

let controller = null;
let interestId = null;


document.addEventListener("DOMContentLoaded", () => {
    controller = new InterestController();
});

document.addEventListener("DOMContentLoaded", () => {
    
    const createInterestButton = document.getElementById("createInterestButton");
    createInterestButton.addEventListener("click", function (e) {
        const name = textareaName.value.trim();
        const description = textareaDesc.value.trim();
        controller.createInterest(name, description);
        textareaName.value = "";
        textareaDesc.value = "";

    });
});

document.addEventListener("DOMContentLoaded", () => {
    
    const updateInterestButton = document.getElementById("updateInterestButton");
    updateInterestButton.addEventListener("click", function (e) {
        const name = textareaName.value.trim();
        const description = textareaDesc.value.trim();
        controller.updateInterest(interestId, name, description);
        textareaName.value = "";
        textareaDesc.value = "";

    });
});

function takeDataToUpdateInterestInTextarea(binController, id, name, desc) {
    controller = binController;
    interestId = id;

    textareaName.textContent = name;
    textareaDesc.textContent = desc;

    const updateInterestButton = document.getElementById("updateInterestButton");
    updateInterestButton.classList.add('show');
}

export {takeDataToUpdateInterestInTextarea}; 