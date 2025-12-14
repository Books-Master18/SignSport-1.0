async function runAnalysis() {
    const text = document.getElementById("reportInput").value.trim();
    if (!text) {
        alert("Пожалуйста, введите описание характера");
        return;
    }

    const btn = document.querySelector(".analyze-button");
    const resultDiv = document.getElementById("result");
    const originalBtnText = btn.textContent;
    
    btn.disabled = true;
    btn.textContent = "Анализ...";
    
    // Очищаем предыдущие результаты
    resultDiv.style.display = "none";
    resultDiv.innerHTML = "";

    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        if (data.success) {
            // Создаем HTML для результатов
            let resultHTML = `
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
            
            // Плавное появление
            setTimeout(() => {
                resultDiv.style.opacity = "1";
            }, 100);
            
        } else {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <p style="color: #c0392b; padding: 15px; background: #f8d7da; border-radius: 5px;">
                        ❌ Ошибка: ${data.error}
                    </p>
                </div>
            `;
            resultDiv.style.display = "block";
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="error-message">
                <p style="color: #c0392b; padding: 15px; background: #f8d7da; border-radius: 5px;">
                    ❌ Не удалось подключиться к серверу. Убедитесь, что он запущен.
                </p>
            </div>
        `;
        resultDiv.style.display = "block";
        console.error("Ошибка запроса:", error);
    } finally {
        btn.disabled = false;
        btn.textContent = originalBtnText;
    }
}