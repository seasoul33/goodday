import mongoose from 'mongoose';
// import { objectTypeIndexer } from '@babel/types';
let http = require('http').createServer().listen(3001, '0.0.0.0');
let io = require('socket.io').listen(http);
// let io = require('socket.io')(3001);
let socket_io;
let dbCollection;
let userCollect = null;
let customerCollect = null;
let projectCollect = null;
let featureCollect = null;
let jobCollect = null;
let ObjectId = mongoose.Schema.Types.ObjectId;

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
    projects: [{ObjectId, String}], // project _id + project name
    isInternal: Boolean,
}

const projectSchema = {
    name: String,
    otherNames: [String],
    customer: {ObjectId, String}, // customer _id + customer name
    features: [ObjectId],
    description: String,

    // Other fields for project management
    // e.g. 
    //      estimated effort (maybe by phase)
    //      real effort (maybe by phase)
    //      event + action items + milestones
}

const jobSchema = {
    customer: {ObjectId, String},
    project: {ObjectId, String},
    feature: {ObjectId, String},
    content: String,
    owner: {ObjectId, String}, // username _id + username
    effort: Number,
    date: Date,
}

const topicSchema = {
    title: String,
    description: String,
    tags: Array,
    raisedAt: String,
    sponsor: String,
    seconded: Number,
    secondlist: Array,
    replied: Number,
    repliedTime: String,
    anwser: String,
    accept: Number,
    acceptlist: Array,
    suck: Number,
    sucklist: Array,
}

async function fetchData() {
    const bySecond = await dbCollection.find({}).sort({seconded: -1}).slice();
    const byTime = await dbCollection.find({}).sort({raisedAt: -1}).slice();
    return {bySecond,byTime};
}

async function changeCallback() {
    // console.log("DB updated...");

    // TODO: Should only update what's changed instead of whole data.
    if(socket_io) {
        socket_io.emit('mongo_sync', await fetchData());
    }
}

function socketinit(){
    io.on('connection', async function (socket) {
        console.log('socket connected:'+socket.id)
        socket_io = socket;
        socket.emit('mongo_sync', await fetchData());

        socket.on('delete', async function (msg) {
            // console.log(msg);
            // let result = await dbCollection.deleteOne({_id:msg._id});
            //console.log(result);
        });

        socket.on('update', async function (msg) {
            // console.log(msg);
            // let result = await dbCollection.updateOne({_id:msg._id}, msg);
            // console.log(result);
        });

        socket.on('insert', async function (msg) {
            // console.log(msg);
            // let result = await dbCollection.insertMany(msg);
            // console.log(result);
        });
    });
}


export function mongoInit(IPPort, callback) {
    let url = "mongodb://" + IPPort + "/myDB?replicaSet=replocal";
    mongoose.connect(url, {useNewUrlParser: true}, (err, res) => {
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

                    // dbCollection = mongoose.model('topics', new mongoose.Schema(topicSchema));
                    // dbCollection.watch().on('change', changeCallback);
                    socketinit();
                }
    });
}

export async function registerUser(user, passwd) {
    const account = await searchUser(user);
    if(account == null) {
        await userCollect.insertMany({username: user, password: passwd});
        return 'ok'; 
    }
    return 'existed';
}

export async function searchUser(user) {
    const account = await userCollect.findOne({username: user}).exec();
    // console.log(account);
    return account;
}