<template>
  <div class="app-container">
    <!-- 按钮 -->
    <div class="app-container-search">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新建</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>

        <!-- <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>-->
      </el-row>

      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
        :rules="rules"
      >
        <el-form-item label prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table border v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="本体" align="center" prop="ontologyName" />
      <el-table-column label="目标图谱" align="center" prop="graphName" />
      <el-table-column label="上次执行时间" align="center" prop="createTime">
        <template slot-scope="scope">
          {{
          formatDate(scope.row.lastExecuteTime)
          }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope" >
         {{
          intTChinese(scope.row.status)
          }}
        </template>
       
      </el-table-column>
      <el-table-column label="耗时(秒)" align="center" prop="lastExecuteSeconds" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-video-play" @click="excute(scope.row.id)">启动</el-button>

          <el-button size="mini" type="text" icon="el-icon-edit" @click="amend(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="handleBuildLog(scope.row)"
          >构建记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form :rules="rules" label-width="80px" :model="formLabelAlign" ref="ruleForm">
        <el-form-item prop="name" label="任务名称">
          <el-input size="small" required v-model="formLabelAlign.name"></el-input>
        </el-form-item>

        <el-form-item label="本体" prop="ontologyId">
          <el-select style="width:100%" v-model="formLabelAlign.ontologyId" placeholder="请选择本体">
            <el-option v-for="(item, i) in this.btname" :label="item.name" :value="item.id" :key="i"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="description" label="描述">
          <el-input size="small" type="textarea" v-model="formLabelAlign.description"></el-input>
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
import { getJobList, addJob, delJob, excuteJob } from "@/api/job/joblist";
import { getOntologyList } from "@/api/ontology/ontologylist";
import { formatDate } from "@/utils/index";
import { intTChinese } from "@/utils/status";

export default {
  name: "Job",
  data() {
    return {
      // 模态框

      // 每条的详情
      rowsmsg: {},
      // 文件名
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
        name: ""
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
        ],
        ontologyId: [{ required: true, message: "请选择本体", trigger: "blur" }],
        description: [
          { message: "请输入任意字符, 长度0-200", trigger: "blur" },
          { min: 0, max: 200, message: "长度在0到200个字符", trigger: "blur" }
        ]
      },
      btname: [],
      formLabelAlign: {}
    };
  },

  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 时间格式转换
    formatDate,

    intTChinese,

    selectChanged(val) {
      this.formLabelAlign.ontologyId = val.id;
    },
    closemodal() {
      this.iscolse = false;
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      getJobList(this.queryParams).then(response => {
        this.postList = response.rows;
        // this.formLabelAlign.ontologyId=response.rows.ontologyId
        this.total = response.total;
        this.loading = false;
      });
    },

    // 岗位状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
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
      this.title = "新增构建任务";

      getOntologyList().then(res => {
        this.btname = res.rows;
      });
    },
    // 构建记录跳转
    handleBuildLog(row){
      this.$router.push({
        path: "/job/stariver-log", 
        query: {projectName: row.name}
      });
    },

    /** 修改按钮操作 */
    amend(val) {
      this.rowsmsg = val;
      this.$router.push({
        // name: "JobProcess",
        path: "./process",
        query: {
          msg: this.rowsmsg.id
        }
      });
    },
    /**执行构建任务  */
    excute(val){

      excuteJob(val).then(res => {
        this.msgSuccess("任务已经提交");
      });
    },

    // handleUpdate(row) {
    //   this.reset();
    //   const postId = row.postId || this.ids;
    //   getPost(postId).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改岗位";
    //   });
    // },
    // 新增构建列表
    submitForm(ruleForm) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          addJob(this.formLabelAlign).then(() => {
            this.msgSuccess("新增成功");
            this.open = false;
            this.getList();
            this.reset();
          });
        } else {
          // console.log('请输入正确的信息');
          return false;
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.postid || this.ids;
      this.$confirm(
        "确认删除该条数据",

        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delJob(postIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/post/export",
        {
          ...this.queryParams
        },
        `post_${new Date().getTime()}.xlsx`
      );
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
