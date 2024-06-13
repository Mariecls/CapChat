const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'CapChat', 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Welcome to Cap\'Chat');
});

app.get('/captcha', (req, res) => {
    try {
        const neutresDir = path.join(__dirname, 'CapChat', 'images', 'neutres');
        const singuliersDir = path.join(__dirname, 'CapChat', 'images', 'singuliers');

        console.log('Neutres directory:', neutresDir);
        console.log('Singuliers directory:', singuliersDir);

        const neutres = fs.readdirSync(neutresDir).filter(file => file.startsWith('chat_neutre'));
        const singulieres = fs.readdirSync(singuliersDir).filter(file => file.startsWith('chat_'));

        console.log('Neutres images:', neutres);
        console.log('Singulieres images:', singulieres);

        if (singulieres.length === 0) {
            throw new Error('Aucune image singulière trouvée.');
        }

        const indices = fs.readFileSync(path.join(__dirname, 'CapChat', 'indices.txt'), 'utf-8')
                            .split('\n')
                            .map(line => line.trim());

        const selectedNeutres = neutres.sort(() => 0.5 - Math.random()).slice(0, 7);
        const selectedSinguliere = singulieres[Math.floor(Math.random() * singulieres.length)];
        const selectedIndex = singulieres.indexOf(selectedSinguliere);

        const images = selectedNeutres.map((img, index) => ({
            src: `/CapChat/images/neutres/${img}`,
            id: `neutre-${index}`
        }));
        images.push({
            src: `/CapChat/images/singuliers/${selectedSinguliere}`,
            id: 'singuliers'
        });

        res.render('captcha', { images: images.sort(() => 0.5 - Math.random()), index: selectedIndex, indices: indices });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
