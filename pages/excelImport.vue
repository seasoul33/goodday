<template>
    <div class="container">
        <div>
            <b-button v-on:click="clearData" pill variant="outline-primary">
                <excel-import :on-success="onSuccess">
                    Select file
                </excel-import>
            </b-button>
        </div>
        <div>
            <b-button v-on:click="dataInject" pill variant="outline-primary">
                Write into Database
            </b-button>
        </div>
        <div class="code" v-if="json">
            {{json}}
        </div>
    </div>
</template>

<script>
import {ExcelImport } from 'pikaz-excel-js'
import lang from 'lodash/lang';

export default {
    components: {
        ExcelImport ,
    },
        
    props: {
        currentUser: Object,
        owner: Array,
        customer: Array,
        project: Array,
        tasktype: Array,
        feature: Array,
    },

    data: function() {
        return {
            json: '',
            srcDataArr: [],
            injectDataArr: [],
        };
    },

    computed: {
    },

    watch: {
    },

    methods: {
        onSuccess (response, file) {
            // console.log(response);
            this.srcDataArr = lang.cloneDeep(response[0].data);
            this.json = 'Import done';
        },

        clearData () {
            this.json = '';
            this.srcDataArr = [];
            this.injectDataArr = [];
        },

        async dataInject () {
            // {"Month":"1",
            //  "Date":"4",
            //  "Work Hour":"0.5",
            //  "Customer":"DNI",
            //  "Project":"公司",
            //  "Task Type":"Administration/行政",
            //  "Module":"ACL",
            //  "Task":"email處理",
            //  "Name":"edgaryang",
            //  "Year":"2021"}
            
            this.injectDataArr = this.srcDataArr.map(function(e){
                let tempObj = {};
                tempObj.customer = (e.Customer == undefined)?        '' : e.Customer;
                tempObj.project  = (e.Project == undefined)?         '' : e.Project;
                tempObj.tasktype = (e["Task Type"] == undefined)?    '' : e["Task Type"];
                tempObj.feature  = (e.Module == undefined)?          '' : e.Module;
                tempObj.effort   = (e["Work Hour"] == undefined)?     0 : e["Work Hour"];
                tempObj.offHour  = (e["Take off Hour"] == undefined)? 0 : e["Take off Hour"];
                tempObj.content  = (e.Task == undefined)?            '' : e.Task;
                tempObj.owner    = e.Name;
                tempObj.date     = new Date(e.Year, e.Month-1, e.Date).getTime();
                return Object.assign({},tempObj);
            });

            await this.$axios.put('api/records',this.injectDataArr);

            this.json = 'Inject done';
        },
    }
}
</script>

<style>



</style>
