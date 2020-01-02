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
                    @click="addCustomer">Add/Edit Customer
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
                    <option v-for="customer in customers" :value="customer.name">
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
                    @click="addProject">Add/Edit Project
                </b-button>
            </span>
            <span>
                <b-form-select v-model="selectedProjectName" :options="projectList" :select-size="5" @input="selectProject"></b-form-select>
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
                    @click="addFeature">Add Feature
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
                    @click="addUser">Add/Edit User
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
            projectName: '',
            selectedProjectName: '',
            projOtherNames: '',
            projCustomer: '',
            projDescription: '',
            featureName: '',
            selectedFeatureName: '',
            featOtherNames: '',
            featDescription: '',
            mainCategory: '',
            subCategory: '',
            reference: '',
            isInternalFeature: false,
            userName: '',
            selectedUserName: '',
            userPasswd: '',
            userGroup: 1,
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

        async addUser() {
            await this.$axios.put('api/users', {
                name: this.userName,
                password: this.userPasswd,
                group: this.userGroup,
            });
        },

        selectUser() {
            if(this.selectedUserName === null) {
                this.userName = '';
                this.userPasswd = '';
                this.userGroup = 1;
                return;
            }
            const self = this;
            const selected = this.users.find(element => {return element.name === self.selectedUserName});
            this.userName = selected.name;
            this.userPasswd = selected.password;
            this.userGroup = selected.group;
        },
        
        async addCustomer() {
            await this.$axios.put('api/customers', {
                customerName: this.customerName,
                customerInfo: this.customerInfo,
                isInternal: this.isInternalCustomer,
            });
        },

        selectCustomer() {
            if(this.selectedCustomerName === null) {
                this.customerName = '';
                this.customerInfo = '';
                this.isInternalCustomer = false;
                return;
            }
            const self = this;
            const selected = this.customers.find(element => {return element.name === self.selectedCustomerName});
            this.customerName = selected.name;
            this.customerInfo = selected.info;
            this.isInternalCustomer = selected.isInternal;
        },

        async addProject() {
            await this.$axios.put('api/projects', {
                projectName: this.projectName,
                otherNames: this.projOtherNames.split(','),
                customer: this.projCustomer,
                description: this.projDescription,
            });
        },

        selectProject() {
            if(this.selectedProjectName === null) {
                this.projectName = '';
                this.projOtherNames = '';
                this.projCustomer = this.firstCustomer;
                this.projDescription = ''
                return;
            }
            const self = this;
            const selected = this.projects.find(element => {return element.name === self.selectedProjectName});
            this.projectName = selected.name;
            this.projOtherNames = selected.otherNames.toString();
            this.projCustomer = selected.customer;
            this.projDescription = selected.description;
        },
        
        async addFeature() {
            await this.$axios.put('api/features', {
                featureName: this.featureName,
                otherNames: this.featOtherNames.split(','),
                description: this.featDescription,
                mainCategory: this.mainCategory,
                subCategory: this.subCategory,
                reference: this.reference,
                isInternal: this.isInternalFeature,
            });
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
                return;
            }
            const self = this;
            const selected = this.features.find(element => {return element.name === self.selectedFeatureName});
            this.featureName = selected.name;
            this.featOtherNames = selected.otherNames.toString();
            this.featDescription = selected.description;
            this.mainCategory = selected.mainCategory;
            this.subCategory = selected.subCategory;
            this.reference = selected.reference;
            this.isInternalFeature = selected.isInternal;
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
