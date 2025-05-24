import AchievementModel from "./model.js"
import AchievementView from "./view.js"

export default class AchievementController extends HTMLElement {
    constructor () {
        super()
        this.model = new AchievementModel();
        this.viewModels = [];
        this.usersData = null;
    }

    /*connectedCallback() {
        const usersData = JSON.parse(sessionStorage.getItem("usersData"));
        alert("connectedCallback " + usersData.fio)
        this.createHeader(usersData.fio);
    }*/

    connectedCallback() {
        this.usersData = JSON.parse(sessionStorage.getItem("usersData"));
        console.log(this.usersData);
        this.userId = this.usersData.id; 
        this.token = this.usersData.token;
        this.loadAchievements(this.userId);
    }

    async loadAchievements() {
    let usersData = JSON.parse(sessionStorage.getItem("usersData"));
    // Загружаем и достижения, и занятия
    const [achievements, lessons] = await Promise.all([
        this.model.getAll(this.userId, usersData.token),
        this.loadLessons()
    ]);
    console.log("Полученные достижения:", achievements);
    console.log("Полученные занятия:", lessons);
    
    this.viewModels = [];
    this.innerHTML = "";

    achievements.forEach(achievementsData => {
        // Находим название занятия по ID
        const lesson = lessons.find(l => l.id === achievementsData.lessonId);
        console.log("Найденное занятие:", lesson);
        achievementsData.lessonName = lesson ? lesson.lessonName : "Не указано";
        console.log("Итоговое название занятия:", achievementsData.lessonName);
        
        const viewModel = new AchievementView(achievementsData, this);
        viewModel.render(this);
        this.viewModels.push(viewModel);
    });
}

    //тут поменять на id worker
    async createAchievement(name, description, lessonId, date) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        alert("controller name " + name);
        const data = {
            WorkerId: usersData.id,
            AchievementName: name,
            Description: description,
            LessonId: lessonId,
            AchievementDate: date
        };

        let resp = await this.model.createAchievement(usersData.id, usersData.token, data);
        /*const viewModel = new CircleView(data, this);
        viewModel.render(this);
        this.viewModels.push(viewModel);*/
        
        await this.loadAchievements();
        
    }

    async updateAchievement(achievementId, name, desc,lessonId, date) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));

        /*const index = this.viewModels.findIndex(vm => vm.data.id == circleId);
        alert("index " + index)
        if (index !== -1) {
            const viewModel = this.viewModels[index];

            viewModel.data.circleName = name;
            viewModel.data.description = desc;
        }*/

        const data = {
            Id: achievementId,
            WorkerId: usersData.id,
            AchievementName: name,
            Description: desc,
            LessonId: lessonId,
            AchievementDate: date
        };

        await this.model.update(usersData.token, data);
        await this.loadAchievements();
    }

    async deleteAchievement(achievementId) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));

        if (achievementId <= 0) {
            return;
        }

       const index = this.viewModels.findIndex(vm => vm.data.id == achievementId);

        if (index !== -1) {
            this.viewModels[index].remove();
            this.viewModels.splice(index, 1);
        }
        
        await this.model.delete(usersData.id, usersData.token, achievementId);
    }
    async loadLessons() {
    let usersData = JSON.parse(sessionStorage.getItem("usersData"));
    try {
        const response = await axios.get(`https://localhost:7235/api/lessons/getallrecords`, {
            params: { workerId: usersData.id },
            headers: {
                "Authorization": `Bearer ${usersData.token}`,
                "Content-Type": "application/json"
            }
        });
        this.lessons = response.data;
        return this.lessons;
    } catch (error) {
        console.error("Ошибка при загрузке занятий:", error);
        return [];
    }
}

}

customElements.define("achievements-container", AchievementController);