// Анализ и отправка запроса на сервер
async function runAnalysis() {
    const text = document.getElementById("reportInput").value.trim();
    const age = document.getElementById("age")?.value;
    const gender = document.getElementById("gender")?.value;
    
    // === ВАЛИДАЦИЯ ВХОДНЫХ ДАННЫХ ===
    if (!text) {
        alert("Пожалуйста, введите описание характера");
        return;
    }
    
    if (!age || age < 7 || age > 100) {
        alert("Пожалуйста, введите корректный возраст (от 7 до 100 лет)");
        return;
    }
    
    if (!gender) {
        alert("Пожалуйста, выберите пол");
        return;
    }

    const btn = document.querySelector(".analyze-button");
    const resultDiv = document.getElementById("result");
    const originalBtnText = btn.textContent;
    
    // Блокируем кнопку во время анализа
    btn.disabled = true;
    btn.textContent = "Анализ...";
    
    // Очищаем предыдущие результаты
    resultDiv.style.display = "none";
    resultDiv.innerHTML = "";
    resultDiv.style.opacity = "0";

    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: text,
                age: parseInt(age), // Преобразуем в число
                gender: gender
            })
        });

        const data = await response.json();

        if (data.success) {
            // Создаем красивый HTML для результатов
            let resultHTML = `
                <div class="result-header">
                    <span class="checkmark">✅</span>
                    <strong>Рекомендация готова!</strong>
                </div>
                <div class="result-container">
                    <h3>🎯 Основная рекомендация:</h3>
                    <div class="main-recommendation">
                        <div class="sport-name">${data.sport}</div>
                        <div class="confidence">Уверенность: ${data.confidence}%</div>
                        <div class="reason">${data.reason}</div>
                    </div>
            `;

            // Добавляем альтернативные варианты, если они есть
            if (data.additional_recommendations && data.additional_recommendations.length > 0) {
                resultHTML += `
                    <div class="alternative-recommendations">
                        <h4>🔄 Альтернативные варианты:</h4>
                        <div class="alternatives-list">
                `;
                
                data.additional_recommendations.forEach((rec, index) => {
                    resultHTML += `
                        <div class="alternative-item">
                            <span class="alt-sport">${index + 1}. ${rec.sport}</span>
                            <span class="alt-confidence">${rec.confidence}%</span>
                        </div>
                    `;
                });
                
                resultHTML += `
                        </div>
                    </div>
                `;
            }

            resultHTML += `</div>`;
            resultDiv.innerHTML = resultHTML;
            resultDiv.style.display = "block";
            
            // Плавное появление результата
            setTimeout(() => {
                resultDiv.style.transition = "opacity 0.5s ease";
                resultDiv.style.opacity = "1";
            }, 50);
            
        } else {
            // Красивое сообщение об ошибке
            resultDiv.innerHTML = `
                <div class="result-header">
                    <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
                    <strong>Ошибка анализа</strong>
                </div>
                <div class="error-message">
                    <p style="color: #c0392b; padding: 15px; background: #f8d7da; border-radius: 5px; margin: 15px 0;">
                        ❌ ${data.error || "Неизвестная ошибка"}
                    </p>
                </div>
            `;
            resultDiv.style.display = "block";
            resultDiv.style.opacity = "1";
        }
    } catch (error) {
        // Ошибка подключения к серверу
        resultDiv.innerHTML = `
            <div class="result-header">
                <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
                <strong>Ошибка подключения</strong>
            </div>
            <div class="error-message">
                <p style="color: #c0392b; padding: 15px; background: #f8d7da; border-radius: 5px; margin: 15px 0;">
                    ❌ Не удалось подключиться к серверу. Убедитесь, что он запущен.
                </p>
            </div>
        `;
        resultDiv.style.display = "block";
        resultDiv.style.opacity = "1";
        console.error("Ошибка запроса:", error);
    } finally {
        // Возвращаем кнопку в исходное состояние
        btn.disabled = false;
        btn.textContent = originalBtnText;
    }
}