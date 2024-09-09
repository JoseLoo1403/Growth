//import Main from 'electron/main';
import {CreateSubject, GetAllSubjects} from './Data/SubjectContext.js';
const {ipcRenderer} = require('electron');

const Cont = document.getElementById('Cont');
const BtnAdd = document.getElementById('BtnAdd');

let AddNewCourseName = 0;
let AddNewCourseDesc = 0;

LoadData();

function SetNavbar()
{
    const Navbar = document.getElementById('Nav');
    if(localStorage.getItem('Nav-State') == 'Open')
    {
        Navbar.classList.remove('Close');
    }

    setTimeout(() => {
        Navbar.classList.add('Nav-Transition');
        console.log('Nav animation')
    }, 10);
}

async function LoadData()
{
    SetNavbar();
    const rows = await GetAllSubjects();
    rows.forEach(element => {

        let Color = 'Green';

        if(element.LastReview == null)
        {
            Color = 'Grey'

            element.LastReview = new Date().toJSON().slice(0, 10);
        }

        const MainSub = elementFromHtml(`
            <div class="sub" onclick="SubjectClicked(this)">
                    <div class="${Color}-Review">
                        ${element.LastReview}
                    </div>
                    <h2>
                        ${element.Name}
                    </h2>
                    <p>
                        ${element.Description}
                    </p>
                    <div class="Topic-Info">
                        ${element.TotalTopics} Topics
                        <img src="./Imgs/FolderIcon.png" style="height: 16px; margin-right: 5px;">
                    </div>
                </div>
            `);

        Cont.appendChild(MainSub);
    });

    const TotalRender = document.getElementById('Course-Amount');

    TotalRender.innerText = rows.length;
}

document.addEventListener("keydown",(e) =>
{
    if(AddNewCourseName == 1)
    {
        if(e.key == 'Enter')
        {
            const T = document.getElementById('Temp');

            const ClassName = document.createElement('h2');
            ClassName.innerText = T.value;
            T.value = '';
            T.placeholder = 'Description';

            AddNewCourseName = 2;
            const Card = document.getElementById('New');
            Card.appendChild(ClassName);
            Card.removeChild(T);
            Card.appendChild(T);

            T.focus();
        }
    }
    else if (AddNewCourseName == 2)
    {
        if(e.key == 'Enter')
        {
            const T = document.getElementById('Temp');

            const Description = document.createElement('p');
            Description.innerText = T.value;

            const Card = document.getElementById('New');
            Card.id = '';
            Card.appendChild(Description);
            Card.removeChild(T);

            Card.appendChild(elementFromHtml(`
                <div class="Topic-Info">
                        0 Topics
                        <img src="./Imgs/FolderIcon.png" style="height: 16px; margin-right: 5px;">
                    </div>
                `));

            let NewSubject = {};
            console.log(Card.children[1]);
            NewSubject.Name = Card.children[1].textContent;
            NewSubject.Description = Card.children[2].textContent;

            CreateSubject(NewSubject);

            AddNewCourseName = 0;
        }
    }
});

function SubjectClicked(Subject)
{
    const sub = document.getElementById('New');

    if(sub)
    {
        return;
    }

    localStorage.setItem('Current-Subject',Subject.children[1].innerText);
    window.location.href = './Forms/GrowthGrid/GrowthGrid.html';
}

window.SubjectClicked = SubjectClicked;

function CreateNewCourse()
{ 
    let val = document.getElementById('New');
    let date = new Date().toJSON().slice(0, 10);
    if(val)
    {
        return;
    }

    AddNewCourseName = 1;
    const NewCard = document.createElement('div');

    NewCard.classList.add('sub');
    NewCard.id = 'New';
    NewCard.onclick = function(){SubjectClicked(this)};

    const SubReview = document.createElement('div');
    SubReview.innerText = date;
    SubReview.classList.add('Grey-Review');

    let TextInput = document.createElement('input');
    TextInput.id = 'Temp'
    TextInput.placeholder = 'Name';
    TextInput.type = 'text';

    NewCard.appendChild(SubReview);
    NewCard.appendChild(TextInput);

    Cont.appendChild(NewCard);

    TextInput.focus();
}

BtnAdd.addEventListener('click',CreateNewCourse);

function elementFromHtml(html){
    const template = document.createElement('template');

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}