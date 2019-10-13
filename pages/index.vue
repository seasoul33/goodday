<template>
    <section class="container">
        <header>
            <span class="logingroup">
                <b-button @click="$bvModal.show('login-modal')" variant="outline-success">Sign-in/Sign-up</b-button>
                <b-button @click="logout" variant="outline-success">Logout</b-button>
                <b-button @click="check" variant="outline-success">Check</b-button>
            </span>
        </header>

        <div class="container-calendar">
            <v-date-picker
                mode="single"
                v-model="selectedSingleDate"
                is-inline
                is-expanded
                :attributes="calendarAttr"
            />
        </div>

        <span class="container-topic">
            <autoSuggest
                ref="first"
                :sourceData="sourceData"
                v-model="customerName"
                holder="customer name..."
            />
        </span>

        <span class="container-topic">
            <autoSuggest
                ref="project"
                :sourceData="sourceData"
                v-model="projectName"
                holder="project name..."
            />
        </span>

        <span class="container-topic">
            <autoSuggest
                ref="function"
                :sourceData="sourceData"
                v-model="functionName"
                holder="function name..."
            />
        </span>

        <span>
            <input type="number" v-model="workHour">
        </span>

        <span class="container-topic">
            <textarea rows="3" cols="80" placeholder="job description..."
                v-model="jobDescription">
            </textarea>
        </span>

        <div>
            <b-button
                class="new-button"
                variant="primary"
                @click="addRecord">+
            </b-button>
        </div>

        <div>
            <label>Jobs done in this day</label>
            <ul>
                <li>

                </li>
            </ul>
        </div>

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
import autoSuggest from '~/components/autoSuggest.vue';
import { setupCalendar, DatePicker} from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css';
import io from 'socket.io-client';
import { ToggleButton } from 'vue-js-toggle-button';
import { Button, Modal } from 'bootstrap-vue';
import moment from 'moment';
const socket = io();

const timeFormat='YYYY-MM-DD  HH:mm:ss';
let bus=new Vue();

setupCalendar({
  firstDayOfWeek: 2,  // Monday,
});

socket.on('mongo_sync', function(msg){
    // console.log(msg);
    const collectionFetchedBySecond = msg.bySecond.slice();
    const collectionFetchedByTime = msg.byTime.slice();
    bus.$emit('trigger', {collectionFetchedBySecond, collectionFetchedByTime});
});

export default {
    components: {
        ToggleButton,
        Button,
        Modal,
        autoSuggest,
        setupCalendar,
        'v-date-picker': DatePicker,
    },
        
    mounted: function() {
        let self = this;
        bus.$on('trigger', function(content){
            self.topics = content.collectionFetchedBySecond;
            self.topics_time = content.collectionFetchedByTime;
        });

        this.setFocus("first");
    },

    // props: {
        
    // },

    data: function() {
        return {
            currentUser:{username:"Anonymous"},
            loginAccount: '',
            loginPasswd: '',
            customerName: '',
            projectName: '',
            functionName: '',
            workHour: 0,
            jobDescription: '',
            sourceData: ['lion', 'cat', 'dog', 'tiger', 'mice', 'elephant', 'mouse', 'mike', 'mom', 'mary', 'mongo'],
            calendarAttr: [
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
                    key: 'lack',
                    highlight: {
                        backgroundColor: 'silver',
                    },
                    dates: [
                        new Date(2019, 9, 1),
                        {
                            start: new Date(2019, 9, 3),
                            end: new Date(2019, 9, 4),
                        },
                        new Date(2019, 9, 14),
                        new Date(2019, 9, 15),
                    ],
                },
            ],
            selectedMultiDate: [new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate())],
            selectedSingleDate: new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate()),
        };
    },

    computed: {
        
    },

    methods: {
        async login() {
            if(this.$auth.loggedIn) {
                await this.logout();
            }
            
            await this.$auth.loginWith('local', {
                    data: {
                        "username": this.loginAccount,
                        "password": this.loginPasswd
                    }
                }).catch(err => {
                    console.log('Failed Logging In');
                    console.log(err.message);
                });
            this.loginAccount = '';
            this.loginPasswd = '';
            this.$bvModal.hide('login-modal');
            if(this.$auth.loggedIn) {
                this.currentUser.username = this.$auth.user.username;
            }
        },

        async signup() {
            await this.$axios.post('api/register', {
                username: this.loginAccount,
                password: this.loginPasswd
            });

            await this.login();
        },

        check(){
            console.log(this.$auth.loggedIn);
            if(this.$auth.loggedIn) {
                console.log(this.$auth.user.username);
            }
            console.log(this.currentUser.username);
        },

        async logout() {
            await this.$auth.logout();
            this.currentUser.username = 'Anonymous';
        },

        setFocus(refName) {
            let refChildName = '';

            // Access the first element in the $refs of the child component which is in current $refs.
            refChildName = Object.keys(this.$refs[refName].$refs)[0];

            this.$refs[refName].$refs[refChildName].focus();
        },

        async addRecord() {
            await this.$axios.post('record',{

            });
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

header {
    background: #d2edf4;
    background-image: linear-gradient(to bottom, #d0edf5, #e1e5f0 100%);
    padding: 2.5% 2% 6% 2.5%;
    position: relative;
    margin-bottom: 1em;
    /*font-size: 1.5em;*/
}

header.title {
    font-size: 2em;
}

.container {
    max-width: 800px;
    /* margin: 0 auto; */
    /* margin-bottom: 1em; */
    /* padding-bottom: 1em; */
    min-height: 100%;
    background: transparent;
}

.logingroup {
    float: right;
}

.container-calendar {
    width: 100%;
    min-height: 100%;
    margin-bottom: 1em;
    /* float:right; */
}

.container-topic {
    width: 100%;
    /* margin-top: 1em; */
    /* padding-bottom: 1em; */
    min-height: 100%;
    background: white;
}

.container-toolbar {
    width: 25%;
    padding-bottom: 1em;
    min-height: 100%;
    background: #FAEBD7;
    color: #696969;
    float:left;
}

</style>
