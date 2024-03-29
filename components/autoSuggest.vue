<template>
    <div>
        <style>
            :root {
                --input-width: {{ fieldSizePX }};
            }
        </style>
        <div class="autosuggest">
            <input type="text" ref="input" class="input"
                @input="$emit('input', $event.target.value)"
                v-model="content"
                :placeholder="holder"
                :maxlength="inputLength"
                :disabled="inputDisabled"
                @focus="onFocused"
                @blur="onBlur"
                @keydown.up.prevent="onKeyUp"
                @keydown.down.prevent="onKeyDown"
                @keydown.enter.prevent="onKeyEnter"
                @keydown.esc.prevent="onKeyESC">
            <ul v-show="isDisplayed" class="suggestList">
                <li v-for="(result, i) in trimResult" 
                    :key="i"
                    class="suggestItem"
                    @mousedown="selectSuggestion(result)"
                    :class="{'active': i === cursorPosition}"
                    @mouseover="cursorPosition = i">
                    {{result}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
const cursorDefaultPosition = -1;

export default {
    props: {
        value: String,
        sourceData: Array,
        autoSelect: {
            type: Boolean,
            default: false,
        },
        maxSuggestNum: {
            type: Number,
            default: 10,
        },
        fieldSize: {
            type: Number,
            default: 150,
        },
        inputLength: {
            type: Number,
            default: 15,
        },
        holder: String,
        forcedSuggest: {
            type: Boolean,
            default: true,
        },
        inputDisabled: {
            type: Boolean,
            default: false,
        },
    },

    data: function() {
        return {
            content: '',
            isDisplayed: false,
            isSuspended: false,
            results: this.prepareSuggestion(''),
            cursorPosition: cursorDefaultPosition,
        };
    },

    computed: {
        trimResult: function() {
            return this.results.slice(0, this.maxSuggestNum);
        },
        fieldSizePX: function() {
            return this.fieldSize + 'px';
        },
    },

    watch: {
        content(newVal) {
            this.update(newVal);
        },

        value(newVal) {
            this.isSuspended = true;
            this.content = newVal;
        },
    },

    // updated: function() {
    //     console.log('pass updated');
    // },

    methods: {
        update(keyword) {
            this.$emit('input', keyword);
            this.results = this.prepareSuggestion(keyword);

            if(this.isSuspended === true) {
                this.isSuspended = false;
                return;
            }
            
            if(this.results.length > 0) {
                this.toogleDisplay(true);
                this.cursorPosition = this.autoSelect? 0 : cursorDefaultPosition;
            }
        },
        prepareSuggestion: function(keyword) {
            if(keyword.length < 1) {
                return this.forcedSuggest? this.sourceData : []
            }

            return this.sourceData.filter((sourceItem) => {
                return sourceItem.toLowerCase().startsWith(keyword.toLowerCase())
            });
        },

        selectSuggestion: function(result) {
            // console.log('click!');
            this.isSuspended = true;
            this.content = result;
            this.clearSuggestion();
        },

        clearSuggestion: function() {
            this.toogleDisplay(false);
            this.cursorPosition = cursorDefaultPosition;
            this.results = [];
        },

        toogleDisplay: function(status) {
            this.isDisplayed = status;
        },

        onFocused: function() {
            // this.toogleDisplay( (this.forcedSuggest && (this.content === '') && (this.results.length > 0))? true : false);
            if(this.forcedSuggest) {
                this.update(this.content);
            }
        },

        onBlur: function() {
            this.toogleDisplay(false);
        },

        onKeyUp: function() {
            if (this.cursorPosition > 0) {
                this.cursorPosition--;
            }
        },

        onKeyDown: function() {
            if(this.isDisplayed) {
                if (this.cursorPosition < (this.results.length - 1)) {
                    this.cursorPosition++;
                }
            }
            else {
                this.update(this.content);
            }
        },

        onKeyEnter: function() {
            if( (this.cursorPosition >= 0) && 
                (this.cursorPosition < this.results.length) ) {
                this.selectSuggestion(this.results[this.cursorPosition]);
                return;
            }

            // send input to upper layer component
            // this.$emit('inputComplete',this.content);
        },

        onKeyESC: function() {
            this.toogleDisplay(false);
        },
    },
}
</script>

<style>
.input {
    background: white;
    width: inherit;
}

.autosuggest {
    /* position: relative; */
    /* display: inline-block; */
    width: var(--input-width);
}

.suggestList {
    width: inherit;
    position: absolute;
    z-index: 99;
}

.suggestItem {
    margin-left: -2.7em;
    list-style:none;
    background: white;
    cursor: pointer;
}
.active {
    background-color:silver;
}

</style>
