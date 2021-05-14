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



</style>
