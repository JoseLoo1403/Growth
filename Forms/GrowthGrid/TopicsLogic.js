import {DeleteTopicById,UpdateTopicById} from "../../Data/TopicContext.js";
import {UpdateLastReviewById} from "../../Data/SubjectContext.js";

function DeleteTopicForm(Id)
{
    const form = elementFromHtml(`
        <div class="Cover-Screen">
            <div class="Delete-Form">
                <p>Are you sure you want to delete this topic?</p>
                <div>
                    <button class="Btn-Cancel" onclick="BtnCancel(this)">Cancel</button>
                    <button class="Btn-Del" onclick="BtnDeleteTopic(${Id})">Delete</button>
                </div>
            </div>
        </div>
        `);
    document.body.appendChild(form);
}

window.DeleteTopicForm = DeleteTopicForm;

function BtnDeleteTopic(Id)
{
    DeleteTopicById(Id,sessionStorage.getItem('Current_Subject_Id'));
    location.reload();
}

window.BtnDeleteTopic = BtnDeleteTopic;

function BtnCancel(btn)
{
    document.body.removeChild(btn.parentElement.parentElement.parentElement);
}

window.BtnCancel = BtnCancel;

function elementFromHtml(html){
    const template = document.createElement('template');

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}

function BtnEditTopic(btn,Id)
{
    const TopicCard = btn.parentElement.parentElement;

    const NewName = document.createElement('input');
    const OldName = TopicCard.children[0];

    NewName.value = OldName.innerText;

    TopicCard.replaceChild(NewName,OldName);
    NewName.focus();
    
    const Buttons = TopicCard.children[1];

    TopicCard.removeChild(Buttons);

    const BlurHandler = function() {
        TopicCard.replaceChild(OldName,NewName);
        TopicCard.appendChild(Buttons);
        NewName.remove();
    };

    NewName.addEventListener('blur',BlurHandler);

    NewName.addEventListener("keypress", (e) => {
        if(e.key == 'Enter')
        {
            if(NewName.value.trim().length == 0) return;

            NewName.removeEventListener('blur',BlurHandler);
            EditTopic(Buttons,TopicCard,Id,NewName);
        }
    });
}

window.BtnEditTopic = BtnEditTopic;

function EditTopic(Buttons,TopicCard,Id,NewName)
{
    const TxtName = document.createElement('p');
    TxtName.innerText = NewName.value;

    TopicCard.replaceChild(TxtName,NewName);

    TopicCard.appendChild(Buttons);

    UpdateTopicById(NewName.value,Id);

    NewName.remove();
}