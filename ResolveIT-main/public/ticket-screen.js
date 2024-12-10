// Declare ticketsData globally at the beginning
let ticketsData = [];

//populate ticketsData for filtering purposes
fetchTickets();
// Function to get logged-in user's ID from local storage
function getLoggedInUserId() {
    return localStorage.getItem('userId');
}

// Sort tickets based on status and priority then creation date
function sortTickets(tickets) {
    const priorityOrder = {
        "High": 1,
        "Medium": 2,
        "Low": 3,
    };

    const statusOrder = {
        "Open": 1,
        "New": 1,
        "Assigned": 1,
        "In Progress": 1,
        "On Hold": 2,
        "Waiting": 2,
        "Complete": 3,
    };

    return tickets.sort((a, b) => {
            const statusOrderA = statusOrder[a.status] || 4; // Default to higher value if not found
            const statusOrderB = statusOrder[b.status] || 4;

            if (statusOrderA !== statusOrderB) {
                return statusOrderA - statusOrderB; // Sort by status order
            }

            // Sort by priority using the priority order defined
            const priorityOrderA = priorityOrder[a.priority]
            const priorityOrderB = priorityOrder[b.priority]

            if (priorityOrderA !== priorityOrderB) {
                return priorityOrderA - priorityOrderB;
            }

            // Sort by created date (oldest first)
            return new Date(a.createdDate) - new Date(b.createdDate);
    });
}

// Fetch all tickets and store them globally
function fetchTickets() {
    fetch('http://localhost:5000/tickets')
        .then(response => response.json())
        .then(tickets => {
            console.log('Fetched Tickets:', tickets);  // Debug
            ticketsData = sortTickets(tickets);  // Sort and store fetched tickets globally
            renderTickets(ticketsData);  // Render all tickets initially
        })
        .catch(error => console.error('Error fetching tickets:', error));
}

// Fetch tickets assigned to a specific user, optionally filtered by status
function fetchTicketsForUser(userId, status = null) {
    

    fetch(`http://localhost:5000/tickets?assigned_user_id=${userId}`)
        .then(response => {
            
            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }
            return response.json();
        })
        .then(tickets => {
            console.log('Fetched User Tickets:', tickets); // Debug
            const ticketData = sortTickets(tickets);
            renderTickets(ticketData);
        })
        .catch(error => {
            console.error('Error fetching tickets:', error);
            displayError('Unable to load tickets. Please try again later.');
        });
}


function renderTickets(ticketList) {
    const ticketContainer = document.getElementById('ticketContainer');
    ticketContainer.innerHTML = ''; // Clear existing tickets

    if (ticketList.length === 0) {
        ticketContainer.innerHTML = '<tr><td colspan="9">No tickets available.</td></tr>';
    } else {
        ticketList.forEach(ticket => {
            const ticketRow = document.createElement('tr');
            ticketRow.innerHTML = `
                <td>${ticket.id}</td>
                <td>${ticket.priority}</td>
                <td>${ticket.company_name || 'N/A'}</td>
                <td>${ticket.status}</td>
                <td><a href="ticket-details.html?ticketId=${ticket.id}">${ticket.summary}</a></td>
                <td>${ticket.contact_name || 'N/A'}</td>
                <td>${ticket.created_at || 'N/A'}</td>
                <td>${ticket.ticket_owner_name || 'N/A'}</td>
`;
            // Add a click event to each row
            ticketRow.addEventListener('click', () => {
                window.location.href = `ticket-details.html?ticketId=${ticket.id}`;
            });

            ticketContainer.appendChild(ticketRow);
        });
    }
}



// Filter tickets by status from global ticketsData
function filterTickets(status) {
    console.log('Filtering tickets with status:', status);  // Debug
    let filteredTickets;
    
    if(status == 'all') {
        renderTickets(ticketsData);
    }
    else if(status == 'MyTickets') {
        const loggedInUserId = getLoggedInUserId();
        fetchTicketsForUser(loggedInUserId);
    } else {
        ticketsData.forEach(ticket => {
            console.log(ticket.status, status);
          });
        filteredTickets = ticketsData.filter(ticket => ticket.status.toLowerCase() === status.toLowerCase());
        console.log(filteredTickets);
        renderTickets(filteredTickets);
        
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

// Load tickets and set up event listeners on page load
document.addEventListener('DOMContentLoaded', function() {
    const loggedInUserId = getLoggedInUserId();
    
    if (loggedInUserId) {
        fetchTicketsForUser(loggedInUserId); // Fetch tickets for logged-in user
    } else {
        fetchTickets(); // Fallback to fetching all tickets if no user is logged in
    }

    // Add event listeners for filter buttons
    document.getElementById('myticketsButton').addEventListener('click', () => filterTickets('MyTickets'));
    document.getElementById('assignedButton').addEventListener('click', () => filterTickets('Assigned'));
    document.getElementById('allButton').addEventListener('click', () => filterTickets('all'));
    document.getElementById('newButton').addEventListener('click', () => filterTickets('New'));
    document.getElementById('inProgressButton').addEventListener('click', () => filterTickets('In Progress'));
    document.getElementById('waitingButton').addEventListener('click', () => filterTickets('Waiting'));
    document.getElementById('clientUpdatedButton').addEventListener('click', () => filterTickets('Client Updated'));
    document.getElementById('completeButton').addEventListener('click', () => filterTickets('Complete'));
});