import { CreateTopic } from "../../Data/TopicContext.js";
//const { CreateTopic } = require("../../Data/TopicContext.js");
const Container = document.getElementById('Cont');

// let AddNewTopic = 0;

function SetSubjectInfo()
{
    let SubjectName = localStorage.getItem('Current-Subject');
    
    const Title = document.getElementById('Course-Title');

    Title.innerText = SubjectName;
}

SetSubjectInfo();

document.addEventListener("keydown",(e) => {
    if(e.key == 'Enter')
    {
        const Topic = document.getElementById('New');
        if(Topic)
        {
            const TopicContainer = document.getElementById('New-Tcontainer');

            const ReviewAdder = elementFromHtml(`
                <div class="Topic Adder">
                    2024/9/4
                    <div>
                        <button class="R" onclick="AddNewReview(this)"></button>
                        <button class="Y" onclick="AddNewReview(this)"></button>
                        <button class="G" onclick="AddNewReview(this)"></button>
                    </div>
                </div>
                `);
            
            const TopicInputBox = document.getElementById('Temp');

            Topic.removeChild(TopicInputBox);
            Topic.innerText = TopicInputBox.value;
            Topic.id = '';

            TopicContainer.appendChild(ReviewAdder);
            TopicContainer.id = '';

            CreateTopic(Topic.innerText,localStorage.getItem('Current-Subject'));
        }
    }

});

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

function AddNewReview(btn)
{
    const Review = document.createElement('div');
    Review.classList.add('Topic');
    
    switch(btn.classList[0])
    {
        case 'R':
            Review.classList.add('Red-Review');
            break;
        case 'Y':
            Review.classList.add('Yellow-Review');
            break;
        case 'G':
            Review.classList.add('Green-Review');
            break;
    }

    const TopicContainer = btn.parentElement.parentElement.parentElement;

    TopicContainer.appendChild(Review);
}

window.AddNewReview = AddNewReview;

function elementFromHtml(html){
    const template = document.createElement('template');

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}