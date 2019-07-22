import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients; 
        }
        catch (error) {
            console.log(error);
            alert('Something went wrong! :(');
        }
    }

    calculateTime() {
        // Assumption: Roughly every 3 ingredient takes 15 minutes of cooking time
        const numberOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numberOfIngredients / 3); 
        this.time = periods * 15;
    }

    calculateServings() {
        // Assumption: every Recipe serves 4 people
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoons', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'jars', 'packages'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'jar', 'pkg'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(element => {
            // 1. Uniform units
            let ingredient = element.toLowerCase();
            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, unitsShort[index]);
            });

            // 2. Remove text inside parentheses (including parentheses)
            const regex = "/ *\([^)]*\) */g";
            
            ingredient = ingredient.replace(regex, ' ');

            // 3. Parse ingredients into count, unit and ingredient
            const arrayIngredients = ingredient.split(' ');
            const unitIndex = arrayIngredients.findIndex(element2 => units.includes(element2));

            let objectIngredient;

            if(unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups; arrayCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups; arrayCount is [4]
                const arrayCount = arrayIngredients.slice(0, unitIndex);

                let count;
                if(arrayCount.length == 1) {
                    // Ex. eval("2".replace('-', '+')) --> 2 ==> no '-' character here, hence no replace
                    // Ex. eval("1-1/4".replace('-', '+')) --> eval("1+1/4") --> 1.25
                    count = eval(arrayIngredients[0].replace('-', '+'));

                } else {   
                    // const fractionIndex = arrayIngredients.findIndex(x => x.includes("/"));
                    
                    // if(fractionIndex > 0) {
                    //     count = eval(arrayIngredients.slice(fractionIndex, unitIndex).join('+'));
                    // }
                    // else {
                    //     count = eval(arrayIngredients.slice(0, unitIndex).join('+'));
                    // }

                    count = eval(arrayIngredients.slice(0, unitIndex).join('+'));
                }

                objectIngredient = {
                    count,
                    unit: arrayIngredients[unitIndex],
                    ingredient: arrayIngredients.slice(unitIndex + 1).join(' ')
                };

            } else if(parseInt(arrayIngredients[0], 10)) {
                // There is NO unit, but the 1st element is a Number
                objectIngredient = {
                    count: parseInt(arrayIngredients[0], 10),
                    unit: '',
                    ingredient: arrayIngredients.slice(1).join(' ')
                };

            } else if(unitIndex === -1) {
                // There is NO unit and NO Number in 1st position
                objectIngredient = {
                    count: 1,
                    unit: '',
                    ingredient // In ES6 this equals=>  ingredient: ingredient
                };
            }

            return objectIngredient;

        });

        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ingredient => {
            // new ingredient count = old ingredient count * (new servings / old servings);
            ingredient.count *= (newServings / this.servings);
        })
        this.servings = newServings;
    }
}