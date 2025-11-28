from flask import Flask, request, jsonify, render_template
from transformers import pipeline
import os

# Убираем предупреждения
os.environ["TOKENIZERS_PARALLELISM"] = "false"

print("🔄 Загрузка модели эмоций... (это может занять 1-2 минуты при первом запуске)")
classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=False
)

app = Flask(__name__)

SPORT_RECOMMENDATIONS = {
    "anger": {
        "sport": "Бокс, скалолазание",
        "reason": "Помогает безопасно выплеснуть энергию и преобразовать агрессию в силу."
    },
    "fear": {
        "sport": "Йога, плавание",
        "reason": "Снижает тревожность, развивает внутреннее спокойствие и телесную осознанность."
    },
    "joy": {
        "sport": "Футбол, танцы",
        "reason": "Усиливает позитивное настроение и социальную вовлечённость."
    },
    "sadness": {
        "sport": "Бег, велосипед",
        "reason": "Стимулирует выработку эндорфинов и помогает выйти из подавленности."
    },
    "surprise": {
        "sport": "Паркур, фрисби",
        "reason": "Развивает гибкость мышления и способность к неожиданным решениям."
    },
    "neutral": {
        "sport": "Шахматы, гольф",
        "reason": "Подходит спокойному темпераменту, развивает стратегическое мышление."
    }
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    report_text = data.get('text', '').strip()

    if not report_text:
        return jsonify({"error": "Пожалуйста, введите текст отчёта"}), 400

    try:
        result = classifier(report_text)[0]
        emotion_label = result['label'].lower()
        confidence = round(result['score'], 3)

        rec = SPORT_RECOMMENDATIONS.get(emotion_label, SPORT_RECOMMENDATIONS["neutral"])

        return jsonify({
            "success": True,
            "emotion": emotion_label,
            "confidence": confidence,
            "sport": rec["sport"],
            "reason": rec["reason"]
        })
    except Exception as e:
        return jsonify({"error": f"Ошибка анализа: {str(e)}"}), 500

if __name__ == '__main__':
    print("🚀 Сервер запущен! Открой в браузере: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)