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
            this.data.achievementDate,
            this.data.lessonName
        );
    }

    async loadAchievement(data, controller) {
        try {
            this.data = data;
            this.render(controller);
            return achievement;
        } catch (error) {
            console.error("Ошибка при загрузке поста:", error);
        }
    }

    /*async addComment(profileId, profileName, profileAvatar, commentContentText) {
        const newComment = {
            profileId,
            postId: this.postId,
            commentId: Date.now().toString(),
            profileAvatar,
            profileName,
            commentContentText
        };

        try {
            await createItem("comments", newComment);
            this.comments.push(newComment);
            this.render(); 
        } catch (error) {
            console.error("Ошибка при добавлении комментария:", error);
        }
    }

    async remove() {
        const postElement = document.getElementById(`post-${this.data.id}`);
        if (postElement) {
            postElement.remove();
        }
    }*/
    async remove() {
    const achievementElement = document.getElementById(`achievement-${this.data.id}`);
    if (achievementElement) {
        achievementElement.remove();
    }}

} 