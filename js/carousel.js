document.addEventListener('DOMContentLoaded', function() {
  const images = [
    "https://rukminim2.flixcart.com/fk-p-flap/1010/170/image/11980ec333f6aa03.jpg?q=80",
    "https://rukminim2.flixcart.com/fk-p-flap/1010/170/image/1bd9f11edbf77427.jpg?q=80",
    "https://rukminim2.flixcart.com/fk-p-flap/1010/170/image/5b309e98775e22e4.jpg?q=80"
  ];

  let currentIndex = 0;
  const carouselImage = document.getElementById('carousel-image');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  function updateImage() {
    carouselImage.src = images[currentIndex];
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  }, 3000);

  updateImage();
});