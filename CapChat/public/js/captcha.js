document.addEventListener('DOMContentLoaded', () => {
    let timeLeft = 30;
    const timer = document.getElementById('time');
    const interval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(interval);
            window.location.reload();
        } else {
            timer.textContent = timeLeft;
            timeLeft--;
        }
    }, 1000);

    document.querySelectorAll('.captcha-image').forEach(img => {
        img.addEventListener('click', () => {
            document.getElementById('selectedImageId').value = img.getAttribute('data-id');
            document.getElementById('captchaForm').submit();
        });
    });
});
