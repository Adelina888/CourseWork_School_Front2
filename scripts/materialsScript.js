document.addEventListener('DOMContentLoaded', async function() {
    // Проверка авторизации
    const userData = JSON.parse(sessionStorage.getItem("usersData"));


    const loadingOverlay = document.getElementById('loading-overlay');
    const materialsTableBody = document.getElementById('materials-table-body');
    const noMaterialsAlert = document.getElementById('no-materials');
    
    // Модальное окно экспорта
    const exportModal = new bootstrap.Modal(document.getElementById('exportModal'));
    
    // Элементы формы фильтра
    const filterForm = document.getElementById('filter-form');
    const lessonFilter = document.getElementById('lesson-filter');
    
    // Элементы формы экспорта
    const exportForm = document.getElementById('export-form');
    const exportLessons = document.getElementById('export-lessons');
    const exportFormat = document.getElementById('export-format');
    const exportFilename = document.getElementById('export-filename');
    
    // Загрузка списка материалов
    async function loadMaterials(lessonId = null) {
        try {
            loadingOverlay.style.display = 'flex';
            
            let url = `https://localhost:5281/api/materialstoragecontract/materials-by-lesson`;
            if (lessonId && lessonId !== 'all') {
                url += `?lessonId=${lessonId}&workerId=${userData.login}`;
            } else {
                url += `?workerId=${userData.login}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Ошибка загрузки данных');
            
            const data = await response.json();
            
            if (data.length === 0) {
                materialsTableBody.innerHTML = '';
                noMaterialsAlert.classList.remove('d-none');
            } else {
                noMaterialsAlert.classList.add('d-none');
                
                materialsTableBody.innerHTML = '';
                
                // Для формата словаря (ключ - название занятия, значение - массив материалов)
                if (typeof data === 'object' && !Array.isArray(data)) {
                    let index = 1;
                    for (const [lessonName, materials] of Object.entries(data)) {
                        materials.forEach(material => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>${index++}</td>
                                <td>${material.materialName}</td>
                                 <td>${lessonName}</td>
                                <td>${material.count}</td>
                               
                            `;
                            materialsTableBody.appendChild(tr);
                        });
                    }
                } 
                // Для формата массива
                else if (Array.isArray(data)) {
                    data.forEach((material, index) => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${material.materialName}</td>
                            <td>${material.lessonName || ''}</td>
                            <td>${material.count}</td>
                            
                        `;
                        materialsTableBody.appendChild(tr);
                    });
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки материалов:', error);
            alert('Ошибка загрузки материалов: ' + error.message);
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }
    
    // Загрузка списка занятий
    async function loadLessons() {
        try {
            const response = await fetch(`https://localhost:5281/api/lessons?workerId=${userData.login}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Ошибка загрузки данных');
            
            const lessons = await response.json();
            
            // Обновляем список занятий в фильтре
            lessonFilter.innerHTML = '<option value="all" selected>Все материалы</option>';
            
            // Обновляем список занятий для экспорта
            exportLessons.innerHTML = '';
            
            lessons.forEach(lesson => {
                // Добавляем опцию в фильтр
                const filterOption = document.createElement('option');
                filterOption.value = lesson.id;
                filterOption.textContent = lesson.lessonName;
                lessonFilter.appendChild(filterOption);
                
                // Добавляем опцию для экспорта
                const exportOption = document.createElement('option');
                exportOption.value = lesson.id;
                exportOption.textContent = lesson.lessonName;
                exportLessons.appendChild(exportOption);
            });
        } catch (error) {
            console.error('Ошибка загрузки занятий:', error);
            alert('Ошибка загрузки занятий: ' + error.message);
        }
    }
    
    // Обработка формы фильтра
    filterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await loadMaterials(lessonFilter.value);
    });
    
    // Обработка кнопок экспорта
    document.getElementById('export-doc-btn').addEventListener('click', function() {
        exportFormat.value = 'doc';
        exportModal.show();
    });

    document.getElementById('export-xlsx-btn').addEventListener('click', function() {
        exportFormat.value = 'xlsx';
        exportModal.show();
    });

    // Обработка кнопки экспорта в модальном окне
    document.getElementById('export-btn').addEventListener('click', async function() {
        if (!exportForm.checkValidity()) {
            exportForm.reportValidity();
            return;
        }
        
        try {
            loadingOverlay.style.display = 'flex';
            
            // Получаем выбранные занятия
            const lessonIds = Array.from(exportLessons.selectedOptions).map(option => option.value);
            const fileName = exportFilename.value || 'materials_list';
            
            let url = `https://localhost:5281/api/report/material-by-lessons`;
            if (lessonIds.length > 0) {
                url += `?lessonIds=${lessonIds.join(',')}&workerId=${userData.login}`;
            } else {
                url += `?workerId=${userData.login}`;
            }
            
            // Добавляем формат в URL
            url += `&format=${exportFormat.value}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Ошибка получения отчета');
            
            const blob = await response.blob();
            downloadFile(blob, `${fileName}.${exportFormat.value === 'doc' ? 'docx' : 'xlsx'}`);
            
            exportModal.hide();
        } catch (error) {
            console.error('Ошибка при экспорте:', error);
            alert('Ошибка экспорта: ' + error.message);
        } finally {
            loadingOverlay.style.display = 'none';
        }
    });
    
    function downloadFile(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    // Загружаем данные при загрузке страницы
    await loadMaterials();
    await loadLessons();
});