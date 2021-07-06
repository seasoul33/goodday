<template>
    <div class="container">
        <div>
            Time Range: <br>
            From <b-datepicker id="example-datepicker1" v-model="timeStart" class="mb-2" value-as-date></b-datepicker>
            To <b-datepicker id="example-datepicker2" v-model="timeEnd" class="mb-2" value-as-date></b-datepicker>
        </div>
        <div>
            Row Indicator*
            <b-form-select v-model="optionRow" :options="optionArrUpdated"></b-form-select>
        </div>
        <div>
            Column Indicator
            <b-form-select v-model="optionColumn" :options="[...optionEmpty, ...optionArrUpdated]"></b-form-select>
        </div>
        <br>
        <div>
            <b-button v-b-toggle.collapse-1 variant="outline-info">Filter by customer</b-button>
            <!-- <b-collapse visible id="collapse-1" class="mt-2"> -->
            <b-collapse id="collapse-1" class="mt-2">
                <b-form-group label="Select customer:" v-slot="{ ariaDescribedby }">
                    <b-form-checkbox-group
                        id="checkbox-group-1"
                        v-model="filterCustomer"
                        :aria-describedby="ariaDescribedby"
                        name="flavour-1"
                    >
                        <b-form-checkbox v-for="c in customer" 
                            v-bind:key="c.name"
                            :value="c.name">
                            {{c.name}}
                        </b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
            </b-collapse>
            <br>

            <!-- <b-button v-b-toggle.collapse-2 variant="outline-info">Filter by project</b-button>
            <b-collapse id="collapse-2" class="mt-2">
                <b-form-group label="Select project:" v-slot="{ ariaDescribedby }">
                    <b-form-checkbox-group
                        id="checkbox-group-2"
                        v-model="filterProject"
                        :aria-describedby="ariaDescribedby"
                        name="flavour-2"
                    >
                        <b-form-checkbox v-for="p in project" 
                            v-bind:key="p.name"
                            :value="p.name">
                            {{p.name}}
                        </b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
            </b-collapse>
            <br> -->

            <b-button v-b-toggle.collapse-3 variant="outline-info">Filter by task type</b-button>
            <b-collapse id="collapse-3" class="mt-2">
                <b-form-group label="Select task type:" v-slot="{ ariaDescribedby }">
                    <b-form-checkbox-group
                        id="checkbox-group-3"
                        v-model="filterTasktype"
                        :aria-describedby="ariaDescribedby"
                        name="flavour-3"
                    >
                        <b-form-checkbox v-for="t in tasktype" 
                            v-bind:key="t.name"
                            :value="t.name">
                            {{t.name}}
                        </b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
            </b-collapse>
            <br>

            <b-button v-b-toggle.collapse-4 variant="outline-info">Filter by feature</b-button>
            <b-collapse id="collapse-4" class="mt-2">
                <b-form-group label="Select feature:" v-slot="{ ariaDescribedby }">
                    <b-form-checkbox-group
                        id="checkbox-group-4"
                        v-model="filterFeature"
                        :aria-describedby="ariaDescribedby"
                        name="flavour-4"
                    >
                        <b-form-checkbox v-for="f in feature" 
                            v-bind:key="f.name"
                            :value="f.name">
                            {{f.name}}
                        </b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
            </b-collapse>
            <br>
        </div>
        <hr>
        <div>
            Table Render
            <br>
            <b-button v-on:click="displayData" pill variant="outline-primary">Collect</b-button>
            <label v-if="errorCount!=0" class="errorLabel">Found {{errorCount}} error(s)!</label>
            <b-table 
                table-variant="primary"
                head-variant="dark"
                striped
                hover
                small
                fixed
                :fields="heads"
                :items="displayedData" >
            </b-table>
        </div>
    </div>
</template>

<script>
import lang from 'lodash/lang';

export default {
    components: {
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
            optionEmpty: [{ value: '', text: 'None(categoried by Time Range)' }],
            optionArr: [
                { value: 'customer', text: 'Categoried by customer' },
                { value: 'project', text: 'Categoried by project' },
                { value: 'tasktype', text: 'Categoried by tasktype' },
                { value: 'feature', text: 'Categoried by feature' },
                { value: 'owner', text: 'Categoried by owner' }
            ],
            optionRow: 'customer',
            optionColumn: '',
            timeStart: new Date(new Date().getFullYear(), 0, 1),
            timeEnd: new Date(new Date().getFullYear(), 11, 31),
            filterCustomer: [],//new Array(this.customers.length).fill(0),
            filterProject: [],
            filterTasktype: [],
            filterFeature: [],
            heads:[],
            displayedData: [],
            errorCount: 0,
        };
    },

    computed: {
        optionArrUpdated: function() {
            let result=[];
            let that = this;
            this.optionArr.forEach(function(e) {
                let tempObj = Object.assign({},e);
                if(e.value == that.optionRow || e.value == that.optionColumn) {
                    tempObj.disabled = true;
                }
                else {
                    tempObj.disabled = false;
                }
                result.push(tempObj);
            });
            return lang.cloneDeep(result);
        },
    },

    watch: {
    },

    methods: {
        async displayData() {
            let timeQry = "from=" + this.timeStart.getTime() + "&" + "to=" + this.timeEnd.getTime();
            let qryString = 'api/jobs?';
            let qryResult;

            let skeleton = {};
            let objRowData = {};
            let tempArr = [];
            let that = this;
            let colTotalName = "";
            let rowTotalName = this.optionRow + " Total";

            this.errorCount = 0;

            // prepare query string(<1024 length) depending on filters
            if(this.filterCustomer.length > 0) {
                let customerQry = 'c=';
                this.filterCustomer.forEach(function(element) {
                    customerQry = customerQry + element + ',';
                });
                // console.log("customerQry = " + customerQry );
                qryString = qryString + customerQry.slice(0, -1) + '&';
            }
            if(this.filterProject.length > 0) {
                let projectQry = 'p=';
                this.filterProject.forEach(function(element) {
                    projectQry = projectQry + element + ',';
                });
                // console.log("projectQry = " + projectQry );
                qryString = qryString + projectQry.slice(0, -1) + '&';
            }
            if(this.filterTasktype.length > 0) {
                let tasktypeQry = 't=';
                this.filterTasktype.forEach(function(element) {
                    tasktypeQry = tasktypeQry + element + ',';
                });
                // console.log("tasktypeQry = " + tasktypeQry );
                qryString = qryString + tasktypeQry.slice(0, -1) + '&';
            }
            if(this.filterFeature.length > 0) {
                let featureQry = 'f=';
                this.filterFeature.forEach(function(element) {
                    featureQry = featureQry + element + ',';
                });
                // console.log("featureQry = " + featureQry );
                qryString = qryString + featureQry.slice(0, -1) + '&';
            }
            if(qryString.slice(-1) === '&') {
                qryString = qryString.slice(0, -1);
            }
            qryString = qryString + '&' + timeQry;

            // query & retrive
            await this.$axios.get(qryString).then( res => {qryResult = res.data.jobs.slice()});
            // console.log(qryResult);

            // table header(field) prepare
            this.heads = [];
            if(this.optionColumn === '') {
                colTotalName = "Period Total";
                for (let i=this.timeStart.getFullYear() ; i <= this.timeEnd.getFullYear() ; i++ ) {
                    if(i == this.timeStart.getFullYear()) {
                        for(let j=this.timeStart.getMonth() ; j<= 11 ; j++) {
                            this.heads.push(i+"-"+(j+1));
                        }
                    }
                    else if (i == this.timeEnd.getFullYear()) {
                        for(let j=0 ; j<= this.timeEnd.getMonth() ; j++) {
                            this.heads.push(i+"-"+(j+1));
                        }
                    }
                    else if (i < this.timeEnd.getFullYear()) {
                        for(let j=0 ; j<= 11 ; j++) {
                            this.heads.push(i+"-"+(j+1));
                        }
                    }
                }
                this.heads = [this.optionRow, ...this.heads, colTotalName];
            }
            else {
                colTotalName = this.optionColumn + " Total";
                this.heads = [ this.optionRow, 
                                ...this.$props[this.optionColumn].map(e => e.name),
                                colTotalName];
            }

            // prepare table content depending on options
            // prepare array skeleton of row data by this.heads, init value 0
            this.heads.forEach(function(e) {
                tempArr.push([e, 0]);
            });
            // transfer array skeleton to object type
            objRowData = Object.fromEntries(tempArr);
            tempArr = [];
            // prepare array skeleton of column data by this.optionRow, init value 0
            this.$props[this.optionRow].forEach(function(e) {
                tempArr.push([e.name, 0]);
            });
            tempArr.push([rowTotalName, 0]);
            // transfer array skeleton to object type
            skeleton = Object.fromEntries(tempArr);
            // replace column data value with row skeleton
            this.$props[this.optionRow].forEach(function(e) {
                skeleton[e.name] = Object.assign({},objRowData);
                skeleton[e.name][that.optionRow] = e.name;
            });
            skeleton[rowTotalName] = Object.assign({},objRowData);
            skeleton[rowTotalName][this.optionRow] = rowTotalName;
            // O(1) time to parse query result to fill the statistic value into skeleton
            if(this.optionColumn === '') {
                qryResult.forEach(function(e) {
                    if(skeleton[e[that.optionRow]] != undefined) {
                        let day = new Date(e.date);
                        if(day >= that.timeStart && day<= that.timeEnd) {
                            let dateIndex = (new Date(e.date).getFullYear()) + "-" + (new Date(e.date).getMonth() + 1);
                            skeleton[e[that.optionRow]][dateIndex] += e.effort;
                        }
                    }
                    else {
                        // console.log(e[that.optionRow]);
                        if(e.offHour == 0){
                            that.errorCount++;
                        }
                    }
                });
            }   
            else {
                qryResult.forEach(function(e) {
                     if(e.offHour == 0) {
                        skeleton[e[that.optionRow]][e[that.optionColumn]] += e.effort;
                     }
                });
            }
            // console.log(skeleton);

            // calculate total value
            this.$props[this.optionRow].forEach(function(a) {
                that.heads.forEach(function(b) {
                    if( b !== that.optionRow) {
                        if(b !== colTotalName) {
                            skeleton[a.name][colTotalName] += skeleton[a.name][b];
                        }
                        skeleton[rowTotalName][b] += skeleton[a.name][b];
                    }
                });
            });

            // render the content
            this.displayedData = [];
            this.$props[this.optionRow].forEach(function(e) {
                that.displayedData.push(skeleton[e.name]);
            });
            this.displayedData.push(skeleton[rowTotalName]);
            // console.log(this.displayedData);
        },
    }
}
</script>

<style>

.errorLabel {
    color: red;
}

</style>
