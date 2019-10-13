<template>
    <div>
        <!-- Render content of topic -->
        <div class="detail">
            <b-button
                class="forminvokeButton"
                variant="warning"
                size="sm"
                title="Click to see detail..."
                @click="openModal">{{topicToShowed.title}}
            </b-button>
            <b-modal id="content-modal" v-model="showModal" hide-footer>
                <b-button
                    class="closeModal"
                    size="sm"
                    @click="closeModal">Close
                </b-button>
                <b-card
                    :title="topicToShowed.title"
                    :subTitle="raiseInfo(topicToShowed)">
                </b-card>
                描述:<br />{{topicToShowed.description}}
                <br />
                <br />
                <div v-if="topicToShowed.replied">
                    回覆:
                    <br />{{topicToShowed.anwser}}
                    <br />({{repliedInfo(topicToShowed)}})
                </div>
                <br />
                <infoBanner
                    :topic-to-showed="topicToShowed"
                    :login-user="loginUser"
                    @tagchange="handleTagChange"
                    @comment="comment"
                    @selecttopic="$emit('selecttopic', topicToShowed)"
                    @deletetopic="deletetopic"
                    @secondtopic="secondtopic" />
            </b-modal>
        </div>
        <infoBanner
            :topic-to-showed="topicToShowed"
            :login-user="loginUser"
            @tagchange="handleTagChange"
            @comment="comment"
            @selecttopic="$emit('selecttopic', topicToShowed)"
            @deletetopic="deletetopic"
            @secondtopic="secondtopic" />
    </div>
</template>

<script>
import { Button, Modal } from 'bootstrap-vue/es/components';
import moment from 'moment';
import infoBanner from '~/components/infoBanner.vue';

export default {
    components: {
        Button,
        Modal,
        infoBanner,
    },
  
    props: {
        topicToShowed: Object,
        loginUser: String,
    },

    data: function() {
        return {
            showModal: false,
        };
    },

    methods: {
        opentimestring: function(topic) {
            return moment(Date.parse(topic.raisedAt)).format('lll');
        },

        raiseInfo: function(topic) {
            return moment(Date.parse(topic.raisedAt)).format('lll');
        },

        replytimestring: function(topic) {
            return moment(Date.parse(topic.repliedTime)).format('lll');
        },

        repliedInfo: function(topic) {
            return "replied at " + this.replytimestring(topic);
        },

        openModal() {
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
        },

        handleTagChange(tags) {
            this.topicToShowed.tags = tags;
            this.$emit('update', this.topicToShowed);
        },

        comment() {
            if(this.loginUser === 'admin') {
                return;
            }

            if(this.topicToShowed.replied === 0) {
                return ;
            }

            const acceptindex = this.topicToShowed.acceptlist.indexOf(this.loginUser);
            const suckindex = this.topicToShowed.sucklist.indexOf(this.loginUser);
            let newacceptlist = this.topicToShowed.acceptlist.slice();
            let newsucklist = this.topicToShowed.sucklist.slice();

            if(acceptindex !== -1) {
                newacceptlist.splice(acceptindex, 1);
                newsucklist.push(this.loginUser);

                this.topicToShowed.acceptlist = newacceptlist;
                this.topicToShowed.sucklist = newsucklist;
                this.topicToShowed.accept --;
                this.topicToShowed.suck ++;
            }
            else if(suckindex !== -1) {
                newsucklist.splice(suckindex, 1);

                this.topicToShowed.sucklist = newsucklist;
                this.topicToShowed.suck --;
            }
            else {
                newacceptlist.push(this.loginUser);

                this.topicToShowed.acceptlist = newacceptlist;
                this.topicToShowed.accept ++;
            }
            this.$emit('update', this.topicToShowed);
            return;
        },

        deletetopic() {
            if( (this.loginUser === this.topicToShowed.sponsor) &&
                (this.topicToShowed.replied === 0) ) {
                
                // console.log("delete topic");
                this.$emit('delete', this.topicToShowed);
            }
        },

        secondtopic() {
            if(this.loginUser !== this.topicToShowed.sponsor) {
                let newlist = this.topicToShowed.secondlist.slice();
                let index = this.topicToShowed.secondlist.indexOf(this.loginUser);
                let newSeconded;

                if( index === -1) {
                    newSeconded = this.topicToShowed.seconded + 1;
                    newlist.push(this.loginUser);
                }
                else {
                    newSeconded = this.topicToShowed.seconded - 1;
                    newlist.splice(index, 1);
                }
                
                // console.log("second topic");
                this.topicToShowed.seconded = newSeconded;
                this.topicToShowed.secondlist = newlist;
                this.$emit('update', this.topicToShowed);
            }
        },
    },
}
</script>

<style>
.detail {
    margin:0 0 0.5em 0;
}

.statistic {
    /*margin:0 0 0 0.5em;*/
    display:block;
    padding: 0 0 5px 5px;
}

.forminvokeButton {
    /*height:200px;*/
    /*width:180px;*/
    margin:0 0 0 0.8em;
}

.buttongroup, .closeModal {
    float: right;
}

</style>
