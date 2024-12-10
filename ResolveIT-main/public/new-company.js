document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('companyForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const companyName = document.getElementById('companyName').value;
        const companyAddress = document.getElementById('companyAddress').value;

        const companyData = {
            name: companyName,
            address: companyAddress
        };

        fetch('http://localhost:5000/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(companyData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create company');
            }
            return response.json();
        })
        .then(result => {
            document.getElementById('message').innerText = 'Company created successfully';
            document.getElementById('companyForm').reset();
            window.location.href = 'ticketScreen.html';

        })
        .catch(error => {
            console.error('Error creating company:', error);
            document.getElementById('message').innerText = 'Unable to create company. Please try again later.';
        });
    });
});
