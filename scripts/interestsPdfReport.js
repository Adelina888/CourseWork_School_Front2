import axios from "axios";
document.addEventListener("DOMContentLoaded", async () => {
    const usersData = JSON.parse(sessionStorage.getItem("usersData"));
    if (!usersData) {
        window.location.href = "login.html";
        return;
    }
    
    const workerId = usersData.id;
    const token = usersData.token;
    const showReportBtn = document.getElementById("showReportBtn");
    const sendEmailBtn = document.getElementById("sendEmailBtn");
    const pdfViewerContainer = document.getElementById("pdfViewerContainer");

    // Установка дат по умолчанию
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    document.getElementById("fromDate").valueAsDate = firstDay;
    document.getElementById("toDate").valueAsDate = today;

    showReportBtn.addEventListener("click", async () => {
        const fromDate = new Date(document.getElementById("fromDate").value).toISOString();
        const toDate = new Date(document.getElementById("toDate").value).toISOString();

        
        
        if (!fromDate || !toDate) {
            alert("Выберите период");
            return;
        }

        try {
            // Показываем индикатор загрузки
            showReportBtn.disabled = true;
            showReportBtn.textContent = "Загрузка...";
            pdfViewerContainer.innerHTML = '<div class="text-center">Загрузка PDF...</div>';
            pdfViewerContainer.style.display = 'block';

            const response = await axios.get(
                `https://localhost:7235/api/report/CreateDocumentInterestsWithAchievementsWithCircles`,
                {
                    params: {
                        workerId,
                        fromDate,
                        toDate
                    },
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/octet-stream"
                    },
                    responseType: "blob"
                }
            );

            if (!response.data || response.data.size === 0) {
                throw new Error("Получен пустой PDF файл");
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style.width = '100%';
            iframe.style.height = '600px';
            pdfViewerContainer.appendChild(iframe);

            
        } catch (error) {
            console.error("Ошибка:", error);
            pdfViewerContainer.innerHTML = `
                <div class="alert alert-danger">
                    Ошибка при загрузке PDF: ${error.message || 'Неизвестная ошибка'}
                </div>`;
        } finally {
            showReportBtn.disabled = false;
            showReportBtn.textContent = "Показать отчет";
        }
    });

    sendEmailBtn.addEventListener("click", async () => {
        const fromDate = document.getElementById("fromDate").value;
        const toDate = document.getElementById("toDate").value;
        const email = document.getElementById("emailInput").value;
        
        if (!fromDate || !toDate) {
            alert("Выберите период");
            return;
        }
        
        if (!email || !email.includes("@")) {
            alert("Введите корректный email");
            return;
        }

        try {
            sendEmailBtn.disabled = true;
            sendEmailBtn.textContent = "Отправка...";
            
            const response = await axios.post(
                "https://localhost:7235/api/report/SendInterestsPdfReportByEmail",
                {
                    workerId,
                    fromDate,
                    toDate,
                    email
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 200) {
                alert("PDF отчет успешно отправлен на указанный email");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert(`Ошибка при отправке отчета: ${error.response?.data?.message || error.message}`);
        } finally {
            sendEmailBtn.disabled = false;
            sendEmailBtn.textContent = "Отправить на почту";
        }
    });
});