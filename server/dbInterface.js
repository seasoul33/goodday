import mongoose from 'mongoose';
let _ = require('lodash');
let http = require('http').createServer().listen(3001, '0.0.0.0');
let io = require('socket.io').listen(http);
let socket_io;
let userCollect = null;
let customerCollect = null;
let projectCollect = null;
let featureCollect = null;
let jobCollect = null;
// let ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = {
    username: String,
    password: String,
    history: {
        customer: Array,
        project: Array,
        function: Array,
        jobDescrition: Array,
    },
}

const featureSchema = {
    name: String,
    otherNames: [String],
    description: String,
    mainCategory: String,
    subCategory: String,
    reference: String,
    isInternal: Boolean,
}

const customerSchema = {
    name: String,
    info: String,
    projects: [String], // [{ ObjectId, String }], // project _id + project name
    isInternal: Boolean,
}

const projectSchema = {
    name: String,
    otherNames: [String],
    customer: String, //{ ObjectId, String }, // customer _id + customer name
    features: [String],
    description: String,

    // Other fields for project management
    // e.g. 
    //      estimated effort (maybe by phase)
    //      real effort (maybe by phase)
    //      event + action items + milestones
}

const jobSchema = {
    customer: String, //{ ObjectId, String },
    project: String, //{ ObjectId, String },
    feature: String, //{ ObjectId, String },
    effort: Number,
    content: String,
    owner: String, //{ ObjectId, String }, // username _id + username
    // date: Date,
    date: String,
}

async function changeCallback(who) {
    // console.log("DB updated...");

    // TODO: Should only update what's changed instead of whole data.
    if (socket_io) {
        socket_io.emit('data_sync', who);
    }
}

function socketinit() {
    io.on('connection', async function (socket) {
        console.log('socket connected:' + socket.id)
        socket_io = socket;
    });
}


export function init(IPPort, callback) {
    let url = "mongodb://" + IPPort + "/myDB?replicaSet=replocal";
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
        if (err) {
            console.log('Failed to connected to ' + url);
            return null;
        } else {
            console.log('Connected to ' + url);
            userCollect = mongoose.model('users', new mongoose.Schema(userSchema));
            customerCollect = mongoose.model('customers', new mongoose.Schema(customerSchema));
            projectCollect = mongoose.model('projects', new mongoose.Schema(projectSchema));
            featureCollect = mongoose.model('features', new mongoose.Schema(featureSchema));
            jobCollect = mongoose.model('jobs', new mongoose.Schema(jobSchema));

            customerCollect.watch().on('change', function(){
                changeCallback('customers');
            });

            projectCollect.watch().on('change', function () {
                changeCallback('projects');
            });

            featureCollect.watch().on('change', function () {
                changeCallback('features');
            });

            socketinit();
        }
    });
}

export async function registerUser(user, passwd) {
    const account = await searchUser(user);
    if (account == null) {
        await userCollect.insertMany({ username: user, password: passwd });
        return 'ok';
    }
    return 'existed';
}

export async function searchUser(user) {
    const account = await userCollect.findOne({ username: user }).exec();
    // console.log(account);
    return account;
}

export async function findFeature(featureName) {
    if (featureName === '') {
        return await featureCollect.find({}).sort({ name: 1 }).slice();
    }
    return await featureCollect.findOne({ name: featureName }).exec();
}

export async function createFeature(feature) {
    let result = true;
    await featureCollect.insertMany(feature, function (err, result) {
        result = false;
    });
    return result;
}

export async function updateFeature(feature) {
    let result = true;
    await featureCollect.updateOne({ name: feature.name }, feature, { upsert: true },
        function (err, result) {
            result = false;
        });
    return result;
}

export async function findCustomer(customerName) {
    if (customerName === '') {
        return await customerCollect.find({}).sort({ name: 1 }).slice();
    }
    return await customerCollect.findOne({ name: customerName }).exec();
}

export async function createCustomer(customer) {
    let result = true;
    await customerCollect.insertMany(customer, function(err, result) {
        result = false;
    });
    return result;
}

export async function updateCustomer(customer) {
    let result = true;
    await customerCollect.updateOne({ name: customer.name }, customer, { upsert: true },
            function(err, result){
                result = false;
            });
    return result;
}

export async function findProject(projectName) {
    if (projectName === '') {
        return await projectCollect.find({}).sort({ name: 1 }).slice();
    }
    return await projectCollect.findOne({ name: projectName }).exec();
}

export async function createProject(project) {
    let result = true;
    await projectCollect.insertMany(project, function (err, result) {
        result = false;
    });
    return result;
}

export async function updateProject(project) {
    let result = true;
    await projectCollect.updateOne({ name: project.name }, project, { upsert: true },
        function (err, result) {
            result = false;
        });
    return result;
}

export async function findJob(filter) {
    return await jobCollect.find(filter).sort({ customer: 1 }).slice();
    // return await jobCollect.findOne({ name: projectName }).exec();
}

export async function createJob(job) {
    let result = true;
    await jobCollect.insertMany(job, function (err, result) {
        result = false;
    });
    return result;
}

export async function updateJob(job) {
    let result = true;
    // console.log(job);
    await jobCollect.updateOne({ _id: job._id }, job, { upsert: true },
        function (err, result) {
            result = false;
        });
    return result;
}

export async function deleteJob(id) {
    let result = true;
    // console.log(id);
    await jobCollect.deleteOne({ _id: id },
        function (err, result) {
            result = false;
        });
    return result;
}