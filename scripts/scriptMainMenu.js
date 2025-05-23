import MenuHeader from "../components/menu-role-helper.js"
console.log("scriptMainMenu.js загружен!");

document.addEventListener("DOMContentLoaded", () => {
    alert("загрузка main")
    const usersData = JSON.parse(sessionStorage.getItem("usersData"));
    alert("scriptMainMenu user fio " + usersData.fio);
    const controller = new MenuHeader();
});