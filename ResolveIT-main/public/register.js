document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    //clear after every error
    errorMessage.textContent = '';
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; // Regular expression for email validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>?,.\/\\|-])[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>?,.\/\\|-]+$/; // Alphanumeric
    if (password.length < 5 || password.length > 100 ) {
        e.preventDefault(); 
        errorMessage.textContent = `Password must be at least 5-100 characters long.`;
        
            
    }else if (!emailPattern.test(username)) {
        e.preventDefault(); 
        errorMessage.textContent = 'Please enter a valid email address.';
    }else if (!passwordPattern.test(password)) {
        e.preventDefault(); 
        errorMessage.textContent = 'Password must include at least one letter, number, and a special character.';
    }else {

    
        const registerData = { username, password };

        fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.message) {
                alert(result.message); // Show success message
                window.location.href = 'ticketScreen.html';
            
        } else {
            // Show error message
            document.getElementById('errorMessage').innerText = result.error;
        }
    })
    .catch(error => console.error('Error:', error));
   }
});
