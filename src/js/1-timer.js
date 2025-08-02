import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let countdownInterval = null;

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");

disableStartButton();

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    
userSelectedDate = selectedDates[0];
    if (userSelectedDate.getTime() <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      disableStartButton();
    } else {
      enableStartButton();
    }
  },
};

flatpickr(datetimePicker, options);

startButton.addEventListener("click", () => {
  if (!userSelectedDate) return;
  startCountdown();
});

function startCountdown() {
  disableStartButton();
  datetimePicker.disabled = true;

  countdownInterval = setInterval(() => {
    const now = new Date();
    const msLeft = userSelectedDate - now;

    if (msLeft <= 0) {
      clearInterval(countdownInterval);
      updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false;
      iziToast.success({
        title: 'Success',
        message: 'Countdown finished',
        position: 'topRight',
      });
      return;
    }

    const time = convertMs(msLeft);
    updateDisplay(time);
  }, 1000);
}

function updateDisplay({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

function enableStartButton() {
  startButton.disabled = false;
  startButton.classList.add('active');
}

function disableStartButton() {
  startButton.disabled = true;
  startButton.classList.remove('active');
}
