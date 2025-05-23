import LessonModel from "./model.js"
import LessonView from "./view.js"

export default class LessonController extends HTMLElement {
    constructor() {
        super()
        this.model = new LessonModel();
        this.viewModels = [];
        this.usersData = null;
    }

    connectedCallback() {
        this.usersData = JSON.parse(sessionStorage.getItem("usersData"));
        console.log(this.usersData);
        this.userId = this.usersData.id; 
        this.token = this.usersData.token;
        this.loadLessons(this.userId);
    }

    async loadLessons() {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        const lessons = await this.model.getAll(this.userId, usersData.token);
        console.log(lessons)
        this.viewModels = [];
        this.innerHTML = "";

        lessons.forEach(lessonData => {
            const viewModel = new LessonView(lessonData, this);
            viewModel.render(this);
            this.viewModels.push(viewModel);
        });
    }

    async createLesson(name, lessonDate,description) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        const data = {
            WorkerId: usersData.id,
            LessonName: name,
            LessonDate: lessonDate,
            Description: description
        };

        await this.model.createLesson(usersData.id, usersData.token, data);
        await this.loadLessons();
    }

    async updateLesson(lessonId, name,lessonDate, description) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));

        const data = {
            Id: lessonId,
            WorkerId: usersData.id,
            LessonName: name,
            LessonDate: lessonDate,
            Description: description
        };

        await this.model.update(usersData.token, data);
        await this.loadLessons();
    }

    async deleteLesson(lessonId) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));

        if (lessonId <= 0) return;

        const index = this.viewModels.findIndex(vm => vm.data.id == lessonId);

        if (index !== -1) {
            this.viewModels[index].remove();
            this.viewModels.splice(index, 1);
        }
        
        await this.model.delete(usersData.id, usersData.token, lessonId);
    }
}

customElements.define("lessons-container", LessonController);