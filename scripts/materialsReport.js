import axios from "axios";

document.addEventListener("DOMContentLoaded", async () => {
    const usersData = JSON.parse(sessionStorage.getItem("usersData"));
    if (!usersData) {
        window.location.href = "login.html";
        return;
    }

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

    // Обработчик генерации отчета
    generateReportBtn.addEventListener("click", async () => {
        const selectedLessons = Array.from(lessonSelect.selectedOptions).map(opt => opt.value);
        if (selectedLessons.length === 0) {
            alert("Выберите хотя бы одно занятие");
            return;
        }

        const format = document.querySelector('input[name="reportFormat"]:checked').value;
        
       try {
        let endpoint = format === "word" 
            ? "CreateWordDocumentMaterialByLessonsAsync" 
            : "CreateExcelDocumentMaterialByLessonsAsync";

                // Добавляем логирование
        console.log("Отправляем запрос:", {
            url: `https://localhost:7235/api/Report/${endpoint}`,
            workerId: workerId,
            lessonIds: selectedLessons,
            token: token
        });

        // Изменим способ передачи параметров
        const params = new URLSearchParams();
        params.append('workerId', workerId);
        selectedLessons.forEach(lessonId => {
            params.append('lessonIds', lessonId);
        });

        const response = await axios.get(`https://localhost:7235/api/Report/${endpoint}?${params.toString()}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            responseType: "blob"
        });

        console.log("Получен ответ:", response);

            // Создаем ссылку для скачивания
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            
            const extension = format === "word" ? "docx" : "xlsx";
            link.setAttribute("download", `materials_by_lessons.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
        } catch (error) {
    if (error.response) {
        console.error("Server responded with:", error.response.status);
        console.error("Response data:", error.response.data);
    } else if (error.request) {
        console.error("No response received:", error.request);
    } else {
        console.error("Request error:", error.message);
    }
    alert(`Ошибка: ${error.message}`);
}
    });
});