const wheel = document.querySelector('.demo');
const colorDisplay = document.querySelector('#selectedColor');

wheel.addEventListener('click', function(e) {
    // Get click coordinates relative to wheel
    const rect = wheel.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    
    // Calculate angle and distance from center
    const angle = Math.atan2(y, x);
    const distance = Math.sqrt(x*x + y*y);
    
    // Convert angle to hue (0-360)
    let hue = (angle * 180/Math.PI + 360) % 360;
    
    // Calculate saturation based on distance from center (0-100)
    const maxDistance = rect.width/2;
    const saturation = Math.min((distance/maxDistance) * 100, 100);
    
    // Create color string
    const color = `hsl(${hue}, ${saturation}%, 50%)`;
    
    // Display the selected color
    colorDisplay.style.backgroundColor = color;
    colorDisplay.textContent = color;
});