document.addEventListener('DOMContentLoaded', () => {
  const reviews = document.querySelectorAll('.review');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentIndex = 0;

  // Показать текущий отзыв
  function updateReview() {
    reviews.forEach((review, index) => {
      review.classList.toggle('active', index === currentIndex);
    });
  }

  // Переключение вперёд
  function rightScroll() {
    currentIndex = (currentIndex + 1) % reviews.length;
    updateReview();
  }

  // Переключение назад
  function leftScroll() {
    currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    updateReview();
  }

  // Подключаем кнопки
  if (prevBtn) {
    prevBtn.addEventListener('click', leftScroll);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', rightScroll);
  }

  // Поддержка клавиатуры
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      leftScroll();
    } else if (event.key === 'ArrowRight') {
      rightScroll();
    }
  });

  // Инициализация: показать первый отзыв
  updateReview();
});