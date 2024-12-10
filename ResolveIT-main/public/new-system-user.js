 document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('systemUserForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting the default way
        const systemUserName = document.getElementById('systemUserName').value;
        const systemPassword = document.getElementById('systemPassword').value;
        const systemUserRole = document.getElementById('systemUserRole').value;
        const isChecked = document.getElementById("enable2fa").checked;
        
        //checking two-factor authorization
        let enable2fa = 0;
        if(isChecked){enable2fa=1;}
        
        // Prepare the data to send in the POST request
    
        const systemUserData = {
            username: systemUserName,  // Email is being used as the username
            password: systemPassword, 
            role: systemUserRole,
            enable2fa: enable2fa
        };
        // Make the POST request to create the new system user
        fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(systemUserData)
        })
        //if making new user fails throw error
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create system user');
            }
            return response.json();
        }) 
        .then(result => {
            document.getElementById('message').innerText = result.message || 'System user created successfully!';
            document.getElementById('systemUserForm').reset();
            window.location.href = 'ticketScreen.html';
        })
        .catch(error => {
            console.error('Error creating system user:', error);
            document.getElementById('message').innerText = 'Unable to create system user. Please try again later.';
        });
    

    });
});


