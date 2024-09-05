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
            
            const TopicInputBox = document.getElementById('Temp');

            Topic.removeChild(TopicInputBox);
            Topic.innerText = TopicInputBox.value;
            Topic.id = '';
        }
    }

});

function AddNewTopic()
{
    const TopicContainer = document.createElement('div');
    TopicContainer.classList.add('Topic-Cont');

    const Topic = document.createElement('div');
    Topic.classList.add('Topic');
    Topic.id = 'New';

    const InputBox = document.createElement('Input');
    InputBox.id = 'Temp';

    Topic.appendChild(InputBox);
    TopicContainer.appendChild(Topic);

    Container.appendChild(TopicContainer);

    // alert('Hello');
}