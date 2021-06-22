<template>
  <div class="statistics-container basic-container">
    <section>
    <h2>{{graph.name}}</h2>
    <el-form ref="statisticsForm"  label-suffix=":"  label-width="80px" :inline="true" >
      <el-form-item label="更新时间">
        {{graph.updateTime}}
      </el-form-item>
      <el-form-item label="更新人">
        {{graph.updateBy}}
      </el-form-item>
      <el-form-item label="创建时间">
        {{graph.createTime}}
      </el-form-item>
      <el-form-item label="创建人">
        {{graph.createBy}}
      </el-form-item>

      <el-form-item  label="" style="float: right">
        <el-button type="primary" @click="handleUpdate">修改</el-button>
        <el-button type="primary" plain @click="handleClear">清空</el-button>
        <el-button type="warning" plain @click="handleDelete">删除</el-button>
      </el-form-item>
    </el-form>
    </section>
    <section style="clear: both">
      <avue-data-icons :option="tabOption"></avue-data-icons>
    </section>

    <el-tabs v-model="activeName">
      <el-tab-pane label="构建概览" name="buildOverview">
        <el-row :gutter="30">
          <el-col :span="24">
              <v-chart  ref="echart" class="chart-box" :auto-resize="true" :options="options.stackBar({title:'最近30天构建数据记录',data:data, theme: 'dark'})"/>
          </el-col> 
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="构建日志" name="buildLog">
        <OperationLogs/>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加或修改岗位对话框 -->
    <el-dialog title="修改图谱" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import options from './components/options'
import {mapGetters} from 'vuex'
import OperationLogs from './components/OperationLog'
import { getGraph, clearGraph, delGraph, updateGraph } from "@/api/graph/graphlist";
import { getBuildOverview } from "@/api/log/loglist";

export default {
  name: 'Load',
  components:{ OperationLogs },
  data(){
    let data = {
      legend:['新增实体','新增关系'],
      xAxis:[],
      seriesData:[
        [],[]
        ],
    }
    return {
      options,
      data,
      activeName: 'buildOverview',
      graphId: null,
      tabOption: {
        span:4,
        data: [
          {
            click: function (item) {
              // alert(JSON.stringify(item));
            },
            title: '本体',
            count: '网空领域',
            icon: 'el-icon-share',
            // href:'https://avuejs.com',
            // target:'_blank'
          },
          {
            click: function (item) {
              // alert(JSON.stringify(item));
            },
            title: '概念',
            count: 55,
            icon: 'el-icon-tickets',
            // href:'https://avuejs.com',
            // target:'_blank'
          },
          {
            click: function (item) {
              // alert(JSON.stringify(item));
            },
            title: '概念关系',
            count: 99,
            icon: 'el-icon-connection',
            // href:'https://avuejs.com',
            // target:'_blank'
          },
          {
            click: function (item) {
              // alert(JSON.stringify(item));
            },
            title: '实体',
            count: 1360059,
            icon: 'el-icon-s-grid',
            // href:'https://avuejs.com',
            // target:'_blank'
          },
          {
            click: function (item) {
              // alert(JSON.stringify(item));
            },
            title: '实体关系',
            count: 5093242,
            icon: 'el-icon-guide',
            // href:'https://avuejs.com',
            // target:'_blank'
          }
        ]
      },
      graph: null,
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
        ],
        description: {
          min: 0,
          max: 200,
          message: "长度在0到200个字符",
          trigger: "blur"
        }
      }
    }
  },
  computed: {
    // ...mapGetters([
    //   'theme'
    // ])
  },
  created () {
    this.graphId = this.$route.query.id;
    window.addEventListener("resize", this.resizeTheChart);
    this.getDetail();
    
    // 构建概览
    getBuildOverview(this.graphId).then(response => {
      let xAxis = [];
      let date = new Date();
      for(let i = 0; i < 30; i++){
        xAxis.unshift(this.parseTime(date,'{y}{m}{d}'));
        date = new Date(date.setDate(date.getDate()-1));
      }
      this.data.xAxis = xAxis;

      let dataObj = {};
      response.data.forEach(item => {
        dataObj[item.date+"_"+item.type] = item.count;
      });
      this.data.seriesData = [[],[]];
      this.data.xAxis.forEach(item => {
        this.data.seriesData[0].push(dataObj[item+"_2"]||0);
        this.data.seriesData[1].push(dataObj[item+"_3"]||0);
      })
    });
  },
  methods: {
    onSubmit(){},
    getDay(day){
      var today = new Date();
      var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
      today.setTime(targetday_milliseconds); //注意，这行是关键代码
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear+"-"+tMonth+"-"+tDate;
    },
    doHandleMonth(month){
        var m = month;
        if(month.toString().length == 1){
        m = "0" + month;
        }
        return m;
    },
    resizeTheChart() {
      if (this.$refs && this.$refs.echart) {
        this.$refs.echart.resize();
      }
  
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    getDetail(){
      // 图谱详情
      getGraph(this.graphId).then(response => {
        this.graph = response.data;
        this.tabOption.data[0].count = this.graph.name;
        this.tabOption.data[1].count = this.graph.ideaCount;
        this.tabOption.data[2].count = this.graph.relationCount;
        this.tabOption.data[3].count = this.graph.instanceCount;
        this.tabOption.data[4].count = this.graph.instanceRelationCount;
      });
    },
    handleUpdate(){
      this.form = JSON.parse(JSON.stringify(this.graph));
      this.open = true;
    },
    // 清空
    handleClear(){
      let loading = null;
      this.$confirm("确认清空该图谱",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        loading = this.$loading({
          lock: true,
          text: '清空中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        return clearGraph(this.graphId);
      }).then(() => {
        this.getDetail();
        this.msgSuccess("清空成功");
      }).finally( () => {
        loading.close();
      })
    },
    // 删除
    handleDelete(){
      this.$confirm("确认删除该图谱",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        return delGraph(this.graphId);
      }).then(() => {
        this.msgSuccess("删除成功");
        // 调用全局挂载的方法
        this.$store.dispatch('tagsView/delView', this.$route)
        // 返回上一步路由
        this.$router.go(-1)
      });
    },
    // 修改
    submitForm(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateGraph(this.form).then(response => {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getDetail();
          })
        }
      });
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeTheChart);
  },
}
</script>

<style lang="scss">
.statistics {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  
}
.statistics-container{
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .chart-box{
    width: 100%;
    height:350px;
  }
  .el-form-item{
    // margin-bottom:0
  }
  .chart-section{
    padding: 15px;
  }
  .el-tab-pane{
    margin-bottom: 20px;
  }
}
  

</style>