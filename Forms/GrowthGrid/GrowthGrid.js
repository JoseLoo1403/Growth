import { CreateTopic,GetAllTopicsBySubjectName,GetLastTopicId } from "../../Data/TopicContext.js";
import {CreateReview,GetReviewsByTopicId,DeleteReviewById,GetLastReviewId} from '../../Data/ReviewContext.js'
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

    rows.sort(compare);

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
            const Review = elementFromHtml(`
                <div class="Topic ${r.Color}-Review">
                    <p>${r.Date}</p>
                    <div class="Edition">
                        <button onclick="DeleteReview(this,${r.Id})"><img src="../../Imgs/Trash-${r.Color}.png" alt=""></button>
                        <button><img src="../../Imgs/Pencil-${r.Color}.png" alt=""></button>
                    </div>
                </div>
                `);
            // Review.classList.add('Topic');
            // Review.classList.add(`${r.Color}-Review`);
            // Review.innerHTML = r.Date;

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
}

window.DeleteReview = DeleteReview;

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

    const TopicContainer = btn.parentElement.parentElement.parentElement;

    const Id = await GetLastReviewId();

    console.log(color);

    const Review = elementFromHtml(`
            <div class="Topic ${color}-Review">
                <p>${utc}</p>
                <div class="Edition">
                    <button onclick="DeleteReview(this,${Id[0].seq})"><img src="../../Imgs/Trash-${color}.png" alt=""></button>
                    <button><img src="../../Imgs/Pencil-${color}.png" alt=""></button>
                </div>
            </div>
        `)

    TopicContainer.appendChild(Review);
}

window.AddNewReview = AddNewReview;

function elementFromHtml(html){
    const template = document.createElement('template');

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}