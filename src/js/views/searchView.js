import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
    // Render results of current page
    // Pagination: Display only 10 results per page
    //console.log(recipes);

    const start = (page - 1) * resultPerPage; // page 1: start = 0; page 2: start = 10; page 3: start = 20;
    const end = page * resultPerPage; // page 1: end = 9; page 2: end = 19; page 3: end = 29;

    //recipes.forEach(renderRecipe); // all recipes without pagination
    recipes.slice(start, end).forEach(renderRecipe); // "end" is optional: Zero-based index before which to end extraction. "slice" extracts up to but not including "end".

    // Render pagination buttons
    renderButtons(page, recipes.length, resultPerPage);
};

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const highlightedSelected = recipeId => {
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    resultsArray.forEach(element => {
        element.classList.remove('results__link--active');
    });

    // document.querySelector(`a[href*="#${recipeId}""]`) --> Select all Links (i.e., 'a' elements) with 'href' starting with '#', then followed by 'recipeId'    
    document.querySelector(`a[href*="#${recipeId}"]`).classList.add('results__link--active');
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

/*
// 'Pasta with tomato and spinach'
accumulator = 0; current = 'Pasta'; (accumulator + current.length) = 5;  newTitle = ['Pasta']
accumulator = 5; current = 'with'; (accumulator + current.length) = 9;  newTitle = ['Pasta', 'with']
accumulator = 9; current = 'tomato'; (accumulator + current.length) = 15;  newTitle = ['Pasta', 'with', 'tomato']
accumulator = 15; current = 'and'; (accumulator + current.length) = 18;  newTitle = ['Pasta', 'with', 'tomato',]
accumulator = 18; current = 'spinach'; (accumulator + current.length) = 24;  newTitle = ['Pasta', 'with', 'tomato',]
*/
const limitRecipeTitle = (title, limit = 17) => {    
    const newTitle = [];
    
    if(title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            if(accumulator + current.length <= limit){
                newTitle.push(current);
            }

            return (accumulator + current.length);
        }, 0); //start with 'accumulator = 0'

        // return the result
        return `${newTitle.join(' ')} ...`;
    }

    return title;
};

const renderButtons = (page, numberOfResults, resultsPerPage) => {
    const pages = Math.ceil(numberOfResults / resultsPerPage); // gives the number of pages present
    
    let button;
    if(page === 1 && pages > 1) { // first page and total pages > 1
        // Button visible ONLY to go to NEXT page
        button = createButton(page, 'next');
    }
    else if (page < pages) { // middle page/s
        // Both Buttons visible to go to NEXT and PREVIOUS pages
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    else if(page === pages && pages > 1) { // last page and total pages > 1
        // Button visible ONLY to go to PREVIOUS page
        button = createButton(page, 'prev');
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

// type = 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>

        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>        
    </button>
`;