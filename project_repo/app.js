const searchButton=document.getElementById('search-button');
const searchMessage=document.querySelector('.search-message');

searchButton.addEventListener('click', () => {
    searchMessage.hidden = false;
});

//Add to cart button when clicked

const addButtons = document.querySelectorAll('.add-to-cart');

addButtons.forEach((button) => {
    button.addEventListener('click', () => {
        button.nextElementSibling.hidden = false;
    });
});
