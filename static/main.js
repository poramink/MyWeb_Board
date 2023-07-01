console.log('FeelFriend');


const sitescrolltop = document.querySelector('.site-scroll-top');
function scrollTop(){
    window.scrollTo({top:0, behavior:'smooth'});
}

if (!!sitescrolltop){
    sitescrolltop.addEventListener('click', scrollTop);
}