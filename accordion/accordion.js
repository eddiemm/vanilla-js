console.log("ready");

const accordionTriggers = document.getElementsByClassName('accordion__trigger');

const accordionMousedown = (evt) => {
    const trigger = evt.target;
    trigger.classList.toggle('active');

    const content = trigger.nextElementSibling;
    content.style.height ? content.style.height = null: content.style.height = content.scrollHeight + 'px'; 
}

let i;
for(i = 0; i < accordionTriggers.length; i++){
    accordionTriggers[i].addEventListener('mousedown', accordionMousedown);
}
