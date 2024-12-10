document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();




const username = document.getElementById('username').value;
const password = document.getElementById('password').value;
    //create data for login
const loginData = { username, password };

    
fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
})

    

    
.then(response => response.json())
.then(result => {
    //redirect to two factor authentication
    if(result.message === 'Redirecting to 2FA'){
        sessionStorage.setItem('userId', result.userId);
        sessionStorage.setItem('role', result.role);
        sessionStorage.setItem('qrCode', result.qrCode);
        window.location.href = 'two-factor-verify.html'; //redirect
    }              
    if (result.message === 'Login successful') {
        // Redirect to main dashboard or save authentication state
        window.location.href = 'ticketScreen.html'; // Redirect to dashboard
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('role', result.role);
    }else {
        // Show error message
        document.getElementById('errorMessage').innerText = result.error;
    }
})
    .catch(error => console.error('Error:', error));
   
});
