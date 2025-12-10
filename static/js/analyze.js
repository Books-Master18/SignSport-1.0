async function runAnalysis() {
    const text = document.getElementById("reportInput").value.trim();
    if (!text) {
        alert("Пожалуйста, введите описание характера");
        return;
    }

    const btn = document.querySelector(".analyze-button");
    btn.disabled = true;
    btn.textContent = "Анализ...";

    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById("recommendedSport").textContent = data.sport;
            document.getElementById("confidence").textContent = data.confidence || "—";
            document.getElementById("reasonText").textContent = data.reason;
            document.getElementById("result").style.display = "block";
        } else {
            document.getElementById("result").innerHTML = `<p style="color: #c0392b;">❌ Ошибка: ${data.error}</p>`;
            document.getElementById("result").style.display = "block";
        }
    } catch (error) {
        document.getElementById("result").innerHTML = 
            `<p style="color: #c0392b;">❌ Не удалось подключиться к серверу. Убедитесь, что он запущен.</p>`;
        document.getElementById("result").style.display = "block";
    } finally {
        btn.disabled = false;
        btn.textContent = "Получить рекомендацию";
    }
}