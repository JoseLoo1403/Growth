import { CreateTopic,GetAllTopicsBySubjectName,GetLastTopicId } from "../../Data/TopicContext.js";
import {CreateReview,GetReviewsByTopicId,DeleteReviewById,GetLastReviewId,UpdateReviewById} from '../../Data/ReviewContext.js'
import {UpdateLastReviewByTopicId,GetSubjectByName,UpdateLastReviewById} from '../../Data/SubjectContext.js'
import { CreateNewExam,GetExamById } from "../../Data/ExamContext.js";
const Container = document.getElementById('Cont');
var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
let SubjectName;
let Subject_Id;

// let AddNewTopic = 0;

await LoadData();

function SetSubjectInfo()
{
    SubjectName = localStorage.getItem('Current-Subject');
        
    const Title = document.getElementById('Course-Title');

    Title.innerText = SubjectName;
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

async function LoadExamData()
{
    const result = await GetSubjectByName(SubjectName);

    Subject_Id = result.Id;
    sessionStorage.setItem('Current_Subject_Id',result.Id);

    const cont = document.getElementById('Top-Cont');

    if(result.Exam_Id != null)
    {
        const exam = await GetExamById(result.Exam_Id);

        console.log(exam);

        let Today = new Date();
        let ExamDate = new Date(exam.Date);


        let Difference = Math.floor((ExamDate - Today) / (1000 * 60 * 60 * 24)) + 1;

        cont.appendChild(elementFromHtml(`
            <div class="ExamBackground" onclick="OpenExamInfo(${result.Exam_Id})">
                <div>
                    <img src="../../Imgs/Exam_Pencil.png" style="width: 22px; margin-right: 10px;">
                    Exam in: 
                    <p>${Difference} Days</p>
                </div>
            </div>
            `));
    }
    else
    {
        cont.appendChild(elementFromHtml(`
            <button class="Exam-Btn" onclick="AddExam()">+ Add exam</button>
            `));
    }
}

async function LoadData()
{
    SetNavbar();
    SetSubjectInfo();
    LoadExamData();

    //Get Topics
    const rows = await GetAllTopicsBySubjectName(SubjectName);

    rows.sort(compare);

    rows.forEach(async element => {
        const TopicContainer = document.createElement('div');
        TopicContainer.classList.add('Topic-Cont');

        const Topic = elementFromHtml(`\
            <div class="Topic">
                <p>${element.Name}</p>
                <div class="Edition">
                    <button onclick="DeleteTopicForm(${element.Id})"><img src="../../Imgs/Trash-Grey.png" alt=""></button>
                    <button onclick="BtnEditTopic(this,${element.Id})"><img src="../../Imgs/Pencil-Grey.png" alt=""></button>
                </div>
            </div>
            `);

        const ReviewAdder = elementFromHtml(`
            <div class="Topic Adder">
                ${utc}
                <div>
                    <button class="R" onclick="AddNewReview(this,${element.Id})"></button>
                    <button class="Y" onclick="AddNewReview(this,${element.Id})"></button>
                    <button class="G" onclick="AddNewReview(this,${element.Id})"></button>
                </div>
            </div>
            `);

        TopicContainer.appendChild(Topic);

        const Reviews = await GetReviewsByTopicId(element.Id);

        Reviews.forEach(r => {
            const Review = elementFromHtml(`
                <div class="Topic ${r.Color}-Review">
                    <p>${r.Date}</p>
                    <div class="Edition">
                        <button onclick="DeleteReview(this,${r.Id})"><img src="../../Imgs/Trash-${r.Color}.png" alt=""></button>
                        <button onclick="EditReview(this,${r.Id})"><img src="../../Imgs/Pencil-${r.Color}.png" alt=""></button>
                    </div>
                </div>
                `);

            TopicContainer.appendChild(Review);
        });

        TopicContainer.appendChild(ReviewAdder);
        Container.appendChild(TopicContainer);

    });
}

function compare( a, b ) {
    if ( a.Id < b.Id ){
      return -1;
    }
    if ( a.Id > b.Id ){
      return 1;
    }
    return 0;
  }

function DeleteReview(btn,ReviewId)
{
    const Review = btn.parentElement.parentElement;

    Review.parentElement.removeChild(Review);

    DeleteReviewById(ReviewId);
    UpdateLastReviewById(Subject_Id);
}

window.DeleteReview = DeleteReview;

function EditReview(btn,Id)
{
    const ReviewCard = btn.parentElement.parentElement;
    
    const Calendar = document.createElement('input');
    Calendar.type = 'date';

    const oldDate = ReviewCard.children[0];

    const ColorEdit = elementFromHtml(`
        <div class="Edit">
            <button class="R" onclick="UpdateReview('Red',${Id},this)"></button>
            <button class="Y" onclick="UpdateReview('Yellow',${Id},this)"></button>
            <button class="G" onclick="UpdateReview('Green',${Id},this)"></button>
        </div>
        `); 

    ReviewCard.classList.remove(ReviewCard.classList[1]);
    ReviewCard.classList.add('Grey-Review');

    ReviewCard.replaceChild(Calendar,oldDate);
    ReviewCard.replaceChild(ColorEdit,ReviewCard.children[1]);
}

window.EditReview = EditReview;

function UpdateReview(NewColor,Id,btn)
{
    const ReviewCard = btn.parentElement.parentElement;

    const NewDate = ReviewCard.children[0];

    if(NewDate.value.trim().length == 0) {return;}

    const DateText = document.createElement('p');
    DateText.innerText = NewDate.value.slice(0,10).replace(/-/g,'/');

    const EditionButtons = elementFromHtml(`
        <div class="Edition">
            <button onclick="DeleteReview(this,${Id})"><img src="../../Imgs/Trash-${NewColor}.png" alt=""></button>
            <button onclick="EditReview(this,${Id})"><img src="../../Imgs/Pencil-${NewColor}.png" alt=""></button>
        </div>
        `);

    ReviewCard.innerHTML = '';
    ReviewCard.appendChild(DateText);
    ReviewCard.appendChild(EditionButtons);

    ReviewCard.classList.remove('Grey-Review');
    ReviewCard.classList.add(`${NewColor}-Review`);

    UpdateReviewById(Id,DateText.innerText,NewColor);
    UpdateLastReviewById(Subject_Id);
}

window.UpdateReview = UpdateReview;

document.addEventListener("keydown",(e) => {
    if(e.key == 'Enter')
    {
        FinishNewTopic();
    }
});

async function FinishNewTopic() {
    const Topic = document.getElementById('New');
        if(Topic)
        {
            const TopicContainer = document.getElementById('New-Tcontainer');

            const TopicInputBox = document.getElementById('Temp');

            if(TopicInputBox.value.trim().length == 0) return;

            await CreateTopic(TopicInputBox.value,localStorage.getItem('Current-Subject'));

            Topic.removeChild(TopicInputBox);

            const TxtName = document.createElement('p');
            TxtName.innerText = TopicInputBox.value;
            Topic.appendChild(TxtName);
            Topic.id = '';

            const TopicId = await GetLastTopicId();
            console.log(TopicId[0]);

            const ReviewAdder = elementFromHtml(`
                <div class="Topic Adder">
                    ${utc}
                    <div>
                        <button class="R" onclick="AddNewReview(this,${TopicId[0].seq})"></button>
                        <button class="Y" onclick="AddNewReview(this,${TopicId[0].seq})"></button>
                        <button class="G" onclick="AddNewReview(this,${TopicId[0].seq})"></button>
                    </div>
                </div>
            `);
            
            Topic.appendChild(elementFromHtml(`
                <div class="Edition">
                    <button onclick="DeleteTopicForm(${TopicId[0].seq})"><img src="../../Imgs/Trash-Grey.png" alt=""></button>
                    <button onclick="BtnEditTopic(this,${TopicId[0].seq})"><img src="../../Imgs/Pencil-Grey.png" alt=""></button>
                </div>
                `));

            TopicContainer.appendChild(ReviewAdder);
            TopicContainer.id = '';
        }
}

function AddNewTopic()
{
    const TopicContainer = document.createElement('div');
    TopicContainer.classList.add('Topic-Cont');
    TopicContainer.id = 'New-Tcontainer';

    const Topic = document.createElement('div');
    Topic.classList.add('Topic');
    Topic.id = 'New';

    const InputBox = document.createElement('Input');
    InputBox.id = 'Temp';

    Topic.appendChild(InputBox);
    TopicContainer.appendChild(Topic);

    Container.appendChild(TopicContainer);

    InputBox.focus();
}

window.AddNewTopic = AddNewTopic;

async function AddNewReview(btn,TopicId)
{
    let color;

    switch(btn.classList[0])
    {
        case 'R':
            color = 'Red';
            break;
        case 'Y':
            color = 'Yellow';
            break;
        case 'G':
            color = 'Green';
            break;
    }

    CreateReview(utc,color,TopicId);

    //Last subject studied logic
    if(sessionStorage.getItem(`LastReview-${SubjectName}`) == null)
    {
        sessionStorage.setItem(`LastReview-${SubjectName}`,'1');
        UpdateLastReviewByTopicId(utc,TopicId);
    }

    const TopicContainer = btn.parentElement.parentElement.parentElement;

    const Id = await GetLastReviewId();

    const Review = elementFromHtml(`
            <div class="Topic ${color}-Review">
                <p>${utc}</p>
                <div class="Edition">
                    <button onclick="DeleteReview(this,${Id[0].seq})"><img src="../../Imgs/Trash-${color}.png" alt=""></button>
                    <button onclick="EditReview(this,${Id[0].seq})"><img src="../../Imgs/Pencil-${color}.png" alt=""></button>
                </div>
            </div>
        `)

    TopicContainer.appendChild(Review);
}

window.AddNewReview = AddNewReview;

function AddExam()
{
    const body = Container.parentElement.parentElement.parentElement;

    body.appendChild(elementFromHtml(`
        <div class="Cover-Screen">
            <div class="Exam-Cont">
                <h3>Add exam to this course</h3>
                <input type="date" id="Exam-Date">
                <textarea name="" id="Exam-Description" placeholder="Exam Description"></textarea>
                <div style="display: flex;">
                    <button onclick="CloseAddExam(this)">Cancel</button>
                    <button onclick="BtnAddExam()">Add</button>
                </div>
            </div>
        </div>
        `));
}

window.AddExam =AddExam;

function CloseAddExam(from){
    const body = Container.parentElement.parentElement.parentElement;
    body.removeChild(from.parentElement.parentElement.parentElement);
}

window.CloseAddExam = CloseAddExam;

function BtnAddExam()
{
    const Description = document.getElementById('Exam-Description');
    const Date = document.getElementById('Exam-Date');

    if(Date.value.trim().length == 0) {return;}

    CreateNewExam(Description.value,Date.value.replace(/-/g,'/'),SubjectName);
    location.reload();
}

window.BtnAddExam = BtnAddExam;

function elementFromHtml(html){
    const template = document.createElement('template');

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}