<template>
    <section class="container">
        <div class="area">
            <span>
                Customer Name:
                <input
                    v-model="customerName"
                    type="text"
                    placeholder="Customer name..."
                /><br />
                Customer Info:
                <input
                    v-model="customerInfo"
                    type="text"
                    placeholder="Customer Information..."
                /><br />
                Internal:
                <select v-model="isInternalCustomer">
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select><br />
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="addCustomer('add')">Add
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="addCustomer('edit')">Edit
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="delCustomer">Del
                </b-button>
            </span>
            <span>
                <b-form-select v-model="selectedCustomerName" :options="customerList" :select-size="5" @input="selectCustomer"></b-form-select>
            </span>
        </div>
        <div class="area">
            <span>
                Project Name:
                <input
                    v-model="projectName"
                    type="text"
                    placeholder="Project name..."
                /><br />
                Project other names:
                <input
                    v-model="projOtherNames"
                    type="text"
                    placeholder="Other names..."
                />(split by ,)<br />
                Under which Customer:
                <select v-model="projCustomer">
                    <option v-for="customer in customers" v-bind:key="customer.name" :value="customer.name">
                        {{customer.name}}
                    </option>
                </select><br />
                Project Info:
                <input
                    v-model="projDescription"
                    type="text"
                    placeholder="Project Information..."
                /><br />
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="addProject('add')">Add
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="addProject('edit')">Edit
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="delProject">Del
                </b-button>
            </span>
            <span>
                <b-form-select v-model="selectedProjectName" :options="projectList" :select-size="5" @input="selectProject"></b-form-select>
            </span>
        </div>
        <div class="area">
            <span>
                Task Type:
                <input
                    v-model="tasktypeName"
                    type="text"
                    placeholder="Task Type..."
                /><br />
                Task Type Info:
                <input
                    v-model="tasktypeDescription"
                    type="text"
                    placeholder="Task Type Information..."
                /><br />
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="addTasktype('add')">Add
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="addTasktype('edit')">Edit
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="delTasktype">Del
                </b-button>
            </span>
            <span>
                <b-form-select v-model="selectedTasktypeName" :options="tasktypeList" :select-size="5" @input="selectTasktype"></b-form-select>
            </span>
        </div>
        <div class="area">
            <span>
                Feature Name:
                <input
                    v-model="featureName"
                    type="text"
                    placeholder="New feature name..."
                /><br />
                Feature other names:
                <input
                    v-model="featOtherNames"
                    type="text"
                    placeholder="Other names..."
                />(split by ,)<br />
                Feature Info:
                <input
                    v-model="featDescription"
                    type="text"
                    placeholder="Feature description..."
                /><br />
                Main category:
                <input
                    v-model="mainCategory"
                    type="text"
                    placeholder="Main Category..."
                /><br />
                Sub category:
                <input
                    v-model="subCategory"
                    type="text"
                    placeholder="Sub Category..."
                /><br />
                Reference:
                <input
                    v-model="reference"
                    type="text"
                    placeholder="Reference..."
                /><br />
                Internal:
                <select v-model="isInternalFeature">
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select><br />
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="addFeature('add')">Add
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="addFeature('edit')">Edit
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="delFeature">Del
                </b-button>
            </span>
            <span>
                <b-form-select v-model="selectedFeatureName" :options="featureList" :select-size="5" @input="selectFeature"></b-form-select>
            </span>
        </div>
        <div class="area">
            <span>
                Username:
                <input
                    v-model="userName"
                    type="text"
                    placeholder="User name..."
                /><br />
                Password:
                <input
                    v-model="userPasswd"
                    type="password"
                    placeholder="User password..."
                /><br />
                Group:
                <input
                    v-model="userGroup"
                    type="number"
                /><br />
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="addUser('add')">Add
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="addUser('edit')">Edit
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="delUser">Del
                </b-button>
            </span>
            <span>
                <b-form-select v-model="selectedUserName" :options="userList" :select-size="5" @input="selectUser"></b-form-select>
            </span>
        </div>
    </section>
</template>

<script>
import Vue from 'vue';
import { BFormSelect } from 'bootstrap-vue';

export default {
    components: {
    },
        
    props: {
        currentUser: Object,
        customers: Array,
        projects: Array,
        tasktypes: Array,
        features: Array,
        users: Array,
    },

    mounted: function() {
        this.projCustomer = this.firstCustomer;
    },

    data: function() {
        return {
            customerName: '',
            selectedCustomerName: '',
            customerInfo: '',
            isInternalCustomer: false,
            customerId: '',

            projectName: '',
            selectedProjectName: '',
            projOtherNames: '',
            projCustomer: '',
            projDescription: '',
            projectId: '',

            tasktypeName: '',
            selectedTasktypeName: '',
            tasktypeDescription: '',
            tasktypeId: '',

            featureName: '',
            selectedFeatureName: '',
            featOtherNames: '',
            featDescription: '',
            mainCategory: '',
            subCategory: '',
            reference: '',
            isInternalFeature: false,
            featureId: '',
            
            userName: '',
            selectedUserName: '',
            userPasswd: '',
            userGroup: 1,
            userId: '',
        };
    },

    computed: {
        userList: function() {
            return this.buildList(this.users, 'Edit a user...?');
        },
        
        customerList: function(){
            return this.buildList(this.customers, 'Edit a customer...?');
        },
        
        projectList: function() {
            return this.buildList(this.projects, 'Edit a project...?');
        },

        tasktypeList: function() {
            return this.buildList(this.tasktypes, 'Edit a task type...?');
        },

        firstCustomer: function() {
            return this.customers.length? this.customers[0].name : '';
        },

        featureList: function() {
            return this.buildList(this.features, 'Edit a feature...?');
        },
    },

    methods: {
        buildList(list, placeholder) {
            let optionList = list.map(function(element){
                return {value: element.name, text:element.name};
            });
            return [{value: null, text: placeholder}, ...optionList];
        },

        async addUser(type) {
            let id = '';
            if(type === 'add') {
                id = '';
            }
            else if(type === 'edit') {
                id = this.userId;
            }

            await this.$axios.put('api/users', {
                _id: id,
                name: this.userName,
                password: this.userPasswd,
                group: this.userGroup,
            });
        },

        async delUser() {
            const index = this.users.findIndex(element => {return element.name === this.selectedUserName})
            if(index === undefined) {
                return;
            }
            const queryID = '_id=' + this.users[index]._id;
            await this.$axios.delete('api/users?'+queryID);
        },

        selectUser() {
            if(this.selectedUserName === null) {
                this.userName = '';
                this.userPasswd = '';
                this.userGroup = 1;
                this.userId = '';
                return;
            }
            const selected = this.users.find(element => {return element.name === this.selectedUserName});
            this.userName = selected.name;
            this.userPasswd = selected.password;
            this.userGroup = selected.group;
            this.userId = selected._id;
        },
        
        async addCustomer(type) {
            let id = '';
            if(type === 'add') {
                id = '';
            }
            else if(type === 'edit') {
                id = this.customerId;
            }

            await this.$axios.put('api/customers', {
                _id: id,
                customerName: this.customerName,
                customerInfo: this.customerInfo,
                isInternal: this.isInternalCustomer,
            });
        },

        async delCustomer() {
            const index = this.customers.findIndex(element => {return element.name === this.selectedCustomerName})
            if(index === undefined) {
                return;
            }
            const queryID = '_id=' + this.customers[index]._id;
            await this.$axios.delete('api/customers?'+queryID);
        },

        selectCustomer() {
            if(this.selectedCustomerName === null) {
                this.customerName = '';
                this.customerInfo = '';
                this.isInternalCustomer = false;
                this.customerId = '';
                return;
            }
            const selected = this.customers.find(element => {return element.name === this.selectedCustomerName});
            this.customerName = selected.name;
            this.customerInfo = selected.info;
            this.isInternalCustomer = selected.isInternal;
            this.customerId = selected._id;
        },

        async addProject(type) {
            let id = '';
            if(type === 'add') {
                id = '';
            }
            else if(type === 'edit') {
                id = this.projectId;
            }

            await this.$axios.put('api/projects', {
                _id: id,
                projectName: this.projectName,
                otherNames: this.projOtherNames.split(','),
                customer: this.projCustomer,
                description: this.projDescription,
            });
        },

        async delProject() {
            const index = this.projects.findIndex(element => {return element.name === this.selectedProjectName})
            if(index === undefined) {
                return;
            }
            const queryID = '_id=' + this.projects[index]._id;
            await this.$axios.delete('api/projects?'+queryID);
        },

        selectProject() {
            if(this.selectedProjectName === null) {
                this.projectName = '';
                this.projOtherNames = '';
                this.projCustomer = this.firstCustomer;
                this.projDescription = '';
                this.projectId = '';
                return;
            }
            const selected = this.projects.find(element => {return element.name === this.selectedProjectName});
            this.projectName = selected.name;
            this.projOtherNames = selected.otherNames.toString();
            this.projCustomer = selected.customer;
            this.projDescription = selected.description;
            this.projectId = selected._id;
        },

        async addTasktype(type) {
            let id = '';
            if(type === 'add') {
                id = '';
            }
            else if(type === 'edit') {
                id = this.tasktypeId;
            }

            await this.$axios.put('api/tasktypes', {
                _id: id,
                tasktypeName: this.tasktypeName,
                description: this.tasktypeDescription,
            });
        },

        async delTasktype() {
            const index = this.tasktypes.findIndex(element => {return element.name === this.selectedTasktypeName})
            if(index === undefined) {
                return;
            }
            const queryID = '_id=' + this.tasktypes[index]._id;
            await this.$axios.delete('api/tasktypes?'+queryID);
        },

        selectTasktype() {
            if(this.selectedTasktypeName === null) {
                this.tasktypeName = '';
                this.tasktypeDescription = '';
                this.tasktypeId = '';
                return;
            }
            const selected = this.tasktypes.find(element => {return element.name === this.selectedTasktypeName});
            this.tasktypeName = selected.name;
            this.tasktypeDescription = selected.description;
            this.tasktypeId = selected._id;
        },
        
        async addFeature(type) {
            let id = '';
            if(type === 'add') {
                id = '';
            }
            else if(type === 'edit') {
                id = this.featureId;
            }

            await this.$axios.put('api/features', {
                _id: id,
                featureName: this.featureName,
                otherNames: this.featOtherNames.split(','),
                description: this.featDescription,
                mainCategory: this.mainCategory,
                subCategory: this.subCategory,
                reference: this.reference,
                isInternal: this.isInternalFeature,
            });
        },

        async delFeature() {
            const index = this.features.findIndex(element => {return element.name === this.selectedFeatureName})
            if(index === undefined) {
                return;
            }
            const queryID = '_id=' + this.features[index]._id;
            await this.$axios.delete('api/features?'+queryID);
        },

        selectFeature() {
            if(this.selectedFeatureName === null) {
                this.featureName = '';
                this.featOtherNames = '';
                this.featDescription = '';
                this.mainCategory = '';
                this.subCategory = '';
                this.reference = '';
                this.isInternalFeature = false;
                this.featureId ='';
                return;
            }
            const selected = this.features.find(element => {return element.name === this.selectedFeatureName});
            this.featureName = selected.name;
            this.featOtherNames = selected.otherNames.toString();
            this.featDescription = selected.description;
            this.mainCategory = selected.mainCategory;
            this.subCategory = selected.subCategory;
            this.reference = selected.reference;
            this.isInternalFeature = selected.isInternal;
            this.featureId = selected._id;
        },
    }
}
</script>

<style>
.area {
    border-style: solid;
    /* border-color: silver; */
    border-width: 1px;
    margin-top: 10px;
}

</style>
