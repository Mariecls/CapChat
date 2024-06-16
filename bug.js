const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'CapChat', 'public')));

app.set('views', path.join(__dirname, 'CapChat', 'views'));
app.set('view engine', 'ejs');

app.get('/captcha', (req, res) => {
    try {
        const neutresDir = path.join(__dirname, 'CapChat', 'public', 'images', 'neutres');
        const singuliersDir = path.join(__dirname, 'CapChat', 'public', 'images', 'singuliers');

        const neutres = fs.readdirSync(neutresDir).filter(file => file.startsWith('chat_neutre'));
        const singulieres = fs.readdirSync(singuliersDir).filter(file => file.startsWith('chat_'));

        if (neutres.length < 7) {
            throw new Error('Pas assez d\'images neutres disponibles.');
        }
        if (singulieres.length === 0) {
            throw new Error('Aucune image singulière trouvée.');
        }

        const selectedNeutres = getRandomSelection(neutres, 7);
        const selectedSinguliere = getRandomItem(singulieres);

        const images = selectedNeutres.map((img, index) => ({
            src: `/images/neutres/${img}`,
            id: `neutre-${index}`
        }));
        images.push({
            src: `/images/singuliers/${selectedSinguliere}`,
            id: 'singuliers'
        });

        const shuffledImages = shuffleArray(images);

        res.render('captcha', { images: shuffledImages });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/captcha', (req, res) => {
    const { selectedImageId, singularImageId } = req.body;

    if (selectedImageId === singularImageId) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function getRandomSelection(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled;
}
