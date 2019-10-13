<template>
    <div v-if="loginUser == 'admin'">
        <div>
            <label class="form-label">回應</label>
            <form class="new-topic">
                <b-badge variant="info">標題</b-badge> {{topicToShowed.title}}<br /><br />
                <b-badge variant="info">描述</b-badge> {{topicToShowed.description}}<br /><br />
                <b-badge variant="info">回答</b-badge><br />
                <textarea
                    v-model="topicToShowed.anwser"
                    type="text"
                    placeholder="Type to give reply">
                </textarea><br />
                <b-button 
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="handleSubmit">送出回應
                </b-button>
            </form>
        </div>
    </div>
    <div v-else>
        <div>
            <label class="form-label">想舉手發問?</label>
            <form class="new-topic">
                標題:<br />
                <input
                    v-model="newTopic.title"
                    type="text"
                    ref="titleInput"
                    placeholder="Type to add a new topic"
                    required
                /><br />
                標籤:<br />
                <input
                    v-model="formTags"
                    type="text"
                    ref="tagInput"
                    placeholder="Type to add tags"
                /><br />
                描述:<br />
                <textarea
                    v-model="newTopic.description"
                    type="text"
                    ref="descInput"
                    placeholder="Type to give description"
                /><br />
                <b-button
                    class="new-button"
                    variant="primary"
                    size="sm"
                    @click="handleSubmit">拋出問題
                </b-button>
            </form>
        </div>
    </div>
</template>

<script>
import { Button, Badge } from 'bootstrap-vue/es/components';
import moment from 'moment';
const timeFormat='YYYY-MM-DD  HH:mm:ss';

export default {
    components: {
        Button,
        Badge,
    },
  
    props: {
        topicToShowed: Object,
        loginUser: String,
    },

    data: function() {
        return {
            newTopic: {
                title: '',
                description: '',
                tags: [],
                raisedAt: '',
                sponsor: '',
                seconded: 1,
                secondlist: [],
                replied: 0,
                repliedTime: '',
                anwser: '',
                accept: 0,
                acceptlist: [],
                suck: 0,
                sucklist: []
            },
            emitTopic:{},
            formTags:'',
        };
    },

    methods: {
        handleSubmit: function(event) {
            if(event) {
                event.preventDefault();
            }

            if(this.loginUser === 'admin') {
                if(this.topicToShowed.anwser.length === 0) {
                    return;
                }
                
                this.topicToShowed.replied = 1;
                this.topicToShowed.repliedTime = moment().format(timeFormat);

                this.emitTopic = Object.assign({},this.topicToShowed);

                this.$emit('update', this.emitTopic);
            }
            else {
                if(this.newTopic.title.length === 0) {
                    this.newTopic.description = '';
                    this.formTags='';
                    return;
                }

                this.newTopic.tags = this.formTags.trim().split(' ');
                this.emitTopic = Object.assign({},this.newTopic);
                this.$emit('insert', this.emitTopic);

                // Clear form
                this.newTopic.title = '';
                this.newTopic.description = '';
                this.newTopic.tags = [];
                this.formTags = '';
            }
        }
    }
}
</script>

<style>
.form-label {
    font-size: 1.5em;
    border-radius: 10px;
    box-shadow: 0px 1px 1px #000000;
    background-clip: padding-box;
    background-image: linear-gradient(to bottom, #f288c4, #d288c4 100%);
    color: white;
    padding: 5px 10px 5px 10px;
    margin-left: 5px;
}

.new-topic input,textarea,TagsInput {
    box-sizing: border-box;
    padding: 5px 0px;
    /*background: transparent;*/
    background: #d2ede4;
    border: 1;
    width: 99%;
    font-size: 1em;
    margin-bottom: 5px;
}
 
.new-topic input:focus{
    outline: 1;
}

.new-button {
    margin-left: 5px;
    margin-bottom: 5px;
    margin-top: 5px;
    color: white;
    background-image: linear-gradient(to bottom, #7fbcff, #0da7ff 100%);
    border-radius: 10px;
    box-shadow: 0px 1px 1px #000000;
    background-clip: padding-box;
}
</style>
