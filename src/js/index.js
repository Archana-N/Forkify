import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
*/

const state = {};

/*
** SEARCH CONTROLLER
*/

const controlSearch = async () => {
    //1. Get query from View
    //const query = 'Banana Chocolate Almond'; //TODO
    const query = searchView.getInput();
    //console.log(query);

    if(query) {
        //2. New search object and add to 'state'
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();

        renderLoader(elements.searchResult);

        try {
            //4. Search for recipes
            await state.search.getResults();

            //5. Render results on UI
            clearLoader();

            searchView.renderResults(state.search.recipes); 

        } catch(error) {
            console.log(error);
            alert('Something wrong with the Search... ');
            clearLoader();
        }
               
    }    
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const button =  e.target.closest('.btn-inline');
    if(button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);
    }
});


/*
** RECIPE CONTROLLER    
*/

const controlRecipe = async () => {
    // Get Recipe ID from url
    const recipeId = window.location.hash.replace('#','');
    //console.log(recipeId);


    if(recipeId) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) 
            searchView.highlightedSelected(recipeId);
        
        // Create new recipe object
        state.recipe = new Recipe(recipeId);

        // TESTING
        //window.rec = state.recipe;
                
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calculateTime();
            state.recipe.calculateServings();
            
            // Render recipe
            //console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch(error) {
            console.log(error);
            alert('Error processing recipe!');
        }
        
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 

// Handling Recipe button clicks
elements.recipe.addEventListener('click', e => {

    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }

    console.log(state.recipe);
});
