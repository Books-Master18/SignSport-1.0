from flask import Flask, request, jsonify, render_template
from transformers import pipeline
import os

# Отключаем предупреждения
os.environ["TOKENIZERS_PARALLELISM"] = "false"

SPORT_PROFILES = {
    "high anxiety and internal tension": {
        "sport": "Yoga, swimming, tai chi",
        "reason": "У человека в с высоким уровнем тревожности и внутренним напряжением наблюдается нарушение микроструктуры почерка (дрожание, сжатость). Рекомендуются виды спорта, снижающие тонус нервной системы и развивающие осознанность: йога, плавание."
    },
    "impulsivity and low self-regulation": {
        "sport": "Boxing, rock climbing, karate",
        "reason": "Для импульсивных личностей с низкой саморегуляцией рекомендуются боевые виды спорта, которые структурируют энергию и развивают контроль в действии. Это соответствует доминированию движения над формой в графологическом профиле."
    },
    "extraversion and social orientation": {
        "sport": "Football, volleyball, basketball, dance",
        "reason": "Экстраверты с выраженной социальной направленностью достигают лучших результатов в командных видах спорта, где важны взаимодействие и совместная активность."
    },
    "calmness, analytical thinking and balance": {
        "sport": "Chess, golf, table tennis, shooting",
        "reason": "Спокойные, аналитические личности с уравновешенной нервной системой преуспевают в индивидуальных стратегических видах спорта, требующих концентрации и точности."
    },
    "low energy and apathy": {
        "sport": "Running, cycling, walking outdoors",
        "reason": "При сниженном тонусе и апатии рекомендуются ритмичные кардионагрузки, мягко стимулирующие выработку эндорфинов и возвращающие ощущение лёгкости."
    },
    "artistry and creativity": {
        "sport": "Figure skating, artistic gymnastics, synchronized swimming",
        "reason": "Творческие, артистичные личности раскрываются в эстетических видах спорта, где важны выразительность, пластичность и художественное воплощение."
    },
    "willpower and determination": {
        "sport": "Weightlifting, high jump, artistic gymnastics",
        "reason": "Личности с высокой волевой регуляцией (целеустремлённость, настойчивость) достигают успеха в видах спорта, требующих преодоления трудностей и максимального усилия."
    }
}

# ✅ 2. Список категорий — из SPORT_PROFILES
CATEGORIES = list(SPORT_PROFILES.keys())

# ✅ 3. Теперь загружаем модель
print("🔄 Загрузка Zero-Shot модели (typeform/distilbert-base-uncased-mnli)...")
print("⚠️  Первый запуск займёт 1–2 минуты (модель ~250 МБ)...")

try:
    classifier = pipeline(
        "zero-shot-classification",
        model="typeform/distilbert-base-uncased-mnli",
        device=-1  # CPU
    )
    MODEL_READY = True
    print("✅ Zero-Shot модель успешно загружена!")
except Exception as e:
    print(f"❌ Ошибка загрузки модели: {e}")
    classifier = None
    MODEL_READY = False

# ✅ 4. Создаём Flask-приложение
app = Flask(__name__)

# Главная страница
@app.route('/')
def home():
    return render_template('SignSport-1.0.html')

# Страница анализа
@app.route('/analyze-page')
def analyze_page():
    return render_template('neural_network.html')

# Zero-Shot API
@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    if not MODEL_READY:
        return jsonify({
            "success": False,
            "error": "Модель не загружена. Проверьте интернет и перезапустите сервер."
        }), 500

    try:
        data = request.get_json()
        report_text = data.get('text', '').strip()

        if not report_text:
            return jsonify({"error": "Введите текст отчёта"}), 400

        # Анализ через Zero-Shot
        result = classifier(report_text, CATEGORIES)
        top_category = result['labels'][0]
        confidence = round(result['scores'][0], 3)

        # ✅ Используем SPORT_PROFILES, а не несуществующую переменную
        rec = SPORT_PROFILES[top_category]

        return jsonify({
            "success": True,
            "category": top_category,
            "confidence": confidence,
            "sport": rec["sport"],
            "reason": rec["reason"]
        })

    except Exception as e:
        return jsonify({"error": f"Ошибка анализа: {str(e)}"}), 500

# Запуск сервера
if __name__ == '__main__':
    print("\n" + "="*50)
    print("✅ SignSport запущен!")
    print("👉 Перейдите по ссылке: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)