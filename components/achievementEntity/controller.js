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
        console.log(this.usersData);
        this.userId = this.usersData.id; 
        this.token = this.usersData.token;
        this.loadAchievements();
        this.loadLessonsForDropdown();
    }

    async loadAchievements() {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        const achievements = await this.model.getAll(this.userId, usersData.token);
        this.viewModels = [];
        this.innerHTML = "";

        achievements.forEach(achievementData => {
            const viewModel = new AchievementView(achievementData, this);
            viewModel.render(this);
            this.viewModels.push(viewModel);
        });
    }

    async loadLessonsForDropdown() {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        const lessons = await this.model.getLessons(this.userId, usersData.token);
        const select = document.getElementById("lessonSelect");
        
        if (select) {
            select.innerHTML = '<option value="">Не привязано к занятию</option>';
            lessons.forEach(lesson => {
                const option = document.createElement("option");
                option.value = lesson.id;
                option.textContent = lesson.lessonName;
                select.appendChild(option);
            });
        }
    }

    async createAchievement(name, lessonId, description) {
        
            let usersData = JSON.parse(sessionStorage.getItem("usersData"));
            console.log(this.usersData);
            alert("controller name " + name);


            const data = {
                WorkerId: usersData.userId,
                LessonId: lessonId || null,
                AchievementName: name,
                Description: description,
                AchievementDate: new Date().toISOString()
            };
            await this.model.createAchievement(usersData.id, usersData.token, data);
            await this.loadAchievements();
            alert("Достижение успешно создано");

    }

    async updateAchievement(achievementId, name, lessonId, description) {
        try {
            let usersData = JSON.parse(sessionStorage.getItem("usersData"));
            if (!achievementId) {
                throw new Error("Не выбрано достижение для редактирования");
            }

            const data = {
                Id: achievementId,
                WorkerId: usersData.userId,
                LessonId: lessonId || null,
                AchievementName: name,
                Description: description
            };

            await this.model.update(usersData.token, data);
            await this.loadAchievements();
            alert("Достижение успешно обновлено");
        } catch (error) {
            console.error("Ошибка при обновлении достижения:", error);
            alert(error.message || "Не удалось обновить достижение");
        }
    }

    async deleteAchievement(achievementId) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));

        if (achievementId <= 0) return;

        const index = this.viewModels.findIndex(vm => vm.data.id == achievementId);
        if (index !== -1) {
            this.viewModels[index].remove();
            this.viewModels.splice(index, 1);
        }
        
        await this.model.delete(usersData.userId, usersData.token, achievementId);
    }
}

customElements.define("achievements-container", AchievementController);