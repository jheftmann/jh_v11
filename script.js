document.addEventListener('DOMContentLoaded', function() {
  console.log('Site loaded and ready!');

  // Store original HTML content for each section from the HTML
  document.querySelectorAll('.expandable-section').forEach(section => {
    const content = section.querySelector('.content');
    // Store original HTML content in a data attribute
    section.dataset.fullHtml = content.innerHTML;
    // Clear initial content in HTML and ensure it's hidden
    content.innerHTML = '';
    content.hidden = true;
  });

  // Function to handle the typing animation
  // Takes element, plain text to type, and a callback for completion
  function typeWriter(element, plainText, callback) {
    let i = 0;
    element.textContent = ''; // Clear existing content using textContent
    element.hidden = false; // Make element visible
    const speed = 20; // Typing speed in milliseconds

    function type() {
      if (i < plainText.length) {
        element.textContent += plainText.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        // Animation finished, execute callback with a small delay
        setTimeout(() => {
          if (callback) {
            callback();
          }
        }, 50); // Small delay (kept for now, can be removed if layout is stable)
      }
    }
    type();
  }

  // Function to get plain text from HTML
  function getPlainText(html) {
      const div = document.createElement('div');
      div.innerHTML = html;
      // Using textContent is generally reliable for getting plain text
      return div.textContent || '';
  }

  // Handle all expandable sections
  document.querySelectorAll('.expandable-section').forEach(section => {
    const trigger = section.querySelector('.trigger');
    const contentElement = section.querySelector('.content');
    const fullHTMLContent = section.dataset.fullHtml; // Get stored full HTML from data attribute
    const plainTextContent = getPlainText(fullHTMLContent);

    // Handle initial click to expand
    trigger.addEventListener('click', function() {
      if (contentElement.hidden) {
        // Animate plain text, then insert full HTML
        typeWriter(contentElement, plainTextContent, function() {
            contentElement.innerHTML = fullHTMLContent; // Insert full HTML after typing
        });
      }
    });
  });

  // Re-delegate click handling for expand links on the whole document
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('expand-link')) {
      const href = e.target.getAttribute('href');
      
      // ONLY prevent default if the href is #. Allow normal link behavior otherwise.
      if (href === '#') {
        e.preventDefault();
        const section = e.target.closest('.expandable-section');

        // Example of adding new content dynamically
        const newContentHTML = ' This is additional content that could be loaded dynamically... <a href="#" class="expand-link">Another link</a>'; // Define new content HTML
        const newContentElement = document.createElement('span');
        newContentElement.className = 'content';
        
        // Store full HTML on the new element
        newContentElement.dataset.fullHtml = newContentHTML;

        // Append the new element immediately (hidden)
        section.appendChild(newContentElement);
        newContentElement.hidden = true; // Ensure it's hidden initially

        const newPlainText = getPlainText(newContentHTML); // Get plain text for animation

        // Animate new content plain text, then insert full HTML
        typeWriter(newContentElement, newPlainText, function() {
            newContentElement.innerHTML = newContentHTML; // Insert full HTML after typing
        });

      } else {
        // Handle as normal link (target="_blank" in HTML will handle new tab)
        // No need to call window.location.href here because preventDefault is not called.
      }
    }
  });
}); 