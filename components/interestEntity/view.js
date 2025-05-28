import { createCardEntity } from '../entity-card-helper.js'

export default class InterestView {

    constructor(data, parentElement) {
        this.data = data;
        this.parentDiv = parentElement;
    } 

    render(interestController) {
        if (!this.data) return;
        let type = "interest";

        createCardEntity(
            interestController,
            this.data.id,
            type,
            this.data.interestName,
            this.data.description
        );
    }

    async loadInterest(data, controller) {
        try {
            this.data = data;
            this.render(controller);
            return interest;
        } catch (error) {
            console.error("Ошибка при загрузке поста:", error);
        }
    }

    async remove() {
    const interestElement = document.getElementById(`interest-${this.data.id}`);
    if (interestElement) {
        interestElement.remove();}
    }
  
} 