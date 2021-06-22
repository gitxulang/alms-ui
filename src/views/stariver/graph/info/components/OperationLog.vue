<template>
  <div class="main-wrapper log-container">
    <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
       
      >

      <el-form-item label="" prop="status">
          <el-select v-model="queryParams.status" >
            <el-option v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          
        </el-form-item>

        <el-form-item label="" prop="projectName">
          <el-input
            v-model="queryParams.projectName"
            placeholder="输入任务名称模糊搜索"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>

    <el-table
      border
      v-loading="loading"
      :data="data"
    >
      <el-table-column label="任务名称" align="center" prop="projectName" />
      <el-table-column label="本体" align="center" prop="owlName" />
      <el-table-column label="定时" align="center" prop="schedule" />
      <el-table-column label="上次执行时间" align="center" prop="startTime">
        <template slot-scope="scope">{{
          parseTime(scope.row.startTime)
        }}</template>
      </el-table-column>
      <el-table-column label="耗时" align="center" prop="lastExecuteSeconds" />
      <el-table-column label="状态" align="center" prop="status">
         <template slot-scope="scope">{{scope.row.status =='SUCCEEDED'?"成功":"失败"}}</template>
       </el-table-column>
      <el-table-column label="创建人" align="center" prop="submitUser" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getLoglist } from "@/api/log/loglist";

export default {
  name: 'OperationLog',
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: null,
        status: "SUCCEEDED",
        graphId: null
      },
      // 显示搜索条件
      showSearch: true,
      loading: false,
      data: [],
      statusOptions: [{label: "成功",value:"SUCCEEDED"},{label: "失败",value:"FAILED"}]
    }
  },
  created() {
    this.getList()
  },
  computed:{
  },
  methods: {
    getList(page, params) {
      this.loading = true;
      this.queryParams.graphId = this.$route.query.id;
      getLoglist(this.queryParams).then(response => {
        this.data = response.rows;       
        this.total = response.total;
        this.loading = false;        
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
  }
}
</script>

<style lang="scss" scoped>
.log {
  &-container {
    // margin: 30px;
    .el-form-item__label {
      width: 130px!important;
    }
    .el-form-item__content {
      margin-left: 130px!important;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
