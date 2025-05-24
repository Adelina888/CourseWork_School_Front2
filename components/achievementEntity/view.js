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
            this.data.lessonName || this.data.lesson?.lessonName
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

    async addComment(profileId, profileName, profileAvatar, commentContentText) {
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
            this.render(); // перерисовываем пост с новым комментарием
        } catch (error) {
            console.error("Ошибка при добавлении комментария:", error);
        }
    }

    async remove() {
        const postElement = document.getElementById(`post-${this.data.id}`);
        if (postElement) {
            postElement.remove();
        }
    }

    /*attachCommentFormListener() {
        const form = document.getElementById("enter-comment");
        const textarea = document.getElementById("comment-textarea");

        if (form && textarea) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const commentText = textarea.value.trim();
                if (commentText) {
                    // Для примера передаём тестовые данные пользователя
                    this.addComment(
                        "2",
                        "name 2",
                        "images/ava2",
                        commentText
                    );
                    textarea.value = "";
                }
            };
        }
    }*/
} 