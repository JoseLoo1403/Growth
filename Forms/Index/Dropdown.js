let Content;

function OptionsBtn(e)
{

    if(Content != null)
    {
        Content.classList.add('Hide-Content');
        Content.classList.remove('Show-Content');
        Content = null;
    }

    Content = e.parentElement.querySelector('.Content');
    
    if(Content.classList.contains('Hide-Content'))
    {
        Content.classList.remove('Hide-Content');
        Content.classList.add('Show-Content');
    }

    e.addEventListener("focusout",FocusClose);
}

function FocusClose()
{
    setTimeout(() => {
        Content.classList.add('Hide-Content');
        Content.classList.remove('Show-Content');
        Content = null;
    },100)
}

window.OptionsBtn = OptionsBtn;


function BtnCancel(btn)
{
    document.body.removeChild(btn.parentElement.parentElement.parentElement);
}

window.BtnCancel = BtnCancel;