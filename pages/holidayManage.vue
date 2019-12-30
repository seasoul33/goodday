<template>
    <div class="container">
        <div class="container-calendar">
            <v-date-picker
                mode="multiple"
                v-model="selectedMultiDate"
                is-inline
                is-expanded
                :attributes="calendarAttr"
            />
        </div>

        <div>
            <div class="container-button">
                <b-button
                    class="new-button"
                    size="sm"
                    variant="primary"
                    @click="updateOffdays">Update
                </b-button>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { setupCalendar, DatePicker} from 'v-calendar';
import 'v-calendar/lib/v-calendar.min.css';
import moment from 'moment';
import lang from 'lodash/lang';

setupCalendar({
  firstDayOfWeek: 2,  // Monday,
});

export default {
    components: {
        setupCalendar,
        'v-date-picker': DatePicker,
    },
        
    props: {
        today: Object,
        holiday: Object,
        offday: Array,
    },

    data: function() {
        return {
            selectedMultiDate: this.offday,
        };
    },

    computed: {
        calendarAttr: function() {
            return [this.today, this.holiday,]
        },
    },

    watch: {
        offday: {
            deep: true,
            handler(value) {
                this.selectedMultiDate = lang.cloneDeep(value);
            },
        },
    },

    methods: {
        async updateOffdays() {
            await this.$axios.put('api/offdays',{offdays: this.selectedMultiDate});
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
