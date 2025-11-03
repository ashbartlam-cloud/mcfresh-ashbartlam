// DOM Elements
const introVideo = document.getElementById('intro-video');
const scrollSection = document.querySelector('.scroll-anim');
const logo = document.querySelector('.scroll-logo');

// State
let videoPlayed = false;
let videoEnded = false;
let userScrolled = false;

// Play video on page load
if (introVideo) {
  // Start playing the video
  introVideo.play().catch(err => {
    console.log('Video autoplay prevented:', err);
  });
  
  // When video ends, freeze on last frame and show logo
  introVideo.addEventListener('ended', function() {
    videoEnded = true;
    videoPlayed = true;
    
    // Fade in logo if user hasn't scrolled yet
    if (!userScrolled) {
      logo.style.opacity = 1;
    }
  });
}

// Handle scroll events
function onScroll() {
  const rect = scrollSection.getBoundingClientRect();
  const scrollProgress = Math.max(0, -rect.top / window.innerHeight);
  
  // User has scrolled
  if (scrollProgress > 0.1) {
    userScrolled = true;
  }
  
  // Fade out logo when scrolling
  if (videoEnded && scrollProgress > 0.1) {
    const fadeProgress = Math.min((scrollProgress - 0.1) / 0.3, 1);
    logo.style.opacity = 1 - fadeProgress;
  }
}

// Optimized scroll handler with requestAnimationFrame
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Handle product videos playback
const productVideos = document.querySelectorAll('.product-video');
productVideos.forEach(video => {
  video.playbackRate = 1.0;
  video.defaultPlaybackRate = 1.0;
  
  // Prevent user from controlling the video
  video.addEventListener('ratechange', function() {
    if (video.playbackRate !== 1.0) {
      video.playbackRate = 1.0;
    }
  });
  
  // Ensure video plays
  video.play().catch(err => {
    console.log('Video autoplay prevented:', err);
  });
});

// Handle purchase button click
function handlePurchase(button) {
  if (button.classList.contains('purchased')) return;
  
  // Change text and add purchased class
  button.textContent = 'Added to Cart!';
  button.classList.add('purchased');
  
  // Disable button
  button.disabled = true;
  
  // Reset after 2 seconds
  setTimeout(() => {
    button.textContent = 'Add to Cart';
    button.classList.remove('purchased');
    button.disabled = false;
  }, 2000);
}

// Cart management
let cart = [];

function openOrderModal() {
  document.getElementById('orderModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Play all modal videos
  const modalVideos = document.querySelectorAll('.modal-video');
  modalVideos.forEach(video => {
    video.play().catch(err => console.log('Video play error:', err));
  });
  
  updateCartDisplay();
}

function closeOrderModal() {
  document.getElementById('orderModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function addToCartFromModal(flavor, type, price, button) {
  // Add animation
  button.textContent = '✓ Added!';
  button.classList.add('added');
  
  // Add to cart
  cart.push({ flavor, type, price });
  updateCartDisplay();
  
  // Reset button after delay
  setTimeout(() => {
    button.textContent = 'Add to Cart';
    button.classList.remove('added');
  }, 1500);
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #86868b; padding: 20px;">your cart is empty (for now)</p>';
    cartTotal.textContent = '0.00';
    return;
  }
  
  let html = '';
  let total = 0;
  
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item">
        <span>${item.flavor} - ${item.type}</span>
        <span>${item.price.toFixed(2)}</span>
      </div>
    `;
    total += item.price;
  });
  
  cartItems.innerHTML = html;
  cartTotal.textContent = total.toFixed(2);
}

function handleCheckout() {
  if (cart.length === 0) {
    alert('Add some drinks first!');
    return;
  }
  
  const email = document.getElementById('promoEmail').value;
  
  if (email && email.includes('@')) {
    alert(`Thanks for the email ${email}! 📧\n\nYou're signed up for deals (in theory).\n\nAnd thanks for pretending to buy our stuff! In real life, this would process your order. But since this is a demo, just know we appreciate you. 🍹`);
  } else {
    alert('Thanks for pretending to buy our stuff! 😄\n\nIn real life, this would take you to checkout. But since this is a demo, just know that we appreciate the thought.\n\n(Pro tip: Add your email for fake exclusive deals!)');
  }
  
  // Clear cart
  cart = [];
  updateCartDisplay();
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('orderModal');
  if (event.target == modal) {
    closeOrderModal();
  }
}