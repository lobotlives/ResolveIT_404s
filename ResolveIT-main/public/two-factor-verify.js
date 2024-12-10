//loading qr code with page
window.addEventListener('load', ()=> {
    const qrCodeData = sessionStorage.getItem('qrCode');
    const qrCodeImage = document.getElementById('qrCode');
    if (qrCodeData) {
        qrCodeImage.src = qrCodeData;
    }
    else{
        qrCodeImage.alt = "QR code not available. Try logging in again.";
    }
})
document.getElementById('verifyForm').addEventListener('submit', function (e) {
    e.preventDefault();
//preventing page from opening the default way

//creating passed token for verification
const token = document.getElementById('code').value;
const userId = sessionStorage.getItem('userId');
const tokenData = { token, userId };
    

    

fetch('http://localhost:5000/two-factor-verify',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( tokenData )
})

.then(response => response.json())
.then(result => {
    //redirect to two factor authentication
    if(result.message === "Invalid 2FA token"){
        window.location.href = 'http://localhost:5000'; //redirect
    }
    //redirect to ticket screen after successful verification
    if(result.message === "2FA verified successfully") {
        sessionStorage.removeItem('qrCode');
        window.location.href = 'ticketScreen.html';
    }else {
        // Show error message
        document.getElementById('errorMessage').innerText = result.error;
    }
})
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').innerText = "An error occurred. Please try again later.";
    });
    

    
});
