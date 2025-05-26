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

        this.lessons = lessons;
        this.updateBindLessonSelect();

        lessons.forEach(lessonData => {
            const viewModel = new LessonView(lessonData, this);
            viewModel.render(this);
            this.viewModels.push(viewModel);
        });

        await this.loadInterestsForBinding();
    }

    async createLesson(name, lessonDate,description) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        const data = {
            WorkerId: usersData.id,
            LessonName: name,
            LessonDate: lessonDate,
            Description: description
        };

        let resp = await this.model.createLesson(usersData.id, usersData.token, data);
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

    try {
        // Сначала удаляем на сервере
        await this.model.delete(usersData.id, usersData.token, lessonId);
        
        // Затем обновляем локальное состояние
        const index = this.viewModels.findIndex(vm => vm.data.id == lessonId);
        if (index !== -1) {
            await this.viewModels[index].remove(); // Вызываем метод remove у view
            this.viewModels.splice(index, 1);
        }
        
        // Полная перезагрузка для синхронизации
        await this.loadLessons();
    } catch (error) {
        console.error("Ошибка при удалении:", error);
        alert("Не удалось удалить занятие");
    }
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
        const select = document.getElementById("bindLessonSelect");
        select.innerHTML = '<option value="">Выберите урок</option>';
        this.lessons?.forEach(lesson => {
            const option = document.createElement("option");
            option.value = lesson.id;
            option.textContent = lesson.lessonName;
            select.appendChild(option);
        });
    }

    updateBindInterestSelect() {
        const select = document.getElementById("bindInterestSelect");
        select.innerHTML = '<option value="">Выберите интерес</option>';
        this.interests?.forEach(interest => {
            const option = document.createElement("option");
            option.value = interest.id;
            option.textContent = interest.interestName;
            select.appendChild(option);
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
            } else {
                const error = await response.json();
                alert(`Ошибка: ${error.message}`);
            }
        } catch (error) {
            console.error("Ошибка при создании связи:", error);
            alert("Произошла ошибка при создании связи");
        }}
}

customElements.define("lessons-container", LessonController);