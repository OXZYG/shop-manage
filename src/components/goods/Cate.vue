<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 商品列表数据 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" style="color:red;" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类 的 对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="60%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类 的 表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联选择器 
            option  指定数据来源
            props   原来指定配置对象
          -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表。默认为空
      catelist: [],
      // 总数据 条数
      total: 0,

      // 控制 添加分类 对话框的 显示与隐藏
      addCateDialogVisible: false,
      // 添加分类 的 表单 数据对象
      addCateForm: {
        // 分类 名称
        cat_name: "",
        // 父级分类ID
        cat_pid: 0,
        // 分类的等级， 默认是1级分类
        cat_level: 0,
      },
      // 添加分类 规则
      addCateRules: {
        cat_name: [
          { required: true, messagae: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级 分类 数组
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的 父级 分类 的ID
      selectedKeys: [],

      // tree-table 属性
      columns: [
        // 分类
        {
          label: "分类名称",
          prop: "cat_name",
        },
        // 有效
        {
          label: "是否有效",
          // 定义为模版
          type: "template",
          // 模版名称
          template: "isok",
        },
        // 排序
        {
          label: "排序",
          type: "template",
          // 模版名称
          template: "order",
        },
        // 操作
        {
          label: "操作",
          type: "template",
          // 模版名称
          template: "opt",
        },
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取 商品列表 数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.catelist = res.data.result;
      this.total = res.data.total;
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 添加分类 按钮
    showAddCateDialog() {
      // 先获取 父级 分类 列表
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取 父级 分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.parentCateList = res.data;
      console.log(this.parentCateList);
    },
    // 选择项 发生变化 时，触发
    parentCateChanged() {
      // console.log(this.selectedKeys);
      // 如果selectedChanged 数组长度大于0，即选中了父级分类
      if (this.selectedKeys.length > 0) {
        // 父级 分类ID
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 父级分类等级
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 父级 分类ID
        this.addCateForm.cat_pid = 0;
        // 父级分类等级
        this.addCateForm.cat_level = 0;
      }
    },
    // 确定 添加 按钮
    addCate() {
      // console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status != 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    //
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin: 10px;
}

.el-cascader {
  width: 100%;
}
</style>
