const swiper = new Swiper(".mySwiper", {
    slidesPerView: 5,
    centeredSlides: true,
    autoplay:true,
    loop: true,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: { 
        // when window width is >= 480px
        100: {
                slidesPerView: 1,
                spaceBetween: 15,
                centeredSlides: false
        },
        480: {
            slidesPerView: 2,
           spaceBetween: 10,
           autoplay: false, // Отключаем автопрокрутку
            pagination: false, // Отключаем пагинацию
            navigation: false // Отключаем стрелки
        },
        // when window width is >= 620px
        620: {
        pagination: false, // Отключаем пагинацию
        slidesPerView: 3,
        spaceBetween: 20,
          
        },
        // when window width is >= 930px
        930: {
            slidesPerView: 5,
            spaceBetween: 20
          },
       
      }
    });

// Получаем элементы
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("expandedImg");
const closeBtn = document.querySelector(".close");

// Функция для открытия модального окна
function openModal(imgSrc) {
    modal.style.display = "flex";
    modalImg.src = imgSrc;
    closeBtn.style.display = "none"; // Полностью скрываем кнопку
    document.body.style.overflow = "hidden";
    swiper.autoplay.stop(); // Останавливаем автопрокрутку слайдера
}

// Функция для закрытия модального окна
function closeModal() {
    modal.style.display = "none";
    closeBtn.style.display = "block"; // Показываем кнопку
    document.body.style.overflow = "";
    swiper.autoplay.start(); // Возобновляем автопрокрутку слайдера
}

// Открытие модального окна при клике на изображение
document.querySelectorAll('.swiper-slide img').forEach(img => {
    img.addEventListener('click', () => openModal(img.src));
});

// Закрытие по клику на крестик
closeBtn.addEventListener('click', closeModal);

// Закрытие по клику вне изображения
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
    // Закрытие по клику вне изображения ИЛИ по клику на само изображение
modal.addEventListener('click', (e) => {
    // Закрываем если кликнули либо на фон (modal), либо на само изображение (modalImg)
    if (e.target === modal || e.target === modalImg) {
        closeModal();
    }
});
});

// Дополнительно: закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === "flex") {
        closeModal();
    }
});