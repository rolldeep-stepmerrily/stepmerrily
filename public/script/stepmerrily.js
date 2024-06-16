document.querySelectorAll('.accordion-header').forEach((header) => {
  header.addEventListener('click', () => {
    const openItem = document.querySelector('.accordion-header.active');
    if (openItem && openItem !== header) {
      openItem.classList.remove('active');
      openItem.nextElementSibling.style.display = 'none';
    }

    header.classList.toggle('active');
    const content = header.nextElementSibling;
    if (header.classList.contains('active')) {
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }
  });
});
