// achievement/controller.js
import AchievementModel from "./model.js"
import AchievementView from "./view.js"

export default class AchievementController extends HTMLElement {
    constructor() {
        super()
        this.model = new AchievementModel();
        this.viewModels = [];
        this.usersData = null;
        this.lessons = [];
    }

    connectedCallback() {
        this.usersData = JSON.parse(sessionStorage.getItem("usersData"));
        this.userId = this.usersData.id; 
        this.token = this.usersData.token;
        this.loadAchievements();
        this.loadLessonsForDropdown();
    }

    async loadAchievements() {
        const achievements = await this.model.getAll(this.userId, this.token);
        this.viewModels = [];
        this.innerHTML = "";

        achievements.forEach(achievementData => {
            const viewModel = new AchievementView(achievementData, this);
            viewModel.render(this);
            this.viewModels.push(viewModel);
        });
    }

    async loadLessonsForDropdown() {
        this.lessons = await this.model.getLessons(this.userId, this.token);
        const select = document.getElementById("lessonSelect");
        
        if (select) {
            select.innerHTML = '<option value="">Не привязано к занятию</option>';
            this.lessons.forEach(lesson => {
                const option = document.createElement("option");
                option.value = lesson.id;
                option.textContent = lesson.lessonName;
                select.appendChild(option);
            });
        }
    }

    async createAchievement(name, lessonId, description) {
        const data = {
            WorkerId: this.userId,
            LessonId: lessonId || null,
            AchievementName: name,
            Description: description
        };

        await this.model.createAchievement(this.userId, this.token, data);
        await this.loadAchievements();
    }

    async updateAchievement(achievementId, name, lessonId, description) {
        const data = {
            Id: achievementId,
            WorkerId: this.userId,
            LessonId: lessonId || null,
            AchievementName: name,
            Description: description
        };

        await this.model.update(this.token, data);
        await this.loadAchievements();
    }

    async deleteAchievement(achievementId) {
        if (achievementId <= 0) return;

        const index = this.viewModels.findIndex(vm => vm.data.id == achievementId);
        if (index !== -1) {
            this.viewModels[index].remove();
            this.viewModels.splice(index, 1);
        }
        
        await this.model.delete(this.userId, this.token, achievementId);
    }
}

customElements.define("achievements-container", AchievementController);