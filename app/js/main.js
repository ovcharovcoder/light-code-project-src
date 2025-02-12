// header
const navbar = document.querySelector('#header');

if (navbar) {
  window.addEventListener('scroll', () => {
    const shouldAddClass = window.scrollY > 100;
    navbar.classList.toggle('bg-color-primary-dark', shouldAddClass);
    navbar.classList.toggle('border-b', shouldAddClass);
    navbar.classList.toggle('border-color-grey', shouldAddClass);
  });
}

// Mobile menu
const hamburger = document.querySelector('#hamburger');
const menu = document.querySelector('#menu');
const faSolid = document.querySelector('.fa-solid');
const hLinks = document.querySelectorAll('.hLink');

if (hamburger && menu && faSolid) {
  hamburger.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    faSolid.classList.toggle('fa-xmark');
  });

  hLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      faSolid.classList.remove('fa-xmark');
    });
  });
}

// Testimonial
const userTexts = document.getElementsByClassName('user-text');
const userPics = document.getElementsByClassName('user-pic');

function showReview(event) {
  const target = event.target;

  if (!target.classList.contains('user-pic')) return;

  // Remove active classes
  for (let userPic of userPics) {
    userPic.classList.remove('active-pic');
  }
  for (let userText of userTexts) {
    userText.classList.remove('active-text');
  }

  const index = Array.from(userPics).indexOf(target);

  if (index !== -1) {
    userPics[index].classList.add('active-pic');
    userTexts[index].classList.add('active-text');
  }
}

// Attach event listeners to userPics
Array.from(userPics).forEach(pic => {
  pic.addEventListener('click', showReview);
});

// Pricing cards
const toggleBtn = document.getElementById('toggleBtn');
const cards = [
  { front: document.querySelector('#card_1_front'), back: document.querySelector('#card_1_back') },
  { front: document.querySelector('#card_2_front'), back: document.querySelector('#card_2_back') },
  { front: document.querySelector('#card_3_front'), back: document.querySelector('#card_3_back') },
];

if (toggleBtn) {
  toggleBtn.addEventListener('change', () => {
    cards.forEach(card => {
      if (card.front && card.back) {
        card.front.classList.toggle('-rotate-y-180');
        card.back.classList.toggle('rotate-y-180');
      }
    });
  });
}
 
