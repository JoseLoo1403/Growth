import {GetDistinctDates} from "../../Data/ReviewContext.js"
import { GetDistinctExamDates } from "../../Data/ExamContext.js";

const header = document.querySelector(".calendar h3");
const dates = document.querySelector(".dates");
const navs = document.querySelectorAll("#prev, #next");

const ReviewDates = await GetDistinctDates();
const ExamDates = await GetDistinctExamDates();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

LoadData();

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

function SetNavbar()
{
    const Navbar = document.getElementById('Nav');
    if(localStorage.getItem('Nav-State') == 'Open')
    {
        Navbar.classList.remove('Close');
    }

    setTimeout(() => {
        Navbar.classList.add('Nav-Transition');
    }, 10);
}

function LoadData(){
    SetNavbar();
}

function renderCalendar() {
  // first day of the month
  const start = new Date(year, month, 1).getDay();
  // last date of the month
  const endDate = new Date(year, month + 1, 0).getDate();
  // last day of the month
  const end = new Date(year, month, endDate).getDay();
  // last date of the previous month
  const endDatePrev = new Date(year, month, 0).getDate();

  let datesHtml = "";

  for (let i = start; i > 0; i--) {
    datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
  }

  for (let i = 1; i <= endDate; i++) {
    let className = "";
    ReviewDates.forEach(el => {
      if(el.Date == `${year}/${pad(month+1,2)}/${pad(i,2)}`)
      {
        className = ' class="Reviewed"';
      }
    });

    ExamDates.forEach(el => {
      if(el.Date == `${year}/${pad(month+1,2)}/${pad(i,2)}`)
      {
        className = ' class="Exam"';
      }
    });

    className =
      i === date.getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
        ? ' class="today"'
        : className;
      
    datesHtml += `<li${className}>${i}</li>`;
  }

  for (let i = end; i < 6; i++) {
    datesHtml += `<li class="inactive">${i - end + 1}</li>`;
  }

  dates.innerHTML = datesHtml;
  header.textContent = `${months[month]} ${year}`;
}

navs.forEach((nav) => {
  nav.addEventListener("click", (e) => {
    const btnId = e.target.id;

    if (btnId === "prev" && month === 0) {
      year--;
      month = 11;
    } else if (btnId === "next" && month === 11) {
      year++;
      month = 0;
    } else {
      month = btnId === "next" ? month + 1 : month - 1;
    }

    date = new Date(year, month, new Date().getDate());
    year = date.getFullYear();
    month = date.getMonth();

    renderCalendar();
  });
});

renderCalendar();