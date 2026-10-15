const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');
const dobInput = document.getElementById('dob');
if (dobInput) dobInput.max = new Date().toISOString().split('T')[0];

function showMessage(message) {
  registerMessage.textContent = message;
  registerMessage.style.display = 'block';
}
function checkBackendOrigin() {
  if (location.port !== '8080' || location.protocol === 'file:') {
    const message = 'Double-click START_CARENEST.bat and open http://localhost:8080/ (do not use Live Server).';
    showMessage(message);
    return false;
  }
  return true;
}
checkBackendOrigin();
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!checkBackendOrigin()) return;
  const get = (id) => document.getElementById(id).value.trim();
  if (get('password') !== get('confirmPassword')) return showMessage('Passwords do not match.');
  if (get('password').length < 8) return showMessage('Use at least 8 characters for your password.');
  const button = registerForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const response = await fetch('api/register', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({fullName:get('fullName'),dob:get('dob'),gender:get('gender'),email:get('email'),phone:get('phone'),address:get('address'),password:get('password'),role:get('role')})
    });
    const type = response.headers.get('content-type') || '';
    if (!type.includes('application/json')) throw new Error('Backend is not running. Double-click START_CARENEST.bat and open http://localhost:8080/register.html');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed.');
    window.location.assign(({patient:'patient-dashboard.html',doctor:'doctor-dashboard.html',admin:'admin.html',accountant:'accountant.html'})[data.user.role] || 'login.html');
  } catch (err) {
    showMessage(err instanceof TypeError ? 'Cannot contact backend. Double-click START_CARENEST.bat, then open http://localhost:8080/' : err.message);
    button.disabled = false;
  }
});
