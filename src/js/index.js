import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements, renderLoader, clearLoader } from './views/base';
import { WSAEINVAL } from 'constants';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
*/

const state = {};
//window.state = state;
/*
** SEARCH CONTROLLER
*/

const controlSearch = async () => {
    //1. Get query from View
    //const query = 'Banana Chocolate Almond'; 
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
            //console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calculateTime();
            state.recipe.calculateServings();
            
            // Render recipe
            //console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(recipeId));

        } catch(error) {
            console.log(error);
            alert('Error processing recipe!');
        }
        
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 


/*
** LIST CONTROLLER    
*/

const controlList = () => {
    // Create a new list if there is none yet
    if(!state.list) state.list = new List();

    // Add each ingredient to the List and the UI
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        listView.renderItem(item);
    });
}

// Handle Delete and Update list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        
        // Delete from UI
        listView.deleteItem(id);
    }
    // Handle the count update
    else if(e.target.matches('.shopping__count-value')) {
        const value = parseFloat(e.target.value);
        state.list.updateCount(id, value);
    }
});

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
    } else if(e.target.matches('.recipe__btn--add, recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    }

    //console.log(state.recipe);
});


/*
** LIKES CONTROLLER
*/

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});


const controlLike = () => {
    if(!state.likes) state.likes = new Likes();

    const currentRecipeId = state.recipe.id;

    // User HAS already liked current recipe
    if(state.likes.isLiked(currentRecipeId)) {
        // Remove LIKE from the state
        state.likes.deleteLike(currentRecipeId);

        // Toggle the LIKE button
        likesView.toggleLikeButton(false);

        // Remove LIKE from UI list
        //console.log(state.likes);
        likesView.deleteLikedRecipe(currentRecipeId);
    }
    // User has NOT yet liked current recipe
    else {
        // Add LIKE to the state
        const newLike = state.likes.addLike(
                currentRecipeId, 
                state.recipe.title, 
                state.recipe.author, 
                state.recipe.img
            );

        // Toggle the LIKE button
        likesView.toggleLikeButton(true);

        // Add LIKE to UI list
        //console.log(state.likes);
        likesView.renderLikedRecipes(newLike);
    }

    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes);

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLikedRecipes(like));
});

// Handling Likes button click
elements.likesList.addEventListener('click', e => {
    if(e.target.matches('.likes__list')) {
        likesView.renderLikedRecipes();
    }
});

//window.l = new List();