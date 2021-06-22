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
        <el-form-item label="" prop="name">
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
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="数据来源" align="center">
        Elasticsearch
      </el-table-column>
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
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
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
      <div class="types">
        <div class="types-title">数据源类型:</div>
        <div>
          <el-radio-group v-model="form.sourceType">
            <el-radio-button label="1">Elasticsearch</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <hr />
        <el-form-item label="连接地址" prop="connectionUrl">
          <el-input
            v-model="form.connectionUrl"
            placeholder="10.240.52.104:9200"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="form.connectionUserName"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            type="password"
            v-model="form.connectionPassword"
          ></el-input>
        </el-form-item>
        <div class="btn-warp">
          <div @click="testlink" class="btn">连接测试</div>
          <div :class="[{'el-icon-circle-check successful':show=='0'},{'el-icon-circle-close failure':show=='1'}]"></div>
        </div>
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
import { getPost } from "@/api/system/post";
import {
  getDatasourceList,
  addDatasourceList,
  updateDatasource,
  testDatasource,
  delDatasourceList
} from "@/api/datasource/datasourcelist";

export default {
  name: "Datasource",
  data() {
    return {
      show:"",
      radio1: "",
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
        postCode: undefined,
        postName: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        sourceType: "1"
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
        ],
        description: [
          { min: 0, max: 200, message: "长度在0到200个字符", trigger: "blur" }
        ],
        connectionUrl: [
          { required: true, message: "请输入正确的连接地址", trigger: "blur" }
        ]
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
    encode(txt) {
      try {
        return window.btoa(txt);
      } catch (e) {}
      return txt;
    },
    decode(txt) {
      try {
        return window.atob(txt);
      } catch (e) {}
      return txt;
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      getDatasourceList(this.queryParams).then(response => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 测试连接
    testlink() {
      let form = JSON.parse(JSON.stringify(this.form));
      form.connectionUserName = this.encode(this.form.connectionUserName);
      form.connectionPassword = this.encode(this.form.connectionPassword);
      testDatasource(form)
        .then(res => {
          this.show = "0";
          this.$message.success("连接测试成功");
        })
        .catch(err => {
          this.show = "1";         
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.show = "";
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        sourceType: "1"
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
      this.title = "新增数据源";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const postId = row.postId || this.ids;
      // getPost(postId).then(response => {
      this.form = JSON.parse(JSON.stringify(row));
      this.form.connectionUserName = this.decode(this.form.connectionUserName);
      this.form.connectionPassword = this.decode(this.form.connectionPassword);
      this.open = true;
      this.title = "修改数据源";
      // });
    },
    /** 提交按钮 */
    submitForm(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          form.connectionUserName = this.encode(this.form.connectionUserName);
          form.connectionPassword = this.encode(this.form.connectionPassword);
          if (this.form.id != null) {
            updateDatasource(form).then(() => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
              this.show = "";
            });
          } else {
            addDatasourceList(form).then(() => {
              this.$message.success("添加成功");
              this.open = false;
              this.getList();
              this.show = "";
            });
          }
        } else {
          // console.log('请输入正确的信息');
          return false;
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.id || this.ids;
      this.$confirm(
        "确认删除该条数据",

        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delDatasourceList(postIds);
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
.types {
  display: flex;
  .types-title {
    padding-top: 10px;
    box-sizing: border-box;
    margin-right: 10px;
    margin-bottom: 20px;
  }
}

.btn-warp {
  display: flex;
  align-items: center;
  margin-left: 80px;
  .successful {
    color: #11b276;
    font-size: 20px;
    margin-left: 10px;
  }
  .failure {
    color: red;
    font-size: 20px;
    margin-left: 10px;
  }
  .btn {
    width: 80px;
    height: 32px;
    background-color: #11b276;
    border-radius: 2px;
    text-align: center;
    line-height: 32px;
  }
}
</style>
