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
            >新增</el-button
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
      >
        <el-form-item label="" prop="postName">
          <el-input
            v-model="queryParams.name"
            placeholder="输入名称搜索"
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
      <el-table-column label="图谱标识" align="center" prop="code" />
      <el-table-column label="本体" align="center" prop="ontologyName" />
      <el-table-column label="创建时间" align="center" prop="createTime" />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleClear(scope.row)"
            >清空</el-button
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
            icon="el-icon-tickets"
            @click="gotoDetail(scope.row)"
            >详情</el-button
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <div v-if="!form.id">
          <el-form-item label="标识" prop="code">
            <el-select
              style="width:100%"
              filterable
              v-model="form.code"
              placeholder="请选择标识"
            >
              <el-option
                v-for="dict in codesOptions"
                :key="dict.code"
                :label="dict.code"
                :value="dict.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="本体" prop="ontologyId">
            <el-select
              style="width:100%"
              @change="selectChanged"
              v-model="form.ontologyId"
              placeholder="请选择本体"
            >
              <el-option
                v-for="(item, i) in btname"
                :key="i"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="标识" prop="name">
            <el-input disabled v-model="form.code" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="本体" prop="name">
            <el-input
              disabled
              v-model="form.ontologyName"
              placeholder="请输入名称"
            />
          </el-form-item>
        </div>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOntologyList } from "@/api/ontology/ontologylist";
import {
  getGraphList,
  addGraph,
  updateGraph,
  delGraph,
  getGraphCodes,
  clearGraph
} from "@/api/graph/graphlist";

export default {
  name: "Post",
  data() {
    // 自定义验证code
    const checkcode = (rule, val, callback) => {
      const CODE_REG = /^[a-zA-Z]\w{2,20}$/;
      if (!val) {
        callback(new Error("请选择code"));
      } else if (!CODE_REG.test(val)) {
        callback(
          new Error(
            "允许以数字小写字母、中划线，以数字或字母开头和结尾，长度2-20"
          )
        );
      } else {
        callback();
      }
    };
    return {
      btname: [],
      ontologyId: 0,
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
      codesOptions: [],
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
        //  postCode: [{ required: true, validator: checkcode, trigger: "blur" }],
        code: [{ required: true, trigger: "blur" }],
        ontologyId: [
          { required: true, message: "请选择本体", trigger: "blur" }
        ],
        description: {
          min: 0,
          max: 20,
          message: "长度在0到200个字符",
          trigger: "blur"
        }
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      getGraphList(this.queryParams).then(response => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 岗位状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    selectChanged(val) {
      this.ontologyId = val.id;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
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
      this.title = "新增图谱";
      getOntologyList().then(res => {
        this.btname = res.rows;
      });
      getGraphCodes().then(response => {
        this.codesOptions = response.data;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row, "我是什么啊");
      this.reset();
      getOntologyList().then(res => {
        this.btname = res.rows;
      });
      const postId = row.id || this.ids;
      // delGraph(postId).then(response => {
      this.form = JSON.parse(JSON.stringify(row));
      this.open = true;
      this.title = "修改图谱";
      // });
    },
    // 详情
    gotoDetail(row) {
      this.$router.push({
        path: "./info",
        query: {
          id: row.id
        }
      });
    },

    // 新增图谱
    submitForm(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGraph(this.form).then(() => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGraph(this.form).then(() => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        } else {
          console.log("请输入正确的信息");
          return false;
        }
      });
    },
    // 清空
    handleClear(row) {
      let loading = null;
      this.$confirm("确认清空该图谱", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          loading = this.$loading({
            lock: true,
            text: "清空中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          return clearGraph(row.id);
        })
        .then(() => {
          this.msgSuccess("清空成功");
        })
        .finally(() => {
          loading.close();
        });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.id || this.ids;
      this.$confirm(
        "确认删除该信息",

        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delGraph(postIds);
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
.app-container-search {
  display: flex;
  justify-content: space-between;
}
</style>
