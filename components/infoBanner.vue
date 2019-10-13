<template>
    <div>
        <!-- render Statistic -->
        <span class="statistic">
            <span> <b-badge pill variant="info">附議 {{topicToShowed.seconded}}</b-badge></span>
            <span> | <b-badge pill :variant="renderByReplied('success')">接受 {{topicToShowed.accept}}</b-badge></span>
            <span> <b-badge pill :variant="renderByReplied('danger')">打槍 {{topicToShowed.suck}}</b-badge></span>
        </span>

        <!-- render Tags -->
        <div v-if="topicToShowed.sponsor === loginUser">
            <InputTag
                class="TagsInput"
                v-model="topicToShowed.tags"
                value="topicToShowed.tags"
                @input="$emit('tagchange',topicToShowed.tags)" />
        </div>
        <div v-else>
            <InputTag
                class="TagsInput"
                :value="topicToShowed.tags"
                read-only />
        </div>
                    
        <span class="buttongroup">
            <!-- render StatusButton -->
            <span v-if="topicToShowed.replied === 0">
                <b-button
                    size="sm"
                    title="等待回覆中..."
                    disabled>等待回覆
                </b-button>
            </span>
            <span v-else>
                <span v-if="topicToShowed.username !== 'admin'">
                    <span v-if="topicToShowed.acceptlist.indexOf(loginUser) !== -1">
                        <b-button
                            size="sm"
                            variant="success"
                            title="目前為「接受」，點擊後切換為「打槍」"
                            @click="$emit('comment')">接受
                        </b-button>
                    </span>
                    <span v-else-if="topicToShowed.sucklist.indexOf(loginUser) !== -1">
                        <b-button
                            size="sm"
                            variant="danger"
                            title="目前為「打槍」，點擊後切換為「考慮」"
                            @click="$emit('comment')">打槍
                        </b-button>
                    </span>
                    <span v-else>
                        <b-button
                            size="sm"
                            title="目前為「考慮」，點擊後切換為「接受」"
                            @click="$emit('comment')">考慮
                        </b-button>
                    </span>
                </span>
                <span v-else>
                    <b-button
                        size="sm"
                        title="已經回覆"
                        disabled>Done
                    </b-button>
                </span>
            </span>

            <!-- render Action -->
            <span v-if="loginUser === 'admin'">
                <b-button
                    class="noborderbutton"
                    title="回覆"
                    @click="$emit('selecttopic')">
                        <img class="imggood" src="~/assets/reply.png" />
                </b-button>
            </span>
            <span v-else-if="loginUser === topicToShowed.sponsor">
                <span v-if="topicToShowed.replied === 1">
                    <b-button 
                        class="noborderbutton"
                        title="已有回應、無法刪除">
                            <img class="imggood" src="~/assets/nodelete.png" />
                    </b-button>
                </span>
                <span v-else>
                    <b-button
                        class="noborderbutton"
                        title="刪除"
                        @click="$emit('deletetopic')">
                            <img class="imggood" src="~/assets/delete.png" />
                    </b-button>
                </span>
            </span>
            <span v-else>
                <span v-if="topicToShowed.secondlist.indexOf(loginUser) !== -1">
                    <b-button
                        class="noborderbutton"
                        title="取消附議"
                        @click="$emit('secondtopic')">
                            <img class="imggood" src="~/assets/second.png" />
                    </b-button>
                </span>
                <span v-else>
                    <b-button
                        class="noborderbutton"
                        title="附議"
                        @click="$emit('secondtopic', topicToShowed)">
                            <img class="imggood_opacity" src="~/assets/second.png" />
                    </b-button>
                </span>
            </span>
        </span>
    </div>
</template>

<script>
import { Button, Badge } from 'bootstrap-vue/es/components';
import InputTag from 'vue-input-tag';

export default {
    components: {
        Button,
        Badge,
        InputTag,
    },
  
    props: {
        topicToShowed: Object,
        loginUser: String,
    },

    data: function() {
        return {
            
        };
    },

    methods: {
        renderByReplied(type) {
            if(this.topicToShowed.replied === 0) {
                return 'secondary';
            }

            return type;
        },
    },
}
</script>

<style>
.buttongroup {
    float: right;
}

.noborderbutton {
    border: none;
    background: none;
    vertical-align:top;
    margin: 0 0 0 5px;
}

.statistic {
    /*margin:0 0 0 0.5em;*/
    display:block;
    padding: 0 0 5px 5px;
}

.imggood {
    width:20px;
    cursor:pointer;
}

.imggood_opacity {
    opacity:0.3;
    width:20px;
    cursor:pointer;
}

.TagsInput {
    /* box-sizing: border-box; */
    padding: 3px 3px;
    background: transparent;
    /* background: #d2ede4; */
    /* border: 1; */
    width: 99%;
    font-size: 1em;
    margin-bottom: 5px;
}



</style>
