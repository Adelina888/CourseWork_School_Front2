import LessonModel from "./model.js";
import LessonView from "./view.js";

export default class LessonController extends HTMLElement {
    constructor() {
        super();
        this.model = new LessonModel();
        this.viewModels = [];
        this.usersData = null;
    }

    connectedCallback() {
        this.usersData = JSON.parse(sessionStorage.getItem("usersData"));
        this.userId = this.usersData.id; 
        this.token = this.usersData.token;
        this.loadLessons(this.userId);
    }

    async loadLessons() {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        const lessons = await this.model.getAll(this.userId, usersData.token);
        this.viewModels = [];
        this.innerHTML = "";

        this.lessons = lessons;
        this.updateBindLessonSelect();

        lessons.forEach(lessonData => {
            const viewModel = new LessonView(lessonData, this);
            viewModel.render(this);
            this.viewModels.push(viewModel);
        });

        await this.loadInterestsForBinding();
    }

    async createLesson(name, lessonDate, description) {
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

    async updateLesson(lessonId, name, lessonDate, description) {
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

    async loadInterestsForBinding() {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        const response = await fetch(`https://localhost:7235/api/interests/getallrecords?workerId=${this.userId}`, {
            headers: {
                "Authorization": `Bearer ${usersData.token}`
            }
        });
        this.interests = await response.json();
        this.updateBindInterestSelect();
    }

    updateBindLessonSelect() {
        const bindSelect = document.getElementById("bindLessonSelect");
        const unbindSelect = document.getElementById("unbindLessonSelect");
        
        bindSelect.innerHTML = '<option value="">Выберите урок</option>';
        unbindSelect.innerHTML = '<option value="">Выберите урок</option>';
        
        this.lessons?.forEach(lesson => {
            const option = document.createElement("option");
            option.value = lesson.id;
            option.textContent = lesson.lessonName;
            bindSelect.appendChild(option.cloneNode(true));
            unbindSelect.appendChild(option.cloneNode(true));
        });
    }

    updateBindInterestSelect() {
        const bindSelect = document.getElementById("bindInterestSelect");
        const unbindSelect = document.getElementById("unbindInterestSelect");
        
        bindSelect.innerHTML = '<option value="">Выберите интерес</option>';
        unbindSelect.innerHTML = '<option value="">Выберите интерес</option>';
        
        this.interests?.forEach(interest => {
            const option = document.createElement("option");
            option.value = interest.id;
            option.textContent = interest.interestName;
            bindSelect.appendChild(option.cloneNode(true));
            unbindSelect.appendChild(option.cloneNode(true));
        });
    }

    async bindLessonWithInterest() {
        const lessonId = document.getElementById("bindLessonSelect").value;
        const interestId = document.getElementById("bindInterestSelect").value;
        const category = document.getElementById("bindCategoryInput").value;
        
        if (!lessonId || !interestId || !category) {
            alert("Пожалуйста, заполните все поля");
            return;
        }

        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        
        try {
            const response = await fetch('https://localhost:7235/api/lessoninterest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${usersData.token}`
                },
                body: JSON.stringify({
                    UserId: usersData.id,
                    LessonId: lessonId,
                    InterestId: interestId,
                    Category: category
                })
            });

            if (response.ok) {
                alert("Связь успешно создана");
                this.loadLessons();
            } else {
                const error = await response.json();
                alert(`Ошибка: ${error.message}`);
            }
        } catch (error) {
            console.error("Ошибка при создании связи:", error);
            alert("Произошла ошибка при создании связи");
        }
    }

    async unbindLessonWithInterest() {
        const lessonId = document.getElementById("unbindLessonSelect").value;
        const interestId = document.getElementById("unbindInterestSelect").value;
        
        if (!lessonId || !interestId) {
            alert("Пожалуйста, выберите урок и интерес");
            return;
        }

        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        
        try {
            const response = await fetch(`https://localhost:7235/api/lessoninterest/${lessonId}/${interestId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${usersData.token}`
                }
            });

            if (response.ok) {
                alert("Связь успешно удалена");
                this.loadLessons();
            } else {
                const error = await response.json();
                alert(`Ошибка: ${error.message}`);
            }
        } catch (error) {
            console.error("Ошибка при удалении связи:", error);
            alert("Произошла ошибка при удалении связи");
        }
    }
}

customElements.define("lessons-container", LessonController);