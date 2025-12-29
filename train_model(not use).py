"""
# train_model.py
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer
)
from datasets import load_dataset

# === 1. ДАННЫЕ ===
dataset = load_dataset("csv", data_files="train.csv", encoding="utf-8")

# === 2. МЕТКИ ===
SPORTS = [
    "Футбол", "Гандбол", "Водное поло", "Волейбол", "Плавание",
    "Фигурное катание", "Тяжелая атлетика", "Теннис",
    "Хоккей", "Фехтование", "Акробатика", "Шахматы", "Конный спорт"
]
label2id = {sport: i for i, sport in enumerate(SPORTS)}
id2label = {i: sport for i, sport in enumerate(SPORTS)}

# === 3. МОДЕЛЬ ===
model_name = "cointegrated/rubert-tiny2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=len(SPORTS),
    label2id=label2id,
    id2label=id2label
)

# === 4. ТОКЕНИЗАЦИЯ ===
def tokenize(batch):
    encodings = tokenizer(
        batch["text"],
        padding=True,
        truncation=True,
        max_length=128
    )
    labels = [label2id[label] for label in batch["label"]]
    encodings["labels"] = labels
    return encodings

tokenized = dataset.map(
    tokenize,
    batched=True,
    batch_size=32,
    remove_columns=["text", "label"]
)

# === 5. ОБУЧЕНИЕ ===
training_args = TrainingArguments(
    output_dir="signsport-model",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    save_strategy="no",
    logging_steps=10,
    report_to="none"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized["train"],
    tokenizer=tokenizer
)

print("🚀 Обучение началось...")
trainer.train()

# === 6. СОХРАНЕНИЕ ===
model.save_pretrained("signsport-model")
tokenizer.save_pretrained("signsport-model")
print("✅ Модель сохранена в папку 'signsport-model'")
"""