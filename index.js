//import Main from 'electron/main';
import {CreateSubject, GetAllSubjects} from './Data/SubjectContext.js';
const {ipcRenderer} = require('electron');

const Cont = document.getElementById('Cont');
const BtnAdd = document.getElementById('BtnAdd');

let AddNewCourseName = 0;
let AddNewCourseDesc = 0;

LoadData();

async function LoadData()
{
    const rows = await GetAllSubjects();
    let date = new Date().toJSON().slice(0, 10);
    rows.forEach(element => {
        const MainSub = document.createElement('div');
        MainSub.classList.add('sub');
        MainSub.onclick = function(){SubjectClicked(this)};

        const SubReview = document.createElement('div');
        SubReview.innerText = date;
        SubReview.classList.add('Green-Review');

        const SubName = document.createElement('h2');
        SubName.innerText = element.Name;

        const SubDescription = document.createElement('p');
        SubDescription.innerText = 'This is a test description';
        
        MainSub.appendChild(SubReview);
        MainSub.appendChild(SubName);
        MainSub.append(SubDescription);

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

//Recieve all subjects
// ipcRenderer.on('GET-RESPOND', (e,rows) => {

//     });
// });

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