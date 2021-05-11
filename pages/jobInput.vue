<template>
    <div class="container">
        <div class="container-calendar">
            <v-date-picker
                mode="single"
                v-model="selectedSingleDate"
                is-inline
                is-expanded
                is-required
                :attributes="calendarAttr"
                @input="updateJobs"
            />
        </div>

        <div>
            <span class="container-input">
                Customer:
                <autoSuggest
                    ref="first"
                    :sourceData="customerNamelist"
                    v-model="customerName"
                    holder="customer name..."
                />
            </span>

            <span class="container-input">
                Project:
                <autoSuggest
                    ref="project"
                    :sourceData="projectNameList"
                    v-model="projectName"
                    holder="project name..."
                />
            </span>

            <span class="container-input">
                Task Type:
                <autoSuggest
                    ref="tasktype"
                    :sourceData="taskTypeList"
                    v-model="tasktypeName"
                    holder="task type..."
                />
            </span>

            <span class="container-input">
                Feature/Function:
                <autoSuggest
                    ref="function"
                    :sourceData="featureNameList"
                    v-model="featureName"
                    holder="function name..."
                />
            </span>

            <span>
                Effort in hour:
                <br />
                <input type="number" v-model="workHour" class="container-effort">
                <br />
            </span>

            <span class="container-input">
                Job description:
                <br />
                <textarea class="container-text" placeholder="job description..."
                    v-model="jobDescription">
                </textarea>
            </span>

            <div class="container-button">
                <b-button
                    class="new-button"
                    size="sm"
                    variant="primary"
                    @click="addJobs('add')">Add
                </b-button>
                <b-button
                    class="new-button"
                    size="sm"
                    variant="primary"
                    :disabled="editButtonDisabled"
                    @click="addJobs('edit')">Edit
                </b-button>
                <b-button
                    class="new-button"
                    size="sm"
                    variant="primary"
                    @click="clearJob">Clear
                </b-button>
            </div>
        </div>

        <div>
            <b-table 
                table-variant="primary"
                head-variant="dark"
                striped
                hover
                small
                fixed
                :fields="fields"
                :items="displayedJobs"
                @row-clicked="selectJob" >
                <template v-slot:cell(action)="data">
                    <b-button
                        class="new-button"
                        size="sm"
                        variant="danger"
                        @click="deleteJob(data.index)">Del
                    </b-button>
                </template>
                <!-- <template v-slot:cell()="data">
                    <i>{{ data.value }}</i>
                </template> -->
            </b-table>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import autoSuggest from '~/components/autoSuggest.vue';
import { setupCalendar, DatePicker} from 'v-calendar';
import 'v-calendar/lib/v-calendar.min.css';
//import { BTable } from 'bootstrap-vue';
//import moment from 'moment';
import lang from 'lodash/lang';

setupCalendar({
  firstDayOfWeek: 2,  // Monday,
});

export default {
    components: {
        autoSuggest,
        setupCalendar,
        'v-date-picker': DatePicker,
    },
        
    mounted: async function() {
        this.setFocus("first");
        this.updateJobs();
    },

    props: {
        currentUser: Object,
        customers: Array,
        projects: Array,
        tasktypes: Array,
        features: Array,
        today: Object,
        holiday: Object,
        offday: Array,
    },

    watch: {
        currentUser: {
            deep: true,
            handler(newVal, oldVal) {
                this.updateJobs();
            },
        },

        offday: {
            deep: true,
            handler(value) {
                this.offdayAttr = lang.cloneDeep(value);
            },
        },
    },

    data: function() {
        return {
            editButtonDisabled: true,
            jobs: [],
            customerName: '',
            projectName: '',
            tasktypeName: '',
            featureName: '',
            workHour: 0,
            jobDescription: '',
            jobId: '',
            selectedSingleDate: new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate()),
            fields:[
                'customer',
                'project',
                'tasktype',
                'feature',
                'effort',
                'content',
                { key: 'action', label: ''}
            ],
            offdayAttr: this.offday,
        };
    },

    computed: {
        loginAccount: function() {
            this.updateJobs();
            return this.currentUser.name;
        },

        calendarAttr: function() {
            return [this.today, this.holiday, {
                key: 'offday',
                highlight: {
                    backgroundColor: 'silver',
                },
                dates: this.offdayAttr,
            }];
        },

        customerNamelist: function(){
            return this.customers.map(function(element){
                return element.name;
            });
        },

        projectNameList: function(){
            let self = this;
            return this.projects.reduce(function(result, project){
                if(project.customer===self.customerName) {
                    result.push(project.name);
                    result = result.concat(project.otherNames);
                }
                return result;
            }, []);
        },

        taskTypeList: function(){
            return this.tasktypes.map(function(element){
                return element.name;
            });
        },

        featureNameList: function(){
            return this.features.map(function(element){
                return element.name;
            });
        },

        selectedDateEPOCH: function() {
            // console.log(this.selectedSingleDate.toLocaleDateString());
            // console.log(this.selectedSingleDate.getTime());
            // return this.selectedSingleDate.toLocaleDateString();
            return this.selectedSingleDate.getTime();
        },

        displayedJobs: function() {
            let newJobs = this.jobs.map(j => (lang.cloneDeep(j)));
            return newJobs.map(function(element){
                delete element._id;
                delete element.__v;
                delete element.owner;
                return element;
            });
        },
    },

    methods: {
        setFocus(refName) {
            let refChildName = '';

            // Access the first element in the $refs of the child component which is in current $refs.
            refChildName = Object.keys(this.$refs[refName].$refs)[0];

            this.$refs[refName].$refs[refChildName].focus();
        },

        clearJob (){
            this.customerName = '';
            this.projectName = '';
            this.tasktypeName = '';
            this.featureName = '';
            this.workHour = 0;
            this.jobDescription = '';
            this.jobId = '';
            this.editButtonDisabled = true;
            
            this.setFocus("first");
        },

        async updateJobs(){
            let result = await this.getJobs();
            // console.log('result: '+result);
            this.jobs = result.slice();
            this.setFocus("first");
        },

        async addJobs(type) {
            let id = '';
            if(type === 'add') {
                id = '';
            }
            else if(type === 'edit') {
                id = this.jobId;
            }

            await this.$axios.put('api/jobs',{
                _id: id,
                customer: this.customerName,
                project: this.projectName,
                tasktype: this.tasktypeName,
                feature: this.featureName,
                effort: this.workHour,
                content: this.jobDescription,
                owner: this.currentUser.name,
                date: this.selectedDateEPOCH,
            });

            // await this.$axios.put('api/userhistory',{
            //     name: this.currentUser.name,
            //     history: {  customer: this.customerName,
            //                 project: this.projectName,
            //                 feature: this.featureName,
            //                 jobDescrition: this.jobDescription,
            //             },

            // });

            this.jobId= '';
            this.editButtonDisabled = true;

            this.updateJobs();
        },

        async getJobs() {
            let result;
            let queryDate = 'date=' + this.selectedDateEPOCH;
            let queryUser = 'owner=' + this.currentUser.name;
            await this.$axios.get('api/jobs?' + queryDate + '&' + queryUser)
                .then( res => {result = res.data.jobs.slice()});
            return result;
        },

        selectJob(item, index) {
            this.customerName = item.customer;
            this.projectName = item.project;
            this.tasktypeName = item.tasktype;
            this.featureName = item.feature;
            this.workHour = item.effort;
            this.jobDescription = item.content;
            this.jobId = this.jobs[index]._id;
            // console.log('id:'+this.jobId);

            this.editButtonDisabled = false;
            this.setFocus("first");
        },

        async deleteJob(index) {
            // console.log('index=',index);
            // console.log('content=',this.jobs[index].content);
            // console.log('ID=',this.jobs[index]._id);
            let queryID = '_id=' + this.jobs[index]._id;
            await this.$axios.delete('api/jobs?'+queryID);

            this.updateJobs();
        },
    }
}
</script>

<style>
body {
    /*font-family: sans-serif;*/
    font-family: 'Microsoft JhengHei','Heiti TC','WenQuanYi Zen Hei', Helvetica;
    background-color: #315481;
    background-image: linear-gradient(to bottom, #315481, #918e82 100%);
    background-attachment: fixed;
   
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
   
    padding: 0;
    padding-top: 3%;
    margin: 0;
   
    font-size: 14px;
    word-break: break-all;
}


.container {
    max-width: 800px;
    min-height: 100%;
    background: transparent;
}


.container-calendar {
    width: 100%;
    min-height: 100%;
    margin-bottom: 1em;
    /* float:right; */
}

.container-input {
    float: left;
}

.container-text {
    float: left;
    width: 410px;
    height: 68px;
}

.container-button {
    padding-top: 8%;
}

.container-effort {
    width: 60px;
}

</style>
