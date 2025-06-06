document.addEventListener('DOMContentLoaded', function() {
  console.log('Site loaded and ready!');

  // --- Test Mode Toggle ---
  // Set to true to disable animations and show all content immediately for styling.
  // Set to false for normal behavior.
  const testMode = false;
  // ------------------------

  // Store original HTML content for all .content sections from the HTML
  document.querySelectorAll('.expandable-section .content').forEach(content => {
    // Store original HTML content in a data attribute on the content element itself
    content.dataset.fullHtml = content.innerHTML;

    // Clear initial content in HTML and ensure it's hidden ONLY if not in test mode
    // The *first* content span within a section is shown by clicking the trigger.
    // Subsequent .content spans are hidden until their preceding link is clicked.
    // So, hide all content spans initially unless in test mode.
    if (!testMode) {
        content.innerHTML = '';
        content.hidden = true;
    } else {
        // If in test mode, ensure content is visible immediately
        content.hidden = false;
    }
  });

    // If in test mode, show the first content span for each section immediately
    if (testMode) {
        document.querySelectorAll('.expandable-section').forEach(section => {
            const firstContent = section.querySelector('.content');
            if (firstContent) {
                firstContent.hidden = false;
            }
        });
    }

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

  // Handle all expandable sections (initial click on trigger)
  document.querySelectorAll('.expandable-section').forEach(section => {
    const trigger = section.querySelector('.trigger');
    const firstContentElement = section.querySelector('.content:not(.sub-content)'); // Target the first content span

    if (!firstContentElement) return; // Should not happen if structure is correct

    const fullHTMLContent = firstContentElement.dataset.fullHtml; // Get stored full HTML from data attribute
    const plainTextContent = getPlainText(fullHTMLContent);

    // Handle initial click to expand
    trigger.addEventListener('click', function() {
      // Before expanding, hide any other open sections
      document.querySelectorAll('.expandable-section').forEach(otherSection => {
        if (otherSection !== section) { // Don't hide the currently clicked section
          const otherContent = otherSection.querySelector('.content:not(.sub-content)');
          if (otherContent && !otherContent.hidden) {
            otherContent.hidden = true;
            otherContent.innerHTML = ''; // Clear content when hiding

            // Also hide any sub-content in the other section
            otherSection.querySelectorAll('.content.sub-content').forEach(subContent => {
                subContent.hidden = true;
                subContent.innerHTML = ''; // Clear content when hiding
            });

            // Reset color and class for the previously open content blocks in the other section
            otherSection.querySelectorAll('.content').forEach(contentBlock => {
                 contentBlock.style.color = ''; // Remove inline color
                 contentBlock.classList.remove('is-old-paragraph'); // Remove class
                 // Reset link colors within this block if they were changed
                 contentBlock.querySelectorAll('a').forEach(link => {
                     link.style.color = ''; // Remove inline color
                 });
            });
          }
        }
      });

      // Only animate if not in test mode AND content is hidden
      if (!testMode && firstContentElement.hidden) {
        typeWriter(firstContentElement, plainTextContent, function() {
            firstContentElement.innerHTML = fullHTMLContent; // Insert full HTML after typing
        });
      } else if (testMode) {
        // In test mode, just toggle visibility of the first content element
        firstContentElement.hidden = !firstContentElement.hidden;
        if (!firstContentElement.hidden) {
             firstContentElement.innerHTML = fullHTMLContent;
        } else {
             firstContentElement.innerHTML = '';
        }
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

        // Find the parent content block of the clicked link
        const currentContentBlock = e.target.closest('.content');
        if (!currentContentBlock) return; // Should not happen

        // Find the parent expandable section
        const parentExpandableSection = currentContentBlock.closest('.expandable-section');
        if (!parentExpandableSection) return; // Should not happen

        // Get all content elements within this section
        const allContentElementsInSection = parentExpandableSection.querySelectorAll('.content');

        // Find the index of the current content block in the list
        let currentIndex = -1;
        for (let i = 0; i < allContentElementsInSection.length; i++) {
            if (allContentElementsInSection[i] === currentContentBlock) {
                currentIndex = i;
                break;
            }
        }

        // If the current content block was found and there is a next one
        if (currentIndex !== -1 && currentIndex + 1 < allContentElementsInSection.length) {
            const nextContentElement = allContentElementsInSection[currentIndex + 1];

            // If a next hidden content element is found
            if (nextContentElement && nextContentElement.hidden) {
                 const fullHTMLContent = nextContentElement.dataset.fullHtml; // Get stored full HTML
                 const plainTextContent = getPlainText(fullHTMLContent);

                // Animate new content plain text, then insert full HTML ONLY if not in test mode
                if (!testMode) {
                     nextContentElement.hidden = true; // Ensure hidden initially for animation
                     typeWriter(nextContentElement, plainTextContent, function() {
                        nextContentElement.innerHTML = fullHTMLContent; // Insert full HTML after typing
                     });
                } else {
                    // In test mode, show immediately and set content
                    nextContentElement.hidden = false;
                    nextContentElement.innerHTML = fullHTMLContent;
                }

                // --- Change color of the current paragraph and its links to lighter gray and add class ---
                currentContentBlock.style.color = '#D5D5D5';
                currentContentBlock.classList.add('is-old-paragraph');
                const currentContentLinks = currentContentBlock.querySelectorAll('a');
                currentContentLinks.forEach(link => {
                    link.style.color = '#D5D5D5';
                });
                // ------------------------------------------------------------------------
            }
        }


      } else {
        // Handle as normal link (target="_blank" in HTML will handle new tab)
        // No need to call window.location.href here because preventDefault is not called.
      }
    }
  });

  // If in test mode, ensure all .content elements are made visible initially.
  // This is handled in the initial loop processing all .content elements.
}); 