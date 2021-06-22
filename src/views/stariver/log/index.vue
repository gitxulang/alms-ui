<template>
  <div class="app-container">
    <div class="app-container-search">
  

      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
       
      >
        <el-form-item label="" prop="projectName">
          <el-input
            v-model="queryParams.projectName"
            placeholder=""
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
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table
      border
      v-loading="loading"
      :data="postList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务名称" align="center" prop="projectName" />
      <el-table-column label="本体" align="center" prop="owlName" />
      <el-table-column label="图谱" align="center" prop="graphName" />
      <el-table-column label="定时" align="center" prop="schedule" />
      <el-table-column label="上次执行时间" align="center" prop="startTime">
        <template slot-scope="scope">{{
          formatDate(scope.row.startTime)
        }}</template>
      </el-table-column>
      <el-table-column label="耗时" align="center" prop="lastExecuteSeconds" />
      <el-table-column label="状态" align="center" prop="status">
         <template slot-scope="scope"> {{
          wordTChinese(scope.row.status)
          }}</template>
       </el-table-column>
      <el-table-column label="创建人" align="center" prop="submitUser" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"           
            >查看日志</el-button
          >
        </template>
      </el-table-column>
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
import {
  getOntologyList,
  delOntology,
  addOntology,
  queryOntology
} from "@/api/ontology/ontologylist";
import { formatDate } from "@/utils/index";
import { getLoglist } from "@/api/log/loglist";
import { wordTChinese } from "@/utils/status";

export default {
  name: "Ontology",
  data() {
    return {
      state:"",
      xlsxFile: "",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: ""
      },
      // 表单参数
      form: {},
      // 表单校验
         formLabelAlign: {}
    };
  },
  created() {
    this.queryParams.projectName = this.$route.query.projectName;
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    formatDate,
    wordTChinese,
    /** 查询列表 */
    getList() {
      this.loading = true;
      getLoglist(this.queryParams).then(response => {
        this.postList = response.rows;       
        this.total = response.total;
        this.loading = false;        
      });
    },

    // 文件上传
    getFile() {
      //获取file内容
      let files = this.$refs.fileId.files[0];
      this.xlsxFile = files;
      let str = this.xlsxFile.name.substring(this.xlsxFile.name.length - 4);
      if (str !== ".owl") {
        this.$message.error("请选择以.owl结尾文件");
      }
    },
    // 导出数据
    handleExport(val) {
      this.download(
        "/stariver/ontology/export",
        {
          id: val.id
        },
        `type_${new Date().getTime()}.xlsx`
      );
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.formLabelAlign = {
        name: ""
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "导入本体";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true;
      this.reset();
      // const postId = row.id || this.ids;
      queryOntology(postId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改本体";
      });
      this.title = "修改本体";
    },

   
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.id || this.ids;

      this.$confirm("确认删除该条信息？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delOntology(postIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    }
  }
};
</script>
<style scoped lang="scss">
.app-container {
  .app-container-search {
    display: flex;
    justify-content: space-between;
  }
}
</style>
