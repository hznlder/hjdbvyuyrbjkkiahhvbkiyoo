document.addEventListener('DOMContentLoaded', () => {
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');
    const countdownTimerDiv = document.getElementById('countdown-timer');
    const expectedEndTimeParagraph = document.querySelector('.expected-end-time');

    // Define the target end time: 7:30 AM IST today
    // Current date is Monday, June 30, 2025.
    const targetDate = new Date('June 30, 2025 07:30:00 GMT+0530'); // GMT+0530 is IST offset

    function updateCountdown() {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime(); // Difference in milliseconds

        if (difference <= 0) {
            // Timer has ended
            clearInterval(countdownInterval);
            hoursSpan.textContent = '00';
            minutesSpan.textContent = '00';
            secondsSpan.textContent = '00';
            countdownTimerDiv.innerHTML = '<span class="timer-message">Site is now live!</span>';
            expectedEndTimeParagraph.textContent = 'Thank you for your patience! The site is now fully operational.';
            return;
        }

        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        hoursSpan.textContent = String(hours).padStart(2, '0');
        minutesSpan.textContent = String(minutes).padStart(2, '0');
        secondsSpan.textContent = String(seconds).padStart(2, '0');
    }

    // Initial call to display immediately
    updateCountdown();

    // Update the countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
});
