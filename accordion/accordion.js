const accordionTriggers = document.getElementsByClassName('accordion__trigger');

/* handle trigger click */
const accordionMousedown = (evt) => {
    const trigger = evt.target;

    /* toggle active class */
    trigger.classList.toggle('active');

    /* target div after the trigger */
    const content = trigger.nextElementSibling;

    /* change the height property for transition to take effect */
    content.style.height ? content.style.height = null: content.style.height = content.scrollHeight + 'px'; 
}


let i;
/* add a listener to each trigger */
for(i = 0; i < accordionTriggers.length; i++){
    accordionTriggers[i].addEventListener('mousedown', accordionMousedown);
}
