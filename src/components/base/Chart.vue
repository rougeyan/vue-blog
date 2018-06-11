<template>
    <div>
      <el-form>
        <el-form-item  label="接口路径">
          <el-select v-model="chooseApi" placeholder="请选择" @change="getApiLog">
            <el-option
              v-for="item in apiOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <EChart :options="option" :auto-resize="true"></EChart>
    </div>
</template>

<script>
  import api from '../../service/apiManage'
  import EChart from 'vue-echarts/components/ECharts.vue'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/toolbox'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/title'

  export default {
    name: "Chart",
    components:{
      EChart
    },
    data(){
      return{
        option :{
          title : {
            text: '接口响应时间',
            subtext:'/api/v1/login'
          },
          tooltip : {
            trigger: 'axis'
          },
          toolbox: {
            show : true,
            feature : {
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : [1,2,3,4,5,6,7,8,9,10]
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel : {
                formatter: '{value} ms'
              }
            }
          ],
          series : [
            {
              name:'响应时间(ms)',
              type:'line',
              data:[0,0,0,0,0,0,0,0,0,0]
            }
          ]
        },
        chooseApi:'/api/v1/login',
        apiOptions:[
          '/api/v1/login',
          '/api/v1/checkStatus',
          '/api/v1/userinfo',
          '/api/v1/ideas',
          '/api/v1/comment',
          '/api/v1/like',
          '/api/v1/idea'
        ],
      }
    },
    created(){
      this.getApiLog()
    },
    methods:{
      getApiLog(){
        api.getApiMonitor({url:this.chooseApi})
          .then(res=>{
            if(res.data && res.data.length){
              let data = res.data.reduce((acc,item)=>{
                acc.push(item.responseTime)
                return acc
              },[])
              this.option = {
                ...this.option,
                ...{series: [{name:'响应时间(ms)', type:'line', data:data}]},
                ...{title:{ text: '接口响应时间', subtext:this.chooseApi}}}
            }
          })
      }
    }
  }
</script>

<style scoped>

</style>
