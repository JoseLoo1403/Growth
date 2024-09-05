const Navbar = document.getElementById('Nav');

function NavAnimation()
{
    if(Navbar.classList.contains('Close'))
    {
        Navbar.classList.remove('Close');
    }
    else
    {
        Navbar.classList.add('Close');
    }
}

function GotToOtherPage(dir){
    window.location.href = dir;
}