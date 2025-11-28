from flask import Flask, request, jsonify, render_template
from transformers import pipeline
import os

os.environ["TOKENIZERS_PARALLELISM"] = "false"

print("🔄 Загрузка модели эмоций... (1–2 минуты при первом запуске)")
classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=False
)

app = Flask(__name__)

SPORT_RECOMMENDATIONS = {
    "anger": {"sport": "Бокс, скалолазание", "reason": "Помогает безопасно выплеснуть энергию."},
    "fear": {"sport": "Йога, плавание", "reason": "Снижает тревожность и развивает спокойствие."},
    "joy": {"sport": "Футбол, танцы", "reason": "Усиливает позитивное настроение."},
    "sadness": {"sport": "Бег, велосипед", "reason": "Стимулирует выработку эндорфинов."},
    "surprise": {"sport": "Паркур, фрисби", "reason": "Развивает гибкость мышления."},
    "neutral": {"sport": "Шахматы, гольф", "reason": "Подходит спокойному темпераменту."}
}

# Главная страница — описание проекта
@app.route('/')
def home():
    return render_template('SignSport-1.0.html.html')

# Страница с нейросетью
@app.route('/analyze-page')
def analyze_page():
    return render_template('SignSport-1.0.html')

# API для анализа текста (вызывается из JavaScript)
@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    data = request.get_json()
    report_text = data.get('text', '').strip()

    if not report_text:
        return jsonify({"error": "Введите текст отчёта"}), 400

    try:
        result = classifier(report_text)[0]
        emotion = result['label'].lower()
        confidence = round(result['score'], 3)
        rec = SPORT_RECOMMENDATIONS.get(emotion, SPORT_RECOMMENDATIONS["neutral"])

        return jsonify({
            "success": True,
            "emotion": emotion,
            "confidence": confidence,
            "sport": rec["sport"],
            "reason": rec["reason"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Сайт запущен: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)