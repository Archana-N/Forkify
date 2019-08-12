export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    searchResult: document.querySelector('.results'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader' // CSS class name for 'loader'
};

export const renderLoader = parent => {
    const loader = `
        <div class = "${elementStrings.loader}">
            <svg>
                <use href = "img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = parent => {
    const loader = document.querySelector(`.${elementStrings.loader}`);

    if(loader) {
        loader.parentElement.removeChild(loader);
    }
};

/*
// 'Pasta with tomato and spinach'
accumulator = 0; current = 'Pasta'; (accumulator + current.length) = 5;  newTitle = ['Pasta']
accumulator = 5; current = 'with'; (accumulator + current.length) = 9;  newTitle = ['Pasta', 'with']
accumulator = 9; current = 'tomato'; (accumulator + current.length) = 15;  newTitle = ['Pasta', 'with', 'tomato']
accumulator = 15; current = 'and'; (accumulator + current.length) = 18;  newTitle = ['Pasta', 'with', 'tomato',]
accumulator = 18; current = 'spinach'; (accumulator + current.length) = 24;  newTitle = ['Pasta', 'with', 'tomato',]
*/
export const limitRecipeTitle = (title, limit = 17) => {    
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