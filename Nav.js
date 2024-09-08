const { ipcRenderer } = require("electron");

const Navbar = document.getElementById('Nav');

function NavAnimation()
{
    if(Navbar.classList.contains('Close'))
    {
        Navbar.classList.remove('Close');
        localStorage.setItem('Nav-State','Open');
    }
    else
    {
        Navbar.classList.add('Close');
        localStorage.setItem('Nav-State','Close');
    }
}

function GotToOtherPage(dir){
    window.location.href = dir;
}

function CloseApp()
{
    ipcRenderer.send('TITLE-BAR',`Close`);
}

function Minimize(){
    ipcRenderer.send('TITLE-BAR','Minimize');
}

function MaxWin(){
    ipcRenderer.send('TITLE-BAR','Max');
}