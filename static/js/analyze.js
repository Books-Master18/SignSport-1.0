async function runAnalysis() {
            const text = document.getElementById("reportInput").value.trim();
            if (!text) {
                alert("Пожалуйста, введите текст отчёта");
                return;
            }

            const btn = event.target;
            btn.disabled = true;
            btn.textContent = "Анализ...";

            try {
                const response = await fetch("/api/analyze", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ text: text })
                });

                const data = await response.json();

                const resultDiv = document.getElementById("result");
                if (data.success) {
                    resultDiv.innerHTML = `
                        <h3>✅ Рекомендация готова!</h3>
                        <p><strong>Обнаруженная эмоция:</strong> ${data.emotion} (уверенность: ${(data.confidence * 100).toFixed(1)}%)</p>
                        <p><strong>Рекомендуемый вид спорта:</strong> <strong>${data.sport}</strong></p>
                        <p><em>${data.reason}</em></p>
                    `;
                } else {
                    resultDiv.innerHTML = `<p style="color: #c0392b;">❌ Ошибка: ${data.error}</p>`;
                }
                resultDiv.style.display = "block";
            } catch (error) {
                document.getElementById("result").innerHTML = 
                    `<p style="color: #c0392b;">❌ Не удаётся подключиться к нейросети. Убедитесь, что сервер запущен.</p>`;
                document.getElementById("result").style.display = "block";
            } finally {
                btn.disabled = false;
                btn.textContent = "Получить рекомендацию";
            }
        }