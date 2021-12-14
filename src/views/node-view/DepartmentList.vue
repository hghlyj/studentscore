<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="addForm.name"
            placeholder="请输入部门名称"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="addForm.label"
            placeholder="请输入标签(1为学院,0其他)"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDepartment">添加部门</el-button>
        </el-col>
      </el-row>

      <!-- 部门列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="部门名称" prop="name"></el-table-column>
        <el-table-column label="部门标签">
          <template slot-scope="scope">
            <span v-if="scope.row.label == 1"
              ><el-tag type="success">学院</el-tag></span
            >
            <span v-else><el-tag type="info">其他</el-tag></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row._id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeDepartById(scope.row._id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改部门的对话框 -->
    <el-dialog
      title="修改部门"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="部门名称">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="editForm.label" placeholder="请选择标签">
            <el-option
              v-for="item in labeloptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDepartmentItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepartment,
  addDepartment,
  removeDepartment,
  getDepartmentItem,
  editDepartmentItem,
} from "network/nodeapi/department";
export default {
  name: "departmentlist",
  data() {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
      },
      userlist: [],
      total: 0,
      // 添加部门的表单数据
      addForm: {
        name: "",
        label: null,
      },
      editDialogVisible: false,
      // 查询到的部门信息对象
      editid: null,
      editForm: {
        name: "",
        label: null,
      },
      //标签选
      labeloptions: [
        { value: 0, label: "其他" },
        { value: 1, label: "学院" },
      ],
    };
  },
  created() {
    this.getDeparList();
  },
  methods: {
    /* 
    page:当前页 默认为第一页
    page_size: 每页显示的记录数 默认为2条
    */
    async getDeparList(
      page = this.queryInfo.pagenum,
      page_size = this.queryInfo.pagesize
    ) {
      const result = await getDepartment({ page, page_size });
      console.log(result);
      if (result) {
        this.userlist = result.data; //列表中展示的数据内容
        this.total = result.count; //数据总条数
      } else {
        return this.$message.error("获取部门列表失败！");
      }
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getDeparList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getDeparList(val);
    },

    async addDepartment() {
      // 可以发起添加部门的网络请求
      if (this.addForm.label == 1 || this.addForm.label == 0) {
        if (this.addForm.name.length == 0) {
          this.$message.error("请填入部门名称");
          return false;
        }
        if (this.addForm.name.length > 10 || this.addForm.name.length < 2) {
          this.$message.error("名称应该在2~10位");
          return false;
        }
        const res = await addDepartment(this.addForm);
        if (res.code !== 200) {
          this.$message.error("添加部门失败！");
        } else if (res.status == "No") {
          this.$message.error(res.data);
          return ;
        }
        this.$message.success("添加部门成功！");
        this.addForm = { name: "", label: "" };
        this.getDeparList();
      } else {
        this.$message.error("只能输入0或1");
      }
    },

    // 展示编辑部门的对话框
    async showEditDialog(id) {
      this.editid = id;
      const result = await getDepartmentItem(id);
      const { data } = result;
      if (data[0]) {
        if (data[0].label == true) {
          data[0].label = 1;
        }
        if (data[0].label == false) {
          data[0].label = 0;
        }
        this.editForm = data[0];
        this.editDialogVisible = true;
      }
    },
    // 监听修改部门对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改部门信息并提交
    async editDepartmentItem() {
      // 发起修改部门信息的数据请求
      console.log("qwe");
      const result = await editDepartmentItem(this.editid, this.editForm);
      if (result.code == 200) {
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getDeparList();
        // 提示修改成功
        this.$message.success("更新部门信息成功！");
      }
    },
    // 根据Id删除对应的部门信息
    async removeDepartById(id) {
      // 弹框询问部门是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该部门, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果部门确认删除，则返回值为字符串 confirm
      // 如果部门取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      removeDepartment(id).then((value) => {
        this.$message.success("删除部门成功！");
        this.getDeparList();
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
