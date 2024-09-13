let Content;

function OptionsBtn(e)
{
    //const Content = e.parent.querySelector('.Content');
    Content = e.parentElement.querySelector('.Content');
    
    if(Content.classList.contains('Hide-Content'))
    {
        Content.classList.remove('Hide-Content');
        Content.classList.add('Show-Content');
    }
    else
    {
        Content.classList.add('Hide-Content');
        Content.classList.remove('Show-Content');
    }

    e.addEventListener("focusout",FocusClose);
}

function FocusClose()
{
    Content.classList.add('Hide-Content');
    Content.classList.remove('Show-Content');
}

window.OptionsBtn = OptionsBtn;