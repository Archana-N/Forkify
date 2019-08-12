import { elements, limitRecipeTitle } from './base';

export const toggleLikeButton = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    // icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = numberOfLikes => {
    elements.likesMenu.style.visibility = (numberOfLikes > 0) ? 'visible' : 'hidden';
};

export const renderLikedRecipes = likedRecipe => {
    const markup = `
        <li>
            <a class="likes__link" href="#${likedRecipe.id}">
                <figure class="likes__fig">
                    <img src="${likedRecipe.image}" alt="${likedRecipe.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(likedRecipe.title)}</h4>
                    <p class="likes__author">${likedRecipe.author}</p>
                </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLikedRecipe = unLikedRecipeId => {
    const element = document.querySelector(`.likes__link[href*="${unLikedRecipeId}"]`).parentElement;
    
    if(element) element.parentElement.removeChild(element);
};