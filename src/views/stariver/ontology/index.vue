<template>
  <div class="app-container">
    <div class="app-container-search">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            >导入</el-button
          >
        </el-col>

        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            >删除</el-button
          >
        </el-col>

        <!-- <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar> -->
      </el-row>

      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
        :rules="rules"
      >
        <el-form-item label="">
          <el-input
            v-model="queryParams.name"
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
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="概念(个)" align="center" prop="ideaCount" />
      <el-table-column label="关系(条)" align="center" prop="relationCount" />
      <el-table-column label="创建时间" align="center" prop="createTime" />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleExport(scope.row)"
            >导出</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="godetails(scope.row.id)"
            >查看</el-button
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

    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form
        :rules="rules"
        label-width="90px"
        :model="formLabelAlign"
        ref="ruleForm"
      >
        <el-form-item prop="name" label="名称">
          <el-input
            size="small"
            required
            v-model="formLabelAlign.name"
            placeholder="请输入2-20字符名称"
          ></el-input>
        </el-form-item>

        <el-form-item required label="OWL文件">
          <div class="fileItem">
            <input type="file" id="file" ref="fileId" @change="getFile" />
          </div>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input
            size="small"
            type="textarea"
            v-model="formLabelAlign.description"
            placeholder="请输入0-200字描述"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOntologyList,
  delOntology,
  addOntology,
  queryOntology
} from "@/api/ontology/ontologylist";

export default {
  name: "Ontology",
  data() {
    return {
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
        owlfile: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
        ],
        description: [
          { message: "请输入任意字符, 长度0-200", trigger: "blur" },
          { min: 0, max: 200, message: "长度在0到200个字符", trigger: "blur" }
        ]
      },

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
    /** 查询列表 */
    getList() {
      this.loading = true;
      getOntologyList(this.queryParams).then(response => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 清空文件上传
    clearfile() {
      let input = this.$refs.fileId;
      if (input) {
        input.value = "";
      }
    },
    // 文件上传
    getFile() {
      //获取file内容
      let files = this.$refs.fileId.files[0];
      this.xlsxFile = files;
      let str = this.xlsxFile.name.substring(this.xlsxFile.name.length - 4);
      if (str !== ".owl") {
        // this.clearfile()
        this.$message.error("请选择以.owl结尾文件");
      }
    },
    // 表单重置
    reset() {
      this.formLabelAlign = {};
      this.resetForm("form");
    },
    // 导出数据
    handleExport(val) {
      this.download(
        "/stariver-server/ontology/export",
        {
          id: val.id
        },
        val.originFileName
      );
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.clearfile();
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

    submitForm(ruleForm) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let formData = new window.FormData();
          formData.append("file", this.xlsxFile);
          formData.append("name", this.formLabelAlign.name);
          formData.append("description", this.formLabelAlign.description);
          addOntology(formData).then(res => {
            this.msgSuccess("本体("+this.formLabelAlign.name+")导入成功");
            this.open = false;
            this.clearfile();
            this.getList();
          });
        } else {
          // console.log('请输入正确的信息');
          return false;
        }
      });
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
    },
    godetails(val) {
      this.$router.push({ path: `/ontology/info/${val}` });
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
