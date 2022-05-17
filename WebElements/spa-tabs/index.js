function activate(target, page){
    let tabs = document.getElementsByClassName('tab');
    let pages = document.getElementsByClassName('page');
    let targetPage = document.getElementById(page);
    let i;

    // clear tabs from active state and hide page
    for(i = 0; i < tabs.length; i++){
        if(tabs[i].classList.contains('active')){
            tabs[i].classList.remove('active');
        }
        if(pages[i].classList.contains('active')){
            pages[i].classList.remove('active');
        }
    }

    // add active class to selected tab
    target.classList.add('active');
    
    // display selected page
    targetPage.classList.add('active');
}