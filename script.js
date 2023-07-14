const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for getting meal list
app.get('/meals/:ingredient', async (req, res) => {
    try {
        const searchInputTxt = req.params.ingredient;
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`);
        const data = await response.json();

        let html = "";
        if (data.meals) {
            data.meals.forEach(meal => {
                html += `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="food">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="#" class="recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            res.send(html);
        } else {
            res.send("Sorry, we didn't find any meal!");
        }
    } catch (error) {
        res.status(500).send("Error occurred while fetching meal list");
    }
});

// Handle other routes and send 'index.html' for any unmatched route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
