const express = require('express');
const router = express.Router();
const db = require('./dbInterface.js')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')

// /features/
// /features/search?
router.put('/features', async (req, res) => {
    // console.log('PUT feature : ' + req.body.featureName);
    const result = await db.updateFeature({
        name: req.body.featureName,
        otherNames: req.body.otherNames,
        description: req.body.description,
        mainCategory: req.body.mainCategory,
        subCategory: req.body.subCategory,
        reference: req.body.reference,
        isInternal: req.body.isInternal,
    });

    if (result !== true) {
        res.status(500).send({ error: 'create/update feature Failed!' });
    }
    res.end();
});
router.get('/features', async (req, res) => {
    // console.log('GET feature');
    const features = await db.findFeature('');
    // console.log(features);
    res.send({ features });
    res.end();
});

// /customers
// /customers?fields=xxx,yyy,zzz
router.put('/customers', async (req, res) => {
    // console.log('PUT customer : '+ req.body.customerName);
    const result = await db.updateCustomer({
        name: req.body.customerName,
        info: req.body.customerInfo,
        isInternal: req.body.isInternal,
    });

    if (result !== true) {
        res.status(500).send({ error: 'create/update customer Failed!' });
    }
    res.end();
});
router.post('/customers', async (req, res) => {
    // console.log('POST customer : '+ req.body.customerName);
    const customer = await db.findCustomer(req.body.customerName);
    // console.log(customer);
    if(customer === null) {
        const result = await db.createCustomer({
            name: req.body.customerName,
            info: req.body.customerInfo,
            isInternal: req.body.isInternal,
        });

        if(result !== true) {
            res.status(500).send({error: 'create customer Failed!'});
        }
    }
    else {
        res.status(500).send({error: 'create customer duplicated!'});
    }
    res.end();
});
router.get('/customers', async (req, res) => {
    // console.log('GET customer');
    const customers = await db.findCustomer('');
    // console.log(customers);
    res.send({ customers });
    res.end();
});

// /projects
// /projects/search?
router.put('/projects', async (req, res) => {
    // console.log('PUT project : '+ req.body.projectName);
    const customer = await db.findCustomer(req.body.customer);
    // console.log('customer: '+customer);
    if (!customer) {
        res.status(500).send({ error: 'Customer not exist!' });
        res.end();
        return;
    }

    const projects = await db.findProject('');
    for (let p of projects) {
        if(req.body.otherNames.indexOf(p.name) !== -1) {
            res.status(500).send('An existed project whose name appears in configured otherNames!');
            res.end();
            return;
        }

        if (p.otherNames.indexOf(req.body.projectName) !== -1) {
            res.status(500).send('Configured project name appears in some project\'s otherNames!');
            res.end();
            return;
        }
    }

    let result = await db.updateProject({
        name: req.body.projectName,
        otherNames: req.body.otherNames,
        // customer: { a: customer._id, b: customer.name },
        customer: customer.name,
        description: req.body.description,
    });

    if (result !== true) {
        res.status(500).send({ error: 'create/update project Failed!' });
        res.end();
        return;
    }

    // const project = await db.findProject(req.body.projectName);
    // console.log('project: ' + project);
    customer.projects.push(req.body.projectName);
    result = await db.updateCustomer(customer);

    if (result !== true) {
        res.status(500).send({ error: 'create/update customer Failed!' });
        res.end();
        return;
    }
    res.end();
});
router.post('/projects', async (req, res) => {
    // console.log('POST project : '+ req.body.projectName);
    const project = await db.findProject(req.body.projectName);
    // console.log(project);
    if (project === null) {
        const result = await db.createProject({
            name: req.body.projectName,
            otherNames: req.body.otherNames,
            description: req.body.description,
        });

        if (result !== true) {
            res.status(500).send({ error: 'create project Failed!' });
        }
    }
    else {
        res.status(500).send({ error: 'create project duplicated!' });
    }
    res.end();
});
router.get('/projects', async (req, res) => {
    // console.log('GET project');
    const projects = await db.findProject('');
    // console.log(projects);
    res.send({ projects });
    res.end();
});


// /jobs
// /jobs/search?
router.put('/jobs', async (req, res) => {
    // console.log('PUT job : ' + req.body.content);

    const projects = await db.findProject('');
    const project = projects.find(function(element){
        const name = element.otherNames.find(e => e === req.body.project);
        return (name === undefined) ? false : true;
    });
    const projectName = (project === undefined)? req.body.project : project.name;

    let result;
    let data = {
        customer: req.body.customer,
        project: projectName,
        feature: req.body.feature,
        effort: req.body.effort,
        content: req.body.content,
        owner: req.body.owner,
        date: req.body.date,
    };

    if(req.body._id === '') {
        result = await db.createJob(data);
    }
    else {
        data._id = req.body._id;
        result = await db.updateJob(data);
    }

    if (result !== true) {
        res.status(500).send({ error: 'create/update job Failed!' });
    }
    res.end();
});
router.get('/jobs', async (req, res) => {
    // console.log('GET job : '+ req.query);
    // console.log(req.query.date);
    // console.log(req.query.user);
    const jobs = await db.findJob({ date: req.query.date, owner: req.query.user});
    // console.log(jobs);
    res.send({ jobs });
    res.end();
});
router.delete('/jobs', async (req, res) => {
    // console.log('Del job : ' + req.query_id);
    const jobs = await db.deleteJob(req.query._id);
    // console.log(jobs);
    res.send({ jobs });
    res.end();
});

router.get('/offdays', async (req, res) => {
    // console.log('GET offdays');
    const offdays = await db.findOffday();
    // console.log(offdays);
    res.send({ offdays });
    res.end();
});
router.put('/offdays', async (req, res) => {
    // console.log('PUT offdays : ' + req.body.offdays);

    let result;
    
    if (req.body.offdays === null) {
        result = await db.deleteOffday(req.body.offdays);
        if (result !== true) {
            res.status(500).send({ error: 'Empty offday Failed!' });
        }
        res.end();
        return;
    }
    
    const oldOffdays = await db.findOffday();
    
    req.body.offdays.forEach(async function(newOffday) {
        const found = oldOffdays.find(e => e.date === newOffday);
        if (found === undefined) {
            result = await db.createOffday({date: newOffday});
            
            if (result !== true) {
                res.status(500).send({ error: 'Add offday Failed!' });
                res.end();
            }
        }
    });

    oldOffdays.forEach(async function (oldOffday) {
        const found = req.body.offdays.find(e => e === oldOffday.date);
        if (found === undefined) {
            result = await db.deleteOffday(oldOffday);

            if (result !== true) {
                res.status(500).send({ error: 'Remove offday Failed!' });
                res.end();
            }
        }
    });

    res.end();
});

// /efforts/calculate?

router.post('/register', async (req, res, next) => {
    const { name, password } = req.body;
    const group = (name === 'admin') ? db.priviledge.administrator:db.priviledge.normal;
    const result = await db.registerUser(name, password, group);
    // TODO: Need more error handling
    if (result === 'existed') {
        res.send({ message: 'existed' });
    }
    res.end();
});
router.put('/users', async (req, res) => {
    // console.log('PUT users');
    const result = await db.updateUser({
        name: req.body.name,
        password: req.body.password,
        group: req.body.group,
    });

    if (result !== true) {
        res.status(500).send({ error: 'create/update user Failed!' });
    }
    res.end();
});
router.get('/users', async (req, res) => {
    // console.log('GET users');
    const users = await db.findUser('');
    // console.log(users);
    res.send({ users });
    res.end();
});


router.post('/auth/login', async (req, res) => {
    const { name, password } = req.body;
    const userFound = await db.searchUser(name);
    const valid = (userFound.password === password);
    // console.log(userFound);

    if (!valid) {
        res.status(401).send({ message: 'Invalid username or password' });
        return;
    }
    const accessToken = jsonwebtoken.sign({ userFound }, 'dummy');

    res.json({ token: accessToken })
});
router.get('/auth/user', jwt({ secret: 'dummy' }), (req, res, next) => {
    // console.log(req.user);
    res.json({ user: req.user.userFound })
})
router.post('/auth/logout', (req, res, next) => {
    res.json({ status: 'OK' })
});

module.exports = router