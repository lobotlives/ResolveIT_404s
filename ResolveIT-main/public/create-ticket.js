document.addEventListener('DOMContentLoaded', function() {
    clearAllFields(); // Clear fields on page load
    fetchCompanies(); // Populate the companies dropdown on page load
    fetchUsers(); // Populate the users dropdown on page load

    // Add event listener for when a company is selected
    const companySelect = document.getElementById('companySelect');
    if (companySelect) {
        companySelect.addEventListener('change', function() {
            const companyId = this.value;
            const customerSelect = document.getElementById('customerSelect');

            if (companyId) {
                customerSelect.disabled = true; // Disable until customers are loaded
                fetchCustomers(companyId);  // Fetch customers only if a company is selected
            } else {
                customerSelect.innerHTML = '<option value="">Select Customer</option>';
                customerSelect.disabled = true;
                clearContactDetails(); // Clear email and phone fields if no company is selected
            }
        });
    }

    // Add event listener for when a customer is selected to auto-fill the email and phone number
    const customerSelect = document.getElementById('customerSelect');
    if (customerSelect) {
        customerSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');

            if (selectedOption && selectedOption.value) {
                const customerEmail = selectedOption.getAttribute('data-email');
                const customerPhone = selectedOption.getAttribute('data-phone');
                if (emailInput) emailInput.value = customerEmail;  // Set the email field
                if (phoneInput) phoneInput.value = customerPhone;  // Set the phone field
            } else {
                clearContactDetails(); // Clear email and phone fields if no customer is selected
            }
        });
    }

    // Handle the form submission to create a new ticket
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const summary = document.getElementById('ticketSummary').value;
            const companyId = document.getElementById('companySelect').value;
            const customerId = document.getElementById('customerSelect').value;
            const priority = document.getElementById('ticketPriority').value;
            const status = document.getElementById('ticketStatus').value;
            const assignedUserId = document.getElementById('userSelect').value;
            const initialDescription = document.getElementById('initialDescription').value;

            
            if (!companyId || !customerId || !assignedUserId) {
                displayError('Please select a company, customer, and user');
                return;
            }

            const ticketData = {
                summary,
                status,
                priority,
                customerId,
                companyId,
                assignedUserId,
                initialDescription
            };
            
            fetch('http://localhost:5000/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create ticket');
                }
                return response.json();
            })
            .then(result => {
                displaySuccess('Ticket created successfully');
                ticketForm.reset();  // Clear the form
                customerSelect.disabled = true; // Reset customer dropdown to disabled state
                clearContactDetails();  // Clear email and phone fields
                window.location.href = 'ticketScreen.html';

            })
            .catch(error => {
                
                console.error('Error adding ticket:', error);
                displayError('Unable to create ticket. Please try again later.');
            });
        });
    }
});

// Function to clear all input fields on the page
function clearAllFields() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'select-one') {
            input.selectedIndex = 0; // Set dropdown to default
        } else {
            input.value = ''; // Clear input field
        }
    });
    const customerSelect = document.getElementById('customerSelect');
    if (customerSelect) {
        customerSelect.disabled = true; // Disable customer dropdown by default
    }
}

// Fetch and display companies in the company dropdown
function fetchCompanies() {
    fetch('http://localhost:5000/companies')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }
            return response.json();
        })
        .then(companies => {
            const companySelect = document.getElementById('companySelect');
            companySelect.innerHTML = '<option value="">Select Company</option>'; // Clear existing options

            companies.forEach(company => {
                const option = document.createElement('option');
                option.value = company.id;
                option.textContent = company.name;
                companySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching companies:', error);
            displayError('Unable to load companies. Please try again later.');
        });
}

// Fetch and display users in the user dropdown
function fetchUsers() {
    console.log("Attempting to fetch users from API...");
    fetch('http://localhost:5000/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(users => {
            console.log("Users fetched successfully:", users);
            const userSelect = document.getElementById('userSelect');
            userSelect.innerHTML = '<option value="">Select User</option>'; // Clear existing options

            if (users.length === 0) {
                userSelect.innerHTML += '<option value="">No users available</option>';
            } else {
                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = `${user.username} (${user.role || 'No role'})`;
                    userSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            displayError('Unable to load users. Please try again later.');
        });
}

// Fetch and populate the customer dropdown for the selected company
function fetchCustomers(companyId) {
    fetch(`http://localhost:5000/companies/${companyId}/customers`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch customers');
            }
            return response.json();
        })
        .then(customers => {
            const customerSelect = document.getElementById('customerSelect');
            customerSelect.innerHTML = '<option value="">Select Customer</option>'; // Clear existing options

            if (customers.length === 0) {
                customerSelect.innerHTML += '<option value="">No customers available</option>';
            } else {
                customers.forEach(customer => {
                    const option = document.createElement('option');
                    option.value = customer.id;
                    option.setAttribute('data-email', customer.email); // Store email in a data attribute
                    option.setAttribute('data-phone', customer.phone); // Store phone in a data attribute
                    option.textContent = customer.name;
                    customerSelect.appendChild(option);
                });
            }
            customerSelect.disabled = false; // Enable customer dropdown after successful fetch
        })
        .catch(error => {
            console.error('Error fetching customers:', error);
            displayError('Unable to load customers. Please try again later.');
        });
}

// Function to clear contact details fields
function clearContactDetails() {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
}

// Display success message
function displaySuccess(message) {
    const messageElement = document.getElementById('ticketMessage');
    if (messageElement) {
        messageElement.style.color = 'green';
        messageElement.innerText = message;
        setTimeout(() => {
            messageElement.innerText = ''; // Clear message after 3 seconds
        }, 3000);
    }
}

// Display error message
function displayError(message) {
    const messageElement = document.getElementById('ticketMessage');
    if (messageElement) {
        messageElement.style.color = 'red';
        messageElement.innerText = message;
        setTimeout(() => {
            messageElement.innerText = ''; // Clear message after 3 seconds
        }, 3000);
    }
}
