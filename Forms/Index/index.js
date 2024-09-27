//import Main from 'electron/main';
import {CreateSubject, GetAllSubjects,DeleteFullSubjectById,EditSubjectById,GetLastSubjectId} from '../../Data/SubjectContext.js';

const Cont = document.getElementById('Cont');
const BtnAdd = document.getElementById('BtnAdd');

let AddNewCourseName = 0;
let BlockSubj = 0;

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
    }, 10);
}

async function LoadData()
{
    SetNavbar();
    const rows = await GetAllSubjects();    
    let Color;
    rows.forEach(element => {

        if(element.LastReview == null)
        {
            Color = 'Grey'

            element.LastReview = new Date().toJSON().slice(0, 10);
        }
        else
        {
            let Today = new Date();
            let LastReview = new Date(element.LastReview);

            let Difference = Math.floor((Today-LastReview) / (1000 * 60 * 60 * 24));

            if(Difference >= 11)
            {
                Color = 'Red';
            }
            else if (Difference >= 5)
            {
                Color = 'Yellow';
            }
            else
            {
                Color = 'Green';
            }
        }

        const MainSub = elementFromHtml(`
            <div class="Subject-Container">
                <div class="Dropdown-Menu">
                    <button class="Drop" onclick="OptionsBtn(this)"><img src="../.././Imgs/ThreeDots.png" style="height: 20px;"></button>
                    <div class="Content Hide-Content">
                        <button onclick="EditBtn(this,${element.Id})">Edit</button>
                        <button onclick="DisplayDeleteForm(${element.Id})">Delete</button>
                    </div>
                </div>
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
                        <img src="../../Imgs/FolderIcon.png" style="height: 16px; margin-right: 5px;">
                    </div>
                </div>
            </div>
            `);

        Cont.appendChild(MainSub);
    });

    const TotalRender = document.getElementById('Course-Amount');

    TotalRender.innerText = rows.length;
}

// document.addEventListener("keydown",(e) =>
// {
//     if(AddNewCourseName == 1)
//     {
//         if(e.key == 'Enter')
//         {
//             const T = document.getElementById('Temp');

//             const ClassName = document.createElement('h2');
//             ClassName.innerText = T.value;
//             T.value = "";
//             T.placeholder = 'Description';

//             AddNewCourseName = 2;
//             const Card = document.getElementById('New');
//             Card.appendChild(ClassName);
//             Card.removeChild(T);
//             Card.appendChild(T);

//             T.focus();
//         }
//     }
//     else if (AddNewCourseName == 2)
//     {
//         if(e.key == 'Enter')
//         {
//             const T = document.getElementById('Temp');

//             const Description = document.createElement('p');
//             Description.innerText = T.value;

//             const Card = document.getElementById('New');
//             Card.id = '';
//             Card.appendChild(Description);
//             Card.removeChild(T);

//             Card.appendChild(elementFromHtml(`
//                 <div class="Topic-Info">
//                         0 Topics
//                         <img src="../../Imgs/FolderIcon.png" style="height: 16px; margin-right: 5px;">
//                     </div>
//                 `));

//             let NewSubject = {};
//             console.log(Card.children[1]);
//             NewSubject.Name = Card.children[1].textContent;
//             NewSubject.Description = Card.children[2].textContent;

//             CreateSubject(NewSubject);

//             AddNewCourseName = 0;
//         }
//     }
// });

function SubjectClicked(Subject)
{
    const sub = document.getElementById('New');

    if(sub || BlockSubj)
    {
        return;
    }

    localStorage.setItem('Current-Subject',Subject.children[1].innerText);
    window.location.href = '../GrowthGrid/GrowthGrid.html';
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

    const NewSub = elementFromHtml(`
        <div class="Subject-Container">
            <div class="Dropdown-Menu">
                <button class="Drop" onclick="OptionsBtn(this)"><img src="../.././Imgs/ThreeDots.png" style="height: 20px;"></button>
                <div class="Content Hide-Content">
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            </div>
            <div class="sub" onclick="SubjectClicked(this)" id="New">
                <div class="Grey-Review">
                    ${date}
                </div>
                <input type="text" id="Temp" placeholder="Name" type="text" maxlength="22">
            </div>
        </div>
        `);

    AddNewCourseName = 1;

    const TxtInput = NewSub.children[1].children[1];

    Cont.appendChild(NewSub);

    TxtInput.focus();

    const BlurHandler = function() {
        NewSub.remove();
    };

    TxtInput.addEventListener('blur',BlurHandler);

    TxtInput.addEventListener('keypress', (e) => {
        if(e.key == 'Enter')
        {
            if(TxtInput.value.trim().length == 0)
            {
                return;
            }
            TxtInput.removeEventListener('blur',BlurHandler);
            CreateCourseTitle(TxtInput);
        }
    });
}

window.CreateNewCourse = CreateNewCourse;

function CreateCourseTitle(TxtInput)
{
    let Subject = {};
    const CourseName = document.createElement('h2');
    CourseName.innerText = TxtInput.value;

    Subject.Name = TxtInput.value;

    const Sub = TxtInput.parentElement;

    Sub.replaceChild(CourseName,TxtInput);
    TxtInput.remove();

    const TxtInput2 = document.createElement('input');
    TxtInput2.maxLength = 50;
    Sub.appendChild(TxtInput2);

    TxtInput2.focus();

    TxtInput2.addEventListener('keypress', (e) => {
        if(e.key == 'Enter')
        {
            const Description = document.createElement('p');
            Description.innerText = TxtInput2.value;
            Subject.Description = Description.innerText;

            const TopicInfo = elementFromHtml(`
                <div class="Topic-Info">
                    0 Topics
                    <img src="../../Imgs/FolderIcon.png" style="height: 16px; margin-right: 5px;">
                </div>
            `);

            Sub.replaceChild(Description,TxtInput2);
            Sub.appendChild(TopicInfo);
            TxtInput2.remove();
            Sub.id = '';

            CreateSubject(Subject);
            AddFunctionalitiesToButtons(Sub)
        }
    });
}

async function AddFunctionalitiesToButtons(Sub)
{
    const ButtonsContainer = Sub.parentElement.children[0].children[1];
    const LastSubject = await GetLastSubjectId();

    console.log(ButtonsContainer.children[0])

    ButtonsContainer.children[0].onclick = function() {EditBtn(this,LastSubject[0].seq)};
    ButtonsContainer.children[1].onclick = function() {DisplayDeleteForm(LastSubject[0].seq)};
}

function DisplayDeleteForm(Subjectid)
{
    const form = elementFromHtml(`
    <div class="Delete-Back">
        <div class="Delete-Form">
            <p>Are you sure you want to delete this course?</p>
            <div>
                <button class="Btn-Cancel" onclick="BtnCancel(this)">Cancel</button>
                <button class="Btn-Del" onclick="ConfirmDelete(${Subjectid}),this">Delete</button>
            </div>
        </div>
    </div>
        `);

    document.body.appendChild(form);
}

window.DisplayDeleteForm = DisplayDeleteForm;

function ConfirmDelete(SubjectId,btn)
{
    DeleteFullSubjectById(SubjectId);
    location.reload();
}

window.ConfirmDelete = ConfirmDelete;

function EditBtn(btn,id)
{
    const MainSub = btn.parentElement.parentElement.parentElement;
    BlockSubj = 1;

    const Subject = MainSub.children[1];

    const OldText = Subject.children[1];

    const NewText = document.createElement('input');
    NewText.id = 'New-Name';
    NewText.value = OldText.innerText;
    NewText.maxLength = 25;
    Subject.replaceChild(NewText,OldText);
    NewText.focus();

    const BlurHandler = function() {
        Subject.replaceChild(OldText,NewText);
        BlockSubj = 0;
    };

    NewText.addEventListener('blur',BlurHandler);

    NewText.addEventListener('keypress', (e) => {
        if(e.code == 'Enter')
        {
            if(NewText.value.trim().length == 0)
            {
                return;
            }
            
            NewText.removeEventListener('blur',BlurHandler);
            OldText.innerText = NewText.value;
            Subject.replaceChild(OldText,NewText);
            EditDescription(Subject,NewText.value,id);
        }
    });
}

window.EditBtn = EditBtn;

function EditDescription(Subject,NewName,id)
{
    const OldText = Subject.children[2];

    const NewText = document.createElement('input');
    NewText.id = 'New-Name';
    Subject.replaceChild(NewText,OldText);
    NewText.value = OldText.innerText.trim();
    NewText.focus();
    NewText.maxLength = 50;

    const BlurHandler = function() {
        Subject.replaceChild(OldText,NewText);
        BlockSubj = 0;
    };

    NewText.addEventListener('blur',BlurHandler);

    NewText.addEventListener('keypress', (e) => {
        if(e.code == 'Enter')
        {
            NewText.removeEventListener('blur',BlurHandler);
            OldText.innerText = NewText.value;
            Subject.replaceChild(OldText,NewText);
            EditSubjectById(id,NewName,NewText.value);
            BlockSubj = 0;
        }
    });
}

function elementFromHtml(html){
    const template = document.createElement('template');

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}