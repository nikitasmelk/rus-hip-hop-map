 // Adjust card position if its edges fall outside the viewport.
 function adjustCardPosition(card, item) {
  const cardRect = card.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  // For bottom cards: if the bottom edge is below the viewport...
  if (item.classList.contains('bottom')) {
    if (cardRect.bottom > viewportHeight) {
      let overflow = cardRect.bottom - viewportHeight;
      // Get the current numeric top value
      let computedTop = parseFloat(getComputedStyle(card).top);
      // Adjust top upward so the bottom edge lines up with viewport bottom minus a 5px margin.
      card.style.top = (computedTop - overflow - 5) + "px";
    }
  }
  // For top cards: if the top edge is above the viewport...
  if (item.classList.contains('top')) {
    if (cardRect.top < 0) {
      let overflow = 0 - cardRect.top;
      let computedBottom = parseFloat(getComputedStyle(card).bottom);
      card.style.bottom = (computedBottom - overflow - 5) + "px";
    }
  }
}

// Fetch and render timeline events from events.json
async function loadTimeline() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error('Failed to fetch events data');
    }
    let events = await response.json();
    if (!Array.isArray(events)) {
      events = [events];
    }
    // Sort events chronologically (from earliest to latest)
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const timelineInner = document.getElementById('timeline-inner');
    
    events.forEach((event, index) => {
      // Create the timeline item container.
      // Alternate vertical position: even-index events are "top", odd-index events are "bottom".
      const item = document.createElement('div');
      item.className = 'timeline-item ' + (index % 2 === 0 ? 'top' : 'bottom');
      
      // Create the event card.
      const card = document.createElement('div');
      card.className = 'timeline-card';
      
      // Add album cover image if available.
      if (event.album_cover) {
        const img = document.createElement('img');
        img.src = event.album_cover;
        img.alt = event.title_en;
        card.appendChild(img);
      }
      
      // Add event year.
      const yearDiv = document.createElement('div');
      yearDiv.className = 'year';
      yearDiv.textContent = event.year;
      card.appendChild(yearDiv);
      
      // Add event title.
      const titleDiv = document.createElement('div');
      titleDiv.className = 'title';
      titleDiv.textContent = event.title_en;
      card.appendChild(titleDiv);
      
      // Create a toggle button.
      const toggleButton = document.createElement('button');
      toggleButton.className = 'toggle-button';
      toggleButton.textContent = 'Read More';
      card.appendChild(toggleButton);
      
      // Create a container for the extra content (description and source).
      const extraContent = document.createElement('div');
      extraContent.className = 'extra-content';
      
      // Add event description.
      const descDiv = document.createElement('div');
      descDiv.className = 'description';
      descDiv.textContent = event.description_en;
      extraContent.appendChild(descDiv);
      
      // Add source link (if provided).
      if (event.source && event.source.length >= 2) {
        const linkEl = document.createElement('a');
        linkEl.href = event.source[1];
        linkEl.target = '_blank';
        linkEl.textContent = event.source[0]; // e.g., "wikipedia"
        extraContent.appendChild(linkEl);
      }
      
      // Append the extra content to the card.
      card.appendChild(extraContent);
      
      // Toggle extra content visibility when the button is clicked.
      toggleButton.addEventListener('click', () => {
        if (extraContent.style.display === 'none' || extraContent.style.display === '') {
          extraContent.style.display = 'block';
          toggleButton.textContent = 'Show Less';
        } else {
          extraContent.style.display = 'none';
          toggleButton.textContent = 'Read More';
        }
        // After toggling, adjust the card position if needed.
        adjustCardPosition(card, item);
      });
      
      // Append the card into the timeline item.
      item.appendChild(card);
      
      // Add the timeline dot.
      const dot = document.createElement('div');
      dot.className = 'timeline-dot';
      item.appendChild(dot);
      
      // Append the item to the inner container.
      timelineInner.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading timeline:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadTimeline);