document.getElementById('signup-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('success-message');

  if (email) {
    msg.textContent = `You're in, ${email}. Welcome to the Phantom League.`;
    this.reset();
  }
});