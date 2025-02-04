document.addEventListener('DOMContentLoaded', function () {
    // Find the .topbar-wrapper element
    const topbarWrapper = document.querySelector('.topbar-wrapper');
  
    // Create a new <img> element for the logo
    const logoElement = document.createElement('img');
    logoElement.src = '/logo.png'; // Path to your logo
    logoElement.alt = 'Logo';
    logoElement.style.width = 'auto';
    logoElement.style.height = 'auto';
  
    // Insert the logo into the .topbar-wrapper
    if (topbarWrapper) {
      topbarWrapper.insertBefore(logoElement, topbarWrapper.firstChild);
    }
  });