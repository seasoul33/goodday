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
                    :inputDisabled="inputDisabled"
                />
            </span>

            <span class="container-input">
                Project:
                <autoSuggest
                    ref="project"
                    :sourceData="projectNameList"
                    v-model="projectName"
                    holder="project name..."
                    :inputDisabled="inputDisabled"
                />
            </span>

            <span class="container-input">
                Task Type:
                <autoSuggest
                    ref="tasktype"
                    :sourceData="taskTypeList"
                    v-model="tasktypeName"
                    holder="task type..."
                    :inputDisabled="inputDisabled"
                />
            </span>

            <span class="container-input">
                Feature/Function:
                <autoSuggest
                    ref="function"
                    :sourceData="featureNameList"
                    v-model="featureName"
                    holder="function name..."
                    :inputDisabled="inputDisabled"
                />
            </span>

            <span class="container-input">
                Effort in hour:
                <br />
                <input type="number" v-model="workHour" :disabled="inputDisabled" class="container-effort"
                       min="0" max="24" step="0.5" oninput="value=value.indexOf('.') > -1?value.slice(0, value.indexOf('.') + 2):value.slice(0,2)">
                <br />
            </span>

            <span class="container-input">
                Job description:
                <br />
                <textarea class="container-text" placeholder="job description..."
                    v-model="jobDescription">
                </textarea>
            </span>

            <span class="container-input">
                off hour:
                <br />
                <input type="number" v-model="offHour" class="container-effort"
                       min="0" max="24" step="0.5" oninput="value=value.indexOf('.') > -1?value.slice(0, value.indexOf('.') + 2):value.slice(0,2)">
            </span>

            <span class="container-button">
                <b-button
                    class="new-button"
                    size="sm"
                    variant="primary"
                    :disabled="currentUser.name=='Stranger'"
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
            </span>
        </div>

        <div>
            <!-- Used time today: <label :style="[(todayTotalHours<8)?{color:'red'}:{color:'green'}]">{{todayTotalHours}}</label> -->
            <b-table 
                table-variant="primary"
                head-variant="dark"
                striped
                hover
                small
                fixed
                :fields="dynamicFields"
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
            </b-table>
        </div>
    </div>
</template>

<script>
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
        // this.setFocus("first");
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
            offHour: 0,
            jobDescription: '',
            jobId: '',
            selectedSingleDate: new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate()),
            fields:[
                'customer',
                'project',
                'tasktype',
                'feature',
                'effort',
                'offHour',
                'content',
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
            // console.log(this.selectedSingleDate);
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

        todayTotalHours: function() {
            if(this.jobs.length == 0) {
                return 0;
            }
            return this.jobs.reduce(function(totalHour, element) {
                return totalHour + element.effort + element.offHour;
            }, 0);
        },

        dynamicFields: function() {
            if(this.todayTotalHours == undefined || this.todayTotalHours == 0) {
                return [...this.fields,{ key: "action", label: ""}];
            }
            else {
                let str="Used Time: " + this.todayTotalHours;
                let color=(this.todayTotalHours<8)?"text-danger":"text-success";
                return [...this.fields,{ key: "action", thClass: color, label: str}];
            }
        },

        inputDisabled: function() {
            return (this.offHour != 0)? true:false;
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
            this.offHour = 0;
            this.jobDescription = '';
            this.jobId = '';
            this.editButtonDisabled = true;
            
            // this.setFocus("first");
        },

        async updateJobs(){
            let result = await this.getJobs();
            // console.log('result: '+result);
            this.jobs = result.slice();
            // this.setFocus("first");
        },

        async addJobs(type) {
            let id = '';
            if(type === 'add') {
                id = '';
            }
            else if(type === 'edit') {
                id = this.jobId;
            }

            if(this.offHour == 0) {
                await this.$axios.put('api/jobs',{
                    _id: id,
                    customer: this.customerName,
                    project: this.projectName,
                    tasktype: this.tasktypeName,
                    feature: this.featureName,
                    effort: this.workHour,
                    offHour: this.offHour,
                    content: this.jobDescription,
                    owner: this.currentUser.name,
                    date: this.selectedDateEPOCH,
                });
            }
            else {
                let content = (this.jobDescription == "")? "請假" : this.jobDescription;
                await this.$axios.put('api/jobs',{
                    _id: id,
                    customer: "",
                    project: "",
                    tasktype: "",
                    feature: "",
                    effort: 0,
                    offHour: this.offHour,
                    content: content,
                    owner: this.currentUser.name,
                    date: this.selectedDateEPOCH,
                });
            }

            // await this.$axios.put('api/userhistory',{
            //     name: this.currentUser.name,
            //     history: {  customer: this.customerName,
            //                 project: this.projectName,
            //                 feature: this.featureName,
            //                 jobDescrition: this.jobDescription,
            //             },

            // });

            this.jobId= '';
            this.offHour= 0;
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
            this.offHour = item.offHour;
            this.jobDescription = item.content;
            this.jobId = this.jobs[index]._id;
            // console.log('id:'+this.jobId);

            this.editButtonDisabled = false;
            // this.setFocus("first");
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
    max-width: 1000px;
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
    float: left;
    padding-top: 2%;
    padding-left: 3%;
}

.container-effort {
    width: 60px;
}

</style>
