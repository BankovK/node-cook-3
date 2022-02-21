const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    const title = 'Express';
    req.log.info(`rendering index view with ${title}`);
    res.render('index', { title });
})

module.exports = router;
