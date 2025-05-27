import axios from "axios";

document.addEventListener("DOMContentLoaded", async () => {
    const usersData = JSON.parse(sessionStorage.getItem("usersData"));
    if (!usersData) {
        window.location.href = "login.html";
        return;
    }
    let materialIds = [];
    const workerId = usersData.id;
    const token = usersData.token;
    const lessonSelect = document.getElementById("lessonSelect");
    const generateReportBtn = document.getElementById("generateReportBtn");

    // Загружаем список занятий
    try {
        const response = await axios.get(`https://localhost:7235/api/lessons/getallrecords`, {
            params: { workerId },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200 && response.data) {
            response.data.forEach(lesson => {
                const option = document.createElement("option");
                option.value = lesson.id;
                option.textContent = `${lesson.lessonName} (${new Date(lesson.lessonDate).toLocaleDateString()})`;
                lessonSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Ошибка при загрузке занятий:", error);
        alert("Не удалось загрузить список занятий");
    }

 generateReportBtn.addEventListener("click", async () => {
    const selectedOptions = Array.from(lessonSelect.selectedOptions);
    if (selectedOptions.length === 0) {
        alert("Выберите хотя бы одно занятие");
        return;
    }

    const format = document.querySelector('input[name="reportFormat"]:checked').value;
    const usersData = JSON.parse(sessionStorage.getItem("usersData"));
    
    try {
        const endpoint = format === "word" 
            ? "CreateWordDocumentMaterialByLessons" 
            : "CreateExcelDocumentMaterialByLessons";
        
        // Правильное формирование URL
        const baseUrl = `https://localhost:7235/api/report/${endpoint}`;
        const params = new URLSearchParams();
        params.append('workerId', usersData.id);
        selectedOptions.forEach(opt => params.append('lessonIds', opt.value));
        
        const response = await axios.get(`${baseUrl}?${params.toString()}`, {
            headers: {
                "Authorization": `Bearer ${usersData.token}`,
                "Accept": "application/octet-stream"
            },
            responseType: "blob"
        });

        // Создание ссылки для скачивания
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report.${format === "word" ? "docx" : "xlsx"}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
    } catch (error) {
        console.error("Ошибка:", error);
        alert(`Ошибка при генерации отчета: ${error.message}`);
    }
});})