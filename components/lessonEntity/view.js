import { createCardEntity } from '../entity-card-helper.js'

export default class LessonView {
    constructor(data, parentElement) {
        this.data = data;
        this.parentDiv = parentElement;
    } 

    render(lessonController) {
        if (!this.data) return;
        let type = "lesson";

        createCardEntity(
            lessonController,
            this.data.id,
            type,
            this.data.lessonName,
            this.data.description,
            this.data.lessonDate
        );
    }

    async loadLesson(data, controller) {
        try {
            this.data = data;
            this.render(controller);
            return lesson;
        } catch (error) {
            console.error("Ошибка при загрузке поста:", error);
        }
    }

    /*async remove() {
        const lessonElement = document.getElementById(`lesson-${this.data.id}`);
        if (lessonElement) {
            lessonElement.remove();
        }
    }*/
}