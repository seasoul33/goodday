<template>
    <section class="container">
        <header>
            <span class="title">Goodday Timecard System</span>
            <span class="logingroup">
                Goodday~ {{currentUser.name}}~!
                <b-button v-if="currentUser.name==visitorName" 
                    @click="$bvModal.show('login-modal')"
                    variant="outline-success">
                    Sign-in/Sign-up
                </b-button>
                <b-button v-else
                    @click="logout"
                    variant="outline-success">
                    Logout
                </b-button>
            </span>
        </header>

        <b-tabs content-class="mt-3">
            <b-tab title="Job Diary" active>
                <jobInput
                    :currentUser="currentUser"
                    :customers="customers"
                    :projects="projects"
                    :tasktypes="tasktypes"
                    :features="features"
                    :today="today"
                    :holiday="holiday"
                    :offday="offdays" />
            </b-tab>
            <b-tab title="Data Analyze">
                <dataAnalyze
                    :currentUser="currentUser"
                    :owner="normalUsers"
                    :customer="customers"
                    :project="projects"
                    :tasktype="tasktypes"
                    :feature="features" />
            </b-tab>
            <b-tab v-if="currentUser.group === PRIVILEDGE_ADMIN" title="Data Import">
                <excelImport
                    :currentUser="currentUser"
                    :owner="users"
                    :customer="customers"
                    :project="projects"
                    :tasktype="tasktypes"
                    :feature="features" />
            </b-tab>
            <b-tab v-if="currentUser.group === PRIVILEDGE_ADMIN" title="Manage">
                <manage
                    :users="users"
                    :currentUser="currentUser"
                    :customers="customers"
                    :projects="projects"
                    :tasktypes="tasktypes"
                    :features="features" />
            </b-tab>
            <b-tab v-if="currentUser.group === PRIVILEDGE_ADMIN" title="Holiday Manage">
                <holidayManage
                    :today="today"
                    :holiday="holiday"
                    :offday="offdays" />
            </b-tab>
        </b-tabs>

        <b-modal id="login-modal" hide-footer>
            <form>
                Username: 
                <input
                    v-model="loginAccount"
                    type="text"
                    placeholder="Your username"
                    required
                /><br />
                Password: 
                <input
                    v-model="loginPasswd"
                    type="text"
                    placeholder="Your password"
                    required
                /><br />
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="login">Sign-in
                </b-button>
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="signup">Sign-up
                </b-button>
            </form>
        </b-modal>
    </section>
</template>

<script>
import Vue from 'vue';
import jobInput from '~/pages/jobInput.vue';
import dataAnalyze from '~/pages/dataAnalyze.vue';
import excelImport from '~/pages/excelImport.vue';
import manage from '~/pages/manage.vue';
import holidayManage from '~/pages/holidayManage.vue';
import io from 'socket.io-client';
import { ToggleButton } from 'vue-js-toggle-button';
const socket = io('http://127.0.0.1:3001');
//const socket = io('http://hityang.noip.me:3001');
const priviledge = {'visitor': 0,
                    'normal': 1,
                    'administrator': 2, 
};

let bus=new Vue();

socket.on('data_sync', function(msg){
    bus.$emit('triggerUpdate', msg);
});

export default {
    components: {
        jobInput,
        dataAnalyze,
        excelImport,
        manage,
        holidayManage,
        ToggleButton,
    },
        
    mounted: async function() {
        let self = this;
        let res;
        
        if(this.$auth.loggedIn) {
            this.currentUser.name = this.$auth.user.name;
        }

        res = await self.getUsers();
        self.users = res.slice();

        res = await self.getCustomers();
        self.customers = res.slice();

        res = await self.getProjects();
        self.projects = res.slice();

        res = await self.getTasktypes();
        self.tasktypes = res.slice();
        
        res = await self.getFeatures();
        self.features = res.slice();

        res = await self.getOffdays();
        self.offdays = res.slice().map(e => {return new Date(e.date)});

        bus.$on('triggerUpdate', async function(content){
            if(content === 'users') {
                let result = await self.getUsers();
                // console.log('result: '+result);
                self.users = result.slice();
                return;
            }
            
            if(content === 'customers') {
                let result = await self.getCustomers();
                // console.log('result: '+result);
                self.customers = result.slice();
                return;
            }
            
            if(content === 'projects') {
                let result = await self.getProjects();
                // console.log('result: '+result);
                self.projects = result.slice();
                return;
            }

            if(content === 'tasktypes') {
                let result = await self.getTasktypes();
                // console.log('result: '+result);
                self.tasktypes = result.slice();
                return;
            }
            
            if(content === 'features') {
                let result = await self.getFeatures();
                // console.log('result: '+result);
                self.features = result.slice();
                return;
            }
            
            if(content === 'offdays') {
                let result = await self.getOffdays();
                // console.log('result: '+result);
                self.offdays = result.slice().map(e => {return new Date(e.date)});
                return;
            }
        });
    },

    beforeDestroy: function(){
        bus.$off('triggerUpdate', this.reset);
    },

    // props: {
        
    // },

    data: function() {
        return {
            frame:'jobInput',
            loginAccount: '',
            loginPasswd: '',
            users: [],
            customers: [],
            projects: [],
            tasktypes: [],
            features: [],
            offdays: [],
            today: {
                        key: 'today',
                        dot: {
                            backgroundColor: 'red',
                            diameter: "10px"
                            // borderColor: 'blue',
                            // borderWidth: "1"
                        },
                        dates: [new Date(),],
                    },
            holiday: {
                        key: 'holiday',
                        bar: {
                            backgroundColor: 'pink',
                        },
                        dates: [
                            {weekdays: [1,7]},
                        ],
                    },
            PRIVILEDGE_VISIT: priviledge.visitor,
            visitorName: 'Stranger',
            PRIVILEDGE_NORMAL: priviledge.normal,
            PRIVILEDGE_ADMIN: priviledge.administrator,
        };
    },

    computed: {
        calendarAttr: function() {
                return [
                    {
                        key: 'today',
                        dot: {
                            backgroundColor: 'red',
                            diameter: "10px"
                            // borderColor: 'blue',
                            // borderWidth: "1"
                        },
                        dates: [new Date(),],
                    },
                    {
                        key: 'holiday',
                        bar: {
                            backgroundColor: 'pink',
                        },
                        dates: [
                            {weekdays: [1,7]},
                        ],
                    },
                    {
                        key: 'offday',
                        highlight: {
                            backgroundColor: 'silver',
                        },
                        dates: this.offdays,
                        // dates: [new Date(2019, 12, 19)],
                    },
                ];
        },

        currentUser: function() {
            if(this.$auth.loggedIn) {
                return  {
                            name: this.$auth.user.name,
                            group: this.$auth.user.group,
                            // history: lang.cloneDeep(this.$auth.user.history),
                        };
            }
            else {
                return {name:this.visitorName, group: this.PRIVILEDGE_VISIT};
            }
        },

        normalUsers: function() {
            let tempArr=[];
            this.users.map(function(e){
                if(e.name != 'admin') {
                    tempArr.push(e);
                }
            });
            return tempArr;
        },
    },

    methods: {
        async login() {
            if(this.$auth.loggedIn) {
                await this.logout();
            }
            
            await this.$auth.loginWith('local', {
                    data: {
                        "name": this.loginAccount,
                        "password": this.loginPasswd
                    }
                }).catch(err => {
                    console.log('Failed Logging In');
                    console.log(err.message);
                });
            this.loginAccount = '';
            this.loginPasswd = '';
            this.$bvModal.hide('login-modal');
        },

        async signup() {
            await this.$axios.post('api/register', {
                name: this.loginAccount,
                password: this.loginPasswd
            });

            await this.login();
        },

        check(){
            console.log(this.$auth.loggedIn);
            if(this.$auth.loggedIn) {
                console.log(this.$auth.user.name);
                console.log(this.$auth.user.group);
            }
            console.log(this.currentUser.name);
            console.log(this.currentUser.group);
        },

        async logout() {
            await this.$auth.logout();
        },

        async getUsers() {
            let result;
            await this.$axios.get('api/users')
                .then( res => {result = res.data.users.slice()});
            return result;
        },

        async getCustomers() {
            let result;
            await this.$axios.get('api/customers')
                .then( res => {result = res.data.customers.slice()});
            return result;
        },

        async getProjects() {
            let result;
            await this.$axios.get('api/projects')
                .then( res => {result = res.data.projects.slice()});
            return result;
        },

        async getTasktypes() {
            let result;
            await this.$axios.get('api/tasktypes')
                .then( res => {result = res.data.tasktypes.slice()});
            return result;
        },
        
        async getFeatures() {
            let result;
            await this.$axios.get('api/features')
                .then( res => {result = res.data.features.slice()});
            return result;
        },

        async getOffdays() {
            let result;
            await this.$axios.get('api/offdays')
                .then( res => {result = res.data.offdays.slice()});
            return result;
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

header {
    background: #d2edf4;
    background-image: linear-gradient(to bottom, #d0edf5, #e1e5f0 100%);
    padding: 2.5% 2% 6% 2.5%;
    position: relative;
    margin-bottom: 1em;
    /*font-size: 1.5em;*/
}

.title {
    font-size: 2.2em;
    font-family: 'Verdana Pro Black';
}

.container {
    display: flex;
    flex-direction: column;
    /* max-width: 800px; */
    /* margin: 0 auto; */
    /* margin-bottom: 1em; */
    /* padding-bottom: 1em; */
    min-height: 100%;
    background: transparent;
}

.logingroup {
    float: right;
}


</style>
