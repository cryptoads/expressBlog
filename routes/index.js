var express = require('express');
var router = express.Router();
const util = require('util');
const fs = require('fs');
const bodyParser = require('body-parser');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
    readFile('blog-data.json').then((data)=>{
        res.render('index', { title: 'myblog', blogPost: JSON.parse(data) })
});
});

router.get('/:id', (request, response) => {
    const id = Number(request.params.id);

    readFile('blog-data.json')
        .then((data) => {
            const blogData = JSON.parse(data)
            if (blogData[id]) {
                response.json(blogData[id]);
            } else {
                response.json({});
            }
        });
});

router.get('/blog/:postID', (req, res) =>{
        const postID = Number(req.params.postID);
        readFile('blog-data.json').then((data)=>{
        const blogData = JSON.parse(data)
            if (blogData[postID]) {
                res.render('blog-post', blogData[postID]);
            } else {
                res.json({});
            }
       
    })
})

router.get('/new/form', (req, res)=>{
    res.render('form', {title: 'myblog'})
})

router.post('/new/form', (req, res)=>{
        readFile('blog-data.json')
        .then((data) => {
            return JSON.parse(data);
        })
        .then((data) => {
            const id = Object.keys(data).length + 1;
            const date = new Date(Date.now());
            const dateString = (date.getMonth() + 1) + '/' + (date.getDay() + 1) + '/' + date.getFullYear();
            while (data[id]) {
                id++;
            }
            const newEntry = {
                id,
                date: dateString,
                ...req.body
            };
            data[id] = newEntry;

            return writeFile('blog-data.json', JSON.stringify(data, null, '\t'))
                .then(() => {
                    return newEntry;
                });
        })
        .then((newEntry) => {
            res.render('newEntry');
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

module.exports = router;
