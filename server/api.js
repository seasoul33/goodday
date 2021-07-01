const express = require('express');
const router = express.Router();
const db = require('./dbInterface.js')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')

// /customers
// /customers?fields=xxx,yyy,zzz
router.put('/customers', async (req, res) => {
    // console.log('PUT customer : '+ req.body.customerName);

    let result;
    let data = {
        name: req.body.customerName,
        info: req.body.customerInfo,
        isInternal: req.body.isInternal,
    };

    if(req.body._id === '') {
        data.project = [];
        result = await db.createCustomer(data);
    }
    else {
        data._id = req.body._id;
        result = await db.updateCustomer(data);
    }

    if (result !== true) {
        res.status(500).send({ error: 'create/update customer Failed!' });
    }
    res.end();
});
// router.post('/customers', async (req, res) => {
//     // console.log('POST customer : '+ req.body.customerName);
//     const customer = await db.findCustomer(req.body.customerName);
//     // console.log(customer);
//     if(customer === null) {
//         const result = await db.createCustomer({
//             name: req.body.customerName,
//             info: req.body.customerInfo,
//             isInternal: req.body.isInternal,
//         });

//         if(result !== true) {
//             res.status(500).send({error: 'create customer Failed!'});
//         }
//     }
//     else {
//         res.status(500).send({error: 'create customer duplicated!'});
//     }
//     res.end();
// });
router.get('/customers', async (req, res) => {
    // console.log('GET customer');
    const customers = await db.findCustomer('');
    // console.log(customers);
    res.send({ customers });
    res.end();
});
router.delete('/customers', async (req, res) => {
    // console.log('Del customer : ' + req.query_id);
    const result = await db.deleteCustomer(req.query._id);
    // console.log(result);
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

    let result;
    let data = {
        name: req.body.projectName,
        otherNames: req.body.otherNames,
        // customer: { a: customer._id, b: customer.name },
        customer: customer.name,
        description: req.body.description,
    };

    if(req.body._id === '') {
        result = await db.createProject(data);
    }
    else {
        data._id = req.body._id;
        result = await db.updateProject(data);
    }

    if (result !== true) {
        res.status(500).send({ error: 'create/update project Failed!' });
        res.end();
        return;
    }

    if(req.body._id !== '') {
        const project = projects.find(element => {return element.name === req.body.projectName});
        if(project.customer !== req.body.customer) {
            let oldCustomer = await db.findCustomer(project.customer);
            oldCustomer.projects.splice(oldCustomer.projects.indexOf(req.body.projectName), 1);
            result = await db.updateCustomer(oldCustomer);

            if (result !== true) {
                res.status(500).send({ error: 'create/update old customer Failed!' });
                res.end();
                return;
            }
        }
    }
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
router.delete('/projects', async (req, res) => {
    // console.log('Del project : ' + req.query_id);
    const result = await db.deleteProject(req.query._id);
    // console.log(result);
    res.end();
});

// /tasktypes
// /tasktypes/search?
router.put('/tasktypes', async (req, res) => {
    // console.log('PUT task type : '+ req.body.tasktypeName);

    let result;
    let data = {
        name: req.body.tasktypeName,
        description: req.body.description,
    };

    if(req.body._id === '') {
        result = await db.createTasktype(data);
    }
    else {
        data._id = req.body._id;
        result = await db.updateTasktype(data);
    }

    if (result !== true) {
        res.status(500).send({ error: 'create/update task type Failed!' });
    }
    res.end();
});
router.get('/tasktypes', async (req, res) => {
    // console.log('GET task type');
    const tasktypes = await db.findTasktype('');
    // console.log(tasktypes);
    res.send({ tasktypes });
    res.end();
});
router.delete('/tasktypes', async (req, res) => {
    // console.log('Del task type : ' + req.query_id);
    const result = await db.deleteTasktype(req.query._id);
    // console.log(result);
    res.end();
});

// /features/
// /features/search?
router.put('/features', async (req, res) => {
    // console.log('PUT feature : ' + req.body.featureName);

    let result;
    let data = {
        name: req.body.featureName,
        otherNames: req.body.otherNames,
        description: req.body.description,
        mainCategory: req.body.mainCategory,
        subCategory: req.body.subCategory,
        reference: req.body.reference,
        isInternal: req.body.isInternal,
    };

    if(req.body._id === '') {
        result = await db.createFeature(data);
    }
    else {
        data._id = req.body._id;
        result = await db.updateFeature(data);
    }

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
router.delete('/features', async (req, res) => {
    // console.log('Del feature : ' + req.query_id);
    const result = await db.deleteFeature(req.query._id);
    // console.log(result);
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
        tasktype: req.body.tasktype,
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
    // console.log('GET job : '+ JSON.stringify(req.query));
    const jobs = await db.findJob(Object.assign({}, req.query));
    // console.log(jobs);
    res.send({ jobs });
    res.end();
});
router.delete('/jobs', async (req, res) => {
    // console.log('Del job : ' + req.query_id);
    const result = await db.deleteJob(req.query._id);
    // console.log(result);
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
    const result = await db.registerUser({name, password, group});
    // TODO: Need more error handling
    if (result === 'existed') {
        res.send({ message: 'existed' });
    }
    res.end();
});
router.put('/users', async (req, res) => {
    // console.log('PUT users');

    let result;
    let data = {
        name: req.body.name,
        password: req.body.password,
        group: req.body.group,
    };

    if(req.body._id === '') {
        result = await db.registerUser(data);
    }
    else {
        data._id = req.body._id;
        result = await db.updateUser(data);
    }

    if (result !== true) {
        if(result == 'existed') {
            res.end();
            // how to pass error code to frontend vue to display?
        }
        else {
        res.status(500).send({ error: 'create/update user Failed!' });
    }
    }
    res.end();
});
// router.put('/userhistory', async (req, res) => {
//     // console.log('PUT userhistory');
//     const user = await db.findUser(req.body.name);

//     console.log(Object.keys(user.history));
//     console.log(Object.getOwnPropertyNames(user.history));

//     // Object.keys(user.history).map(function(key, index){
//         // console.log(key)
//     //     user.history[key].push(req.body.history[key]);
//     // });

//     // const result = await db.updateUser(user);

//     // if (result !== true) {
//     //     res.status(500).send({ error: 'create/update user Failed!' });
//     // }
//     res.end();
// });
router.get('/users', async (req, res) => {
    // console.log('GET users');
    const users = await db.findUser('');
    // console.log(users);
    res.send({ users });
    res.end();
});
router.delete('/users', async (req, res) => {
    // console.log('Del user : ' + req.query_id);
    const result = await db.deleteUser(req.query._id);
    // console.log(result);
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