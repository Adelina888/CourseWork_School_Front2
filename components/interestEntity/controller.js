import InterestModel from "./model.js"
import InterestView from "./view.js"

export default class InterestController extends HTMLElement {
    constructor () {
        super()
        this.model = new InterestModel();
        this.viewModels = [];
        this.usersData = null;
    }

    connectedCallback() {
        this.usersData = JSON.parse(sessionStorage.getItem("usersData"));
        console.log(this.usersData);
        this.userId = this.usersData.id; 
        this.token = this.usersData.token;

        this.loadInterests(this.userId);
    }

    async loadInterests() {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        const interests = await this.model.getAll(this.userId, usersData.token);
        console.log(interests)
        this.viewModels = [];
        this.innerHTML = "";

        interests.forEach(interestData => {
            const viewModel = new InterestView(interestData, this);
            viewModel.render(this);
            this.viewModels.push(viewModel);
        });
    }

    async createInterest(name, description) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));
        alert("controller name " + name);
        const data = {
            WorkerId: usersData.id,
            InterestName: name,
            Description: description
        };

        let resp = await this.model.createInterest(usersData.id, usersData.token, data);

        await this.loadInterests();
        
    }

    async updateInterest(interestId, name, desc) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));

        const data = {
            Id: interestId,
            WorkerId: usersData.id,
            InterestName: name,
            Description: desc
        };

        await this.model.update(usersData.token, data);
        await this.loadInterests();
    }

    async deleteInterest(interestId) {
        let usersData = JSON.parse(sessionStorage.getItem("usersData"));

        if (interestId <= 0) {
            return;
        }

       const index = this.viewModels.findIndex(vm => vm.data.id == interestId);

        if (index !== -1) {
            this.viewModels[index].remove();
            this.viewModels.splice(index, 1);
        }
        
        await this.model.delete(usersData.id, usersData.token, interestId);
    }
}

customElements.define("interests-container", InterestController);