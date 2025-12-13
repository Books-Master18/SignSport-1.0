// Получаем все элементы отзывов
const reviews = document.querySelectorAll('.review');
let currentIndex = 0;

// Функция отображения текущего текста
function showReview(index) {
  reviews.forEach((review, i) => {
    review.classList.toggle('active', i === index);
  });
}

// Кнопка "Назад"
document.getElementById('prevBtn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
  showReview(currentIndex);
});

// Кнопка "Вперёд"
document.getElementById('nextBtn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % reviews.length;
  showReview(currentIndex);
});