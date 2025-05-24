// achievement/view.js
import { createCardEntity } from '../entity-card-helper.js'

export default class AchievementView {
    constructor(data, parentElement) {
        this.data = data;
        this.parentDiv = parentElement;
    } 

    render(achievementController) {
        if (!this.data) return;
        let type = "achievement";

        createCardEntity(
            achievementController,
            this.data.id,
            type,
            this.data.achievementName,
            this.data.description,
            this.data.achievementDate
        );
    }

    async loadAchievement(data, controller) {
        try {
            this.data = data;
            this.render(controller);
            return achievement;
        } catch (error) {
            console.error("Ошибка при загрузке достижения:", error);
        }
    }

   /* async remove() {
        const element = document.getElementById(`achievement-${this.data.id}`);
        if (element) {
            element.remove();
        }
    }*/
}