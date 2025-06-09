document.addEventListener('DOMContentLoaded', function() {
  console.log('Site loaded and ready!');

  // --- Test Mode Toggle ---
  // Set to true to disable animations and show all content immediately for styling.
  // Set to false for normal behavior.
  const testMode = false;
  //const testMode = true;
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

  // Function to manage the section state (open/closed, trigger number, and is-open class)
  function setSectionOpenState(section, isOpen) {
      console.log(`setSectionOpenState called for section: ${section.querySelector('.trigger').textContent.trim()}, isOpen: ${isOpen}`);
      const firstContent = section.querySelector('.content:not(.sub-content)');
      if (!firstContent) {
        console.log('setSectionOpenState: No first content found.');
        return;
      }

      if (isOpen) {
          firstContent.hidden = false;
          section.classList.add('is-open');
          console.log(`setSectionOpenState: Added is-open class. Current classes: ${section.classList}`);
      } else {
          firstContent.hidden = true;
          firstContent.innerHTML = ''; // Clear content when hiding
          section.classList.remove('is-open');
          console.log(`setSectionOpenState: Removed is-open class. Current classes: ${section.classList}`);

          // Also hide any sub-content and reset styles in the section being closed
          section.querySelectorAll('.content.sub-content').forEach(subContent => {
              subContent.hidden = true;
              subContent.innerHTML = '';
          });
          section.querySelectorAll('.content').forEach(contentBlock => {
               contentBlock.style.color = '';
               contentBlock.classList.remove('is-old-paragraph');
               contentBlock.querySelectorAll('a').forEach(link => {
                   link.style.color = '';
               });
          });
      }
      console.log('setSectionOpenState finished.');
  }

    // If in test mode, show the first content span for each section immediately
    if (testMode) {
        console.log('Test mode is ENABLED.');
        document.querySelectorAll('.expandable-section').forEach(section => {
            // In test mode, set the initial state to open
            setSectionOpenState(section, true);
             // The test mode logic for expanding subsequent sections is handled in the click delegate
        });
    } else {
         console.log('Test mode is DISABLED.');
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
    console.log('Processing expandable section...');
    const trigger = section.querySelector('.trigger');
    const firstContentElement = section.querySelector('.content:not(.sub-content)'); // Target the first content span

    if (!firstContentElement) return; // Should not happen if structure is correct

    const fullHTMLContent = firstContentElement.dataset.fullHtml; // Get stored full HTML from data attribute
    const plainTextContent = getPlainText(fullHTMLContent);

    // Handle initial click to expand
    trigger.addEventListener('click', function() {
      console.log(`Trigger clicked for section: ${section.querySelector('.trigger').textContent.trim()}`);
      // Before expanding, hide any other open sections
      document.querySelectorAll('.expandable-section').forEach(otherSection => {
        if (otherSection !== section) { // Don't close the clicked section on initial pass
           // Check if the other section is open before closing it
           if (otherSection.classList.contains('is-open')) {
             console.log(`Closing other section: ${otherSection.querySelector('.trigger').textContent.trim()}`);
             setSectionOpenState(otherSection, false); // Close the other section
           }
        }
      });

      // Toggle the state of the clicked section
      // Only toggle if not in test mode OR if the section is currently hidden in test mode
      // In test mode, clicking an open section should close it.
      if (!testMode && firstContentElement.hidden) {
          console.log('Click handler: Opening section with animation.');
          // Normal opening with animation
          setSectionOpenState(section, true);
          // We need to handle the typing animation after setting state to open visually
          // Temporarily clear content for typing animation AFTER setting state to open
          firstContentElement.innerHTML = ''; // Clear for typing
          typeWriter(firstContentElement, plainTextContent, function() {
              firstContentElement.innerHTML = fullHTMLContent; // Insert full HTML after typing
              console.log(`Typing animation finished for section: ${section.querySelector('.trigger').textContent.trim()}`);
          });

      } else if (testMode) {
           console.log('Click handler: Toggling section in test mode.');
           // In test mode, toggle based on is-open class instead of hidden state
           const isCurrentlyOpen = section.classList.contains('is-open');
           setSectionOpenState(section, !isCurrentlyOpen);
           // If opening in test mode, restore content immediately
           if (!isCurrentlyOpen) {
                firstContentElement.innerHTML = fullHTMLContent;
           }
      } else if (!firstContentElement.hidden) {
          console.log('Click handler: Closing already open section.');
          // If not in test mode and clicking an open section, close it
           setSectionOpenState(section, false);
      }
      console.log('Click handler finished.');
    });

    // The hover effect is now handled purely by CSS.

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
                        // No need to add is-open here, it's for the main section trigger.
                     });
                } else {
                    // In test mode, show immediately and set content
                    nextContentElement.hidden = false;
                    nextContentElement.innerHTML = fullHTMLContent;
                    // No need to add is-open here, it's for the main section trigger.
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

  // --- Information Overlay Logic ---
  const informationOverlay = document.getElementById('information-overlay');
  const navInfoLink = document.querySelector('.nav-info a');
  // Refactored to target elements within the single .nav
  const mainNav = document.querySelector('.nav');
  const closeButton = document.querySelector('.close-button');
  const overlayContent = informationOverlay.querySelector('.overlay-content');
  // const overlayNavHome = mainNav.querySelector('.nav-home'); // This will now refer to the same nav-home element
  // const overlayNavInfo = mainNav.querySelector('.nav-info'); // This will now refer to the same nav-info element

  console.log('navInfoLink:', navInfoLink);
  console.log('closeButton:', closeButton);
  console.log('Initial informationOverlay display:', getComputedStyle(informationOverlay).display);
  console.log('Initial informationOverlay pointer-events:', getComputedStyle(informationOverlay).pointerEvents);

  function openInformationOverlay() {
    // Close any currently open expandable sections
    document.querySelectorAll('.expandable-section.is-open').forEach(openSection => {
      setSectionOpenState(openSection, false);
    });

    // Remove text-black classes from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('text-black');
    });

    document.body.classList.add('information-open');
    // Let CSS handle display, visibility, and pointer-events

    // Update URL to denote that the information layer is revealed
    // (This will be implemented in a future task based on issue #4)
  }

  function closeInformationOverlay() {
    console.trace('closeInformationOverlay called.'); // Add console.trace here
    
    // Add back text-black classes to nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.add('text-black');
    });

    document.body.classList.remove('information-open');
    // Let CSS handle display, visibility, and pointer-events after transition

    // Update URL to remove information layer indicator
    // (This will be implemented in a future task based on issue #4)
  }

  // Event listener for opening the information overlay
  if (navInfoLink) {
    navInfoLink.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default link behavior
      if (document.body.classList.contains('information-open')) {
        closeInformationOverlay();
      } else {
        openInformationOverlay();
      }
    });
  }

  // Event listener for closing the information overlay
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      closeInformationOverlay();
    });
  }
  console.log('Setting up close button listener. closeButton is:', closeButton);
  // --------------------------------
}); 