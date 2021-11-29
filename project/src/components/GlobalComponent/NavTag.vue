<template>
    <div class="nav-tag">
        <div>
            <a-tag>首页</a-tag>
            <template v-for="(tag, index) in tags">
                <a-tooltip v-if="tag.length > 20" :key="tag.path" :title="tag.name">
                    <a-tag :color="index==activityNavIndex?'green':''" :key="tag" :closable="index !== 0" @close="() => handleClose(tag)">
                    {{ `${tag.name.slice(0, 20)}...` }}
                    </a-tag>
                </a-tooltip>
                <a-tag :color="index==activityNavIndex?'green':''" v-else :key="tag.path" closable @close="() => handleClose(tag)" @click="gp(tag)">
                    {{ tag.name }}
                </a-tag>
            </template>
            <!-- add tag -->
            <a-input
                v-if="inputVisible"
                ref="input"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                :value="inputValue"
                @change="handleInputChange"
                @blur="handleInputConfirm"
                @keyup.enter="handleInputConfirm"
                />
            <!-- <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                <a-icon type="plus" /> New Tag
            </a-tag> -->
        </div>
    </div>
</template>

<script>
import {} from '@/api/api'



export default {
  name: 'nav-tag',

  components: {

  },

  data() {
    return {
        tags: [],
        inputVisible: false,
        inputValue: '',
        activityNavIndex:-1,
    }
  },

  created() {

    if(window.localStorage.getItem('noise_navTag')==null){
        this.tags=[];
    }else{
        // this.tags=[];
        this.tags=JSON.parse(window.localStorage.getItem('noise_navTag'));
    }
    let index = this.tags.findIndex((item) => item.name === this.$route.meta.title)
    if(index==-1){
        this.tags.push({name:this.$route.meta.title,path:this.$route.path})
        this.activityNavIndex=this.tags.length-1;
    }else{
      this.activityNavIndex=index;
    }
    window.localStorage.setItem('noise_navTag',JSON.stringify(this.tags))
  },
  mounted(){

  },
  watch: {

  },
  methods: {
    gp:function(tag){
        this.$router.push(tag.path)
    },
    handleClose(removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag);
      this.tags = tags;
      window.localStorage.setItem('noise_navTag',JSON.stringify(this.tags))
      let index = tags.findIndex((item) => item.name === this.$route.meta.title)
      if(index==-1){
        if(tags.length>0){
          this.$router.push(tags[this.activityNavIndex-1].path)
        }else{
          this.$router.push('/')
        }
        this.activityNavIndex=-1;
      }else{
        this.activityNavIndex=index;
      }
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(function() {
        this.$refs.input.focus();
      });
    },

    handleInputChange(e) {
      this.inputValue = e.target.value;
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      let tags = this.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: '',
      });
    },

  },
  beforeDestroy() {
    // window.localStorage.setItem('noise_navTag',JSON.stringify(this.tags))
  }
}
</script>


<style lang="less" scoped>
.nav-tag{
    padding:10px;
    background: #fff;
}
</style>