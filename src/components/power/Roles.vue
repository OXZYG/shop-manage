<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加 角色 按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表数据 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="['bdbottom', i2 === 0 ? 'bdtop' : '']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <!-- 编辑 -->
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <!-- 删除 -->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="removeRoleById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配 -->
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRightDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <el-form :model="addForm" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名称：">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色信息 对话框 -->
    <el-dialog
      title="角色信息"
      :visible.sync="editRoleDialogVisible"
      width="45%"
    >
      <el-form :model="editInfo" ref="editFormRef" label-width="100px">
        <el-form-item label="当前角色：">
          <el-input v-model="editInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="editInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 分配权限窗口
      setRightDialogVisible: false,
      // 权限数据
      rightList: [],
      // 分配权限 树形控件绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 分配权限 已选择的权限ID
      defKeys: [],
      // 分配权限 的角色ID
      roleId: "",

      // 添加角色  按钮 对话框
      addRoleDialogVisible: false,
      // 添加 角色 表单数据
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色 规则

      // 编辑 角色信息 对话框
      editRoleDialogVisible: false,
      // 保存 编辑的 角色 信息
      editInfo: {},
      //
    };
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      // this.$message.success("获取角色列表成功");
      this.rolesList = res.data;
    },
    //删除 角色的权限
    async removeRightById(role, rightId) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除，是否继续",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      if (confirmRes !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      role.children = res.data;
      this.$message.succcess("成功删除");
    },

    // 添加角色 按钮
    addRoleDialog() {
      this.addRoleDialogVisible = true;
    },
    // 添加角色 对话框的 取消 按钮
    addRoleDialogClosed() {
      this.addRoleDialogVisible = false;
      this.$refs.addFormRef.resetFields();
      this.addForm.roleName = '';
      this.addForm.roleDesc = '';
    },
    // 添加角色 确定 按钮
    async addRole() {
      const {data:res} = await this.$http.post('roles',this.addForm);
      // console.log(res);
      this.getRolesList();
      this.addRoleDialogVisible = false;
    },

    // 分配权限 对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      //获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      // 数据保存到rightList中
      this.rightList = res.data;
      // console.log(this.rightList);
      this.getLeafKeys(role, this.defKeys);
      // console.log(this.defKeys);
      this.setRightDialogVisible = true;
    },
    //展开角色权限; 通过递归的形式，获取角色下所有的三级权限id，并保存到 defKeys 中
    getLeafKeys(node, arr) {
      // 如果当前节点不包含 children ，则为三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听 分配权限对话框的关闭,清空 defKeys 数组
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 提交 为角色分配权限
    async allotRights() {
      const keys = [
        // ... 展开运算符
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // console.log(keys);

      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      console.log(this.roleId);
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },

    //编辑 角色 对话框
    async showEditRoleDialog(role) {
      // console.log(this.roleId);
      this.roleId = role.id;
      console.log(this.roleId);
      const { data: res } = await this.$http.get(`roles/${this.roleId}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败");
      }
      this.editInfo = res.data;
      this.editRoleDialogVisible = true;
    },
    //确认 修改角色
    async editRoleInfo() {
      const { data: res } = await this.$http.put(
        `roles/${this.editInfo.roleId}`,
        {
          roleName: this.editInfo.roleName,
          roleDesc: this.editInfo.roleDesc,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色信息失败");
      } else {
        // 关闭对话框
        this.editRoleDialogVisible = false;
        // 刷新数据列表
        this.getRolesList();
        // 提示用户更新成功
        this.$message.success("更新用户信息成功");
      }
    },
    //删除 角色
    async removeRoleById(id) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除，是否继续",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      if (confirmRes !== "confirm") {
        return this.$message.info("已取消");
      }
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败");
      } else {
        // 关闭对话框
        this.editRoleDialogVisible = false;
        // 刷新数据列表
        this.getRolesList();
        // 提示用户更新成功
        this.$message.success("删除角色成功");
      }
    },

    //
  },
  created() {
    // 获取角色列表
    this.getRolesList();
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}

.bdtop {
  border-top: 1px solid lightgray;
}

.bdbottom {
  border-bottom: 1px solid lightgray;
}

.el-row {
  display: flex;
  align-items: center;
}
</style>
