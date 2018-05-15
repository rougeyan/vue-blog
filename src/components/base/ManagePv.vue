<template>
  <div class="container">
    <el-date-picker
      v-model="date"
      type="date"
      class="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 d 日"
      @change="getPv()"
      value-format="yyyy-M-d">
    </el-date-picker>
    <el-table
      :data="originData"
      class="table"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.list">
            <el-table-column
              label="访问时间"
              prop="date">
            </el-table-column>
            <el-table-column
              label="访问路径"
              prop="path">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        label="访问ip"
        prop="ip">
      </el-table-column>
      <el-table-column
        label="访问地址"
        prop="address">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from '../../service/apiManage'
import {pvData} from '../../lib/lib'
import {mapGetters} from 'vuex'
export default {
  name: 'manage-pv',
  data () {
    return {
      originData: [],
      date: new Date().toLocaleString('zh').split(' ')[0].replace(/\//g, '-')
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'userName'
    ])
  },
  methods: {
    getPv () {
      (async function () {
        let res = await api.getPv({date: this.date, userName: this.userName})
        if (res.errno === 0) {
          this.originData = await pvData(res.res)
        } else {
          this.$message.error('出现错误')
        }
      }.bind(this))()
    }
  },
  created () {
    this.getPv()
  }
}
</script>

<style scoped>
  .table{
    overflow: scroll;
  }
  .container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .date{
    margin: 20px;
  }
</style>
