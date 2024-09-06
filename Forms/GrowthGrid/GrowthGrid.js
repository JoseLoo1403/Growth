import { CreateTopic,GetAllTopicsBySubjectName,GetLastTopicId } from "../../Data/TopicContext.js";
import {CreateReview,GetReviewsByTopicId} from '../../Data/ReviewContext.js'
const Container = document.getElementById('Cont');
var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');

// let AddNewTopic = 0;

await LoadData();

function SetSubjectInfo()
{
    let SubjectName = localStorage.getItem('Current-Subject');
    
    const Title = document.getElementById('Course-Title');

    Title.innerText = SubjectName;
}

async function LoadData()
{
    SetSubjectInfo();

    //Get Topics
    const rows = await GetAllTopicsBySubjectName(localStorage.getItem('Current-Subject'));

    rows.forEach(async element => {
        const TopicContainer = document.createElement('div');
        TopicContainer.classList.add('Topic-Cont');

        const Topic = document.createElement('div');
        Topic.classList.add('Topic');
        Topic.innerText = element.Name;

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
            const Review = document.createElement('div');
            Review.classList.add('Topic');
            Review.classList.add(`${r.Color}-Review`);
            Review.innerHTML = r.Date;

            TopicContainer.appendChild(Review);
        });

        TopicContainer.appendChild(ReviewAdder);
        Container.appendChild(TopicContainer);

    });
}

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

            await CreateTopic(TopicInputBox.value,localStorage.getItem('Current-Subject'));

            Topic.removeChild(TopicInputBox);
            Topic.innerText = TopicInputBox.value;
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

function AddNewReview(btn,TopicId)
{
    const Review = document.createElement('div');
    Review.classList.add('Topic');
    Review.innerHTML = utc;
    let color;
    
    switch(btn.classList[0])
    {
        case 'R':
            color = 'Red';
            Review.classList.add('Red-Review');
            break;
        case 'Y':
            color = 'Yellow';
            Review.classList.add('Yellow-Review');
            break;
        case 'G':
            color = 'Green';
            Review.classList.add('Green-Review');
            break;
    }

    const TopicContainer = btn.parentElement.parentElement.parentElement;

    CreateReview(utc,color,TopicId);

    TopicContainer.appendChild(Review);
}

window.AddNewReview = AddNewReview;

function elementFromHtml(html){
    const template = document.createElement('template');

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}