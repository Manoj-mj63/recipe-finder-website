// ===========================================
// Selecting HTML Elements
// ===========================================
const recipeCount=document.getElementById("recipeCount");
const topBtn=document.getElementById("topBtn");
const favoriteCount = document.getElementById("favoriteCount");
const toast = document.getElementById("toast");
const themeBtn = document.getElementById("themeBtn");
const loader = document.getElementById("loader");
const randomBtn = document.getElementById("randomBtn");
const categoryCards = document.querySelectorAll(".category-card");
const sectionTitle = document.getElementById("sectionTitle");
const favoriteBtn = document.getElementById("favoriteBtn");
const recipeModal = document.getElementById("recipeModal");
const modalBody = document.getElementById("modalBody");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipeContainer = document.getElementById("recipeContainer");
// ===========================================
// Favorites
// ===========================================

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ===========================================
// Fetch Recipes
// ===========================================

async function fetchRecipes(recipeName) {

    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`
        );

        const data = await response.json();

        displayRecipes(data.meals);
        loader.style.display = "none";

    } catch (error) {

        console.log(error);

    }

}
// ===========================================
// Random Recipe
// ===========================================
loader.style.display = "flex";

recipeContainer.innerHTML = "";
async function randomRecipe(){

    try{

        const response = await fetch(
            "https://www.themealdb.com/api/json/v1/1/random.php"
        );

        const data = await response.json();

        displayRecipes(data.meals);
        loader.style.display = "none";
        sectionTitle.innerHTML = "🎲 Surprise Recipe";

    }

    catch(error){

    loader.style.display="none";

    console.log(error);

}

}
// ===========================================
// Fetch Recipes By Category
// ===========================================
loader.style.display = "flex";

recipeContainer.innerHTML = "";
async function fetchCategory(category){

    try{
         loader.style.display = "flex";
          recipeContainer.innerHTML = "";
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
        );

        const data = await response.json();

        displayRecipes(data.meals);
        loader.style.display = "none";

        sectionTitle.innerHTML = `${category} Recipes`;

    }

    catch(error){

        console.log(error);

    }

}

// ===========================================
// Display Recipes
// ===========================================

function displayRecipes(recipes) {

    recipeContainer.innerHTML = "";

    if (!recipes) {

        recipeContainer.innerHTML = `
            <h2>No Recipes Found 😔</h2>
        `;

        return;
    }
recipeCount.innerHTML=`${recipes.length} Recipes Found`;
    recipes.forEach(recipe => {

        const card = document.createElement("div");

        card.classList.add("recipe-card");

        card.innerHTML = `

            <div class="recipe-image">

                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">

                <span class="rating">
                    ⭐ 4.8
                </span>

            <button
class="heart-btn ${favorites.some(item => item.idMeal === recipe.idMeal) ? 'active-heart' : ''}"

onclick="toggleFavorite('${recipe.idMeal}')">

<i class="fa-solid fa-heart"></i>

</button>

            </div>

            <div class="recipe-content">

                <h3>${recipe.strMeal}</h3>

                <p class="cuisine">
    🍽 ${recipe.strArea || "Recipe"}
</p>

                <button class="view-btn" onclick="showRecipeDetails('${recipe.idMeal}')">
                         View Recipe
                              </button>

            </div>

        `;

        recipeContainer.appendChild(card);

    });

}
// ===========================================
// Show Recipe Details
// ===========================================

async function showRecipeDetails(id) {

    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );

        const data = await response.json();

        const recipe = data.meals[0];
        // ===========================================
// Ingredients List
// ===========================================

let ingredients = "";

for(let i = 1; i <= 20; i++){

    const ingredient = recipe[`strIngredient${i}`];

    const measure = recipe[`strMeasure${i}`];

    if(ingredient && ingredient.trim() !== ""){

        ingredients += `
            <li>
                ✔ ${measure} ${ingredient}
            </li>
        `;

    }

}

        modalBody.innerHTML = `

            <img src="${recipe.strMealThumb}" class="modal-image">

            <h2>${recipe.strMeal}</h2>

            <p><strong>Category:</strong> ${recipe.strCategory}</p>

            <p><strong>Cuisine:</strong> ${recipe.strArea}</p>

             <h3>📝 Ingredients</h3>

<ul class="ingredients-list">

    ${ingredients}

</ul>

<h3>👨‍🍳 Instructions</h3>

<p class="instructions">

    ${recipe.strInstructions}

</p>

            <a href="${recipe.strYoutube}"
               target="_blank"
               class="youtube-btn">

               <i class="fa-brands fa-youtube"></i>
               Watch on YouTube

            </a>

        `;

        recipeModal.style.display = "flex";

    }

    catch(error){

        console.log(error);

    }

}
// ===========================================
// Add / Remove Favorites
// ===========================================

async function toggleFavorite(id){

    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    const data = await response.json();

    const recipe = data.meals[0];

    const exists = favorites.find(item => item.idMeal === id);

    if(exists){

        favorites = favorites.filter(item => item.idMeal !== id);

    }else{

        favorites.push(recipe);

    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
    updateFavoriteCount();

   fetchRecipes(searchInput.value || "chicken");

}
// ===========================================
// Toast Notification
// ===========================================

function showToast(message){

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2000);

}
// ===========================================
// Search Button
// ===========================================

searchBtn.addEventListener("click", () => {

    sectionTitle.innerHTML = "Popular Recipes 🔥";

    const recipeName = searchInput.value.trim();

    if(recipeName===""){

        alert("Please enter a recipe name.");

        return;

    }

    fetchRecipes(recipeName);

});
// ===========================================
// Search on Enter
// ===========================================

searchInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        searchBtn.click();

    }

});

// ===========================================
// Load Default Recipes
// ===========================================

fetchRecipes("chicken");
// ===========================================
// Close Modal
// ===========================================

document.querySelector(".close-btn").addEventListener("click", () => {

    recipeModal.style.display = "none";

});

window.addEventListener("click", (e) => {

    if (e.target === recipeModal) {

        recipeModal.style.display = "none";

    }

});
// ===========================================
// Show Favorite Recipes
// ===========================================

favoriteBtn.addEventListener("click", () => {

    sectionTitle.innerHTML = "❤️ My Favorite Recipes";
    if(favorites.length===0){

    recipeContainer.innerHTML=`

        <h2 style="text-align:center">

            ❤️ No Favorite Recipes Yet

        </h2>

    `;

}

else{

    displayRecipes(favorites);

}

});
// ===========================================
// Category Click
// ===========================================

categoryCards.forEach(card=>{

    card.addEventListener("click",()=>{

        const category = card.dataset.category;

        fetchCategory(category);

    });

});
randomBtn.addEventListener("click",()=>{

    randomRecipe();

});
// ===========================================
// Dark Mode
// ===========================================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        localStorage.setItem("theme","dark");

    }

    else{

        localStorage.setItem("theme","light");

    }

});
// ===========================================
// Load Saved Theme
// ===========================================

const savedTheme = localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark-mode");

}
// ===========================================
// Favorite Counter
// ===========================================

function updateFavoriteCount(){

    favoriteCount.innerHTML = favorites.length;

}
updateFavoriteCount();
window.addEventListener("scroll",()=>{

    if(window.scrollY>300){

        topBtn.style.display="block";

    }

    else{

        topBtn.style.display="none";

    }

});

topBtn.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});