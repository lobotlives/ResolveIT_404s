document.addEventListener('DOMContentLoaded', function() {
    fetchCompanies();

    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const companyId = document.getElementById('companySelect').value;
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;

        const userData = {
            company_id: companyId,
            name: userName,
            email: userEmail
        };

        fetch('http://localhost:5000/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            return response.json();
        })
        .then(result => {
            document.getElementById('message').innerText = 'User created successfully';
            document.getElementById('userForm').reset();
            window.location.href = 'ticketScreen.html';

        })
        .catch(error => {
            console.error('Error creating user:', error);
            document.getElementById('message').innerText = 'Unable to create user. Please try again later.';
        });
    });
});

function fetchCompanies() {
    fetch('http://localhost:5000/companies')
        .then(response => response.json())
        .then(companies => {
            const companySelect = document.getElementById('companySelect');
            companies.forEach(company => {
                const option = document.createElement('option');
                option.value = company.id;
                option.textContent = company.name;
                companySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching companies:', error));
}
