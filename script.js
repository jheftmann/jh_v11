document.addEventListener('DOMContentLoaded', function() {
  console.log('Site loaded and ready!');

  const topLeft = document.querySelector('.top-left');
  const topRight = document.querySelector('.top-right');
  const topLeftText = document.querySelector('.top-left-text');
  const topRightText = document.querySelector('.top-right-text');

  function typeWriter(element, text) {
    let i = 0;
    element.textContent = ''; // Clear existing text
    element.hidden = false; // Make element visible
    const speed = 20; // Typing speed in milliseconds

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  topLeft.addEventListener('click', function() {
    if (topLeftText.hidden) {
        typeWriter(topLeftText, topLeftText.textContent);
    }
  });

  topRight.addEventListener('click', function() {
    if (topRightText.hidden) {
        typeWriter(topRightText, topRightText.textContent);
    }
  });
}); 