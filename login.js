function dashboardFor(role){return ({patient:'patient-dashboard.html',doctor:'doctor-dashboard.html',admin:'admin.html',accountant:'accountant.html'})[role] || 'login.html';}
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
function showLoginMessage(message) {loginMessage.textContent = message;loginMessage.style.display = 'block';}
function checkBackendOrigin() {
  if (location.port !== '8080' || location.protocol === 'file:') {
    const message = 'Double-click START_CARENEST.bat and open http://localhost:8080/ (do not use Live Server).';
    showLoginMessage(message);
    return false;
  }
  return true;
}
if (checkBackendOrigin()) {
  fetch('api/me').then(r => r.ok ? r.json() : null).then(d => {if(d?.user) location.replace(dashboardFor(d.user.role));}).catch(()=>{});
}
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!checkBackendOrigin()) return;
  const button = loginForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const response = await fetch('api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('email').value.trim(),password:document.getElementById('password').value,role:document.getElementById('role').value})});
    if (!(response.headers.get('content-type')||'').includes('application/json')) throw new Error('Java server not running. Use START_CARENEST.bat.');
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || 'Login failed');
    location.assign(dashboardFor(data.user.role));
  } catch(err) {
    showLoginMessage(err instanceof TypeError ? 'Cannot contact backend. Double-click START_CARENEST.bat, then open http://localhost:8080/' : err.message);
    button.disabled = false;
  }
});
