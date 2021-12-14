<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select
            v-model="queryInfo.query.department_id"
            clearable
            placeholder="请选择部门"
            @clear="getRoleList()"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="getRoleList()"
            >搜索</el-button
          >
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加职位</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 用户列表区域 -->
    <el-table :data="rolelist" border stripe>
      <el-table-column label="职位名称" prop="role_name"></el-table-column>
      <el-table-column label="职位所属部门" prop="depar_id">
        <template slot-scope="scope">
          <span v-if="scope.row.depar_id">
            {{ scope.row.depar_id.name }}
          </span>
          <span v-else>暂无分配部门</span>
        </template>
      </el-table-column>
      <el-table-column label="职位级别" prop="level">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.level == 1"
              ><el-tag type="success">一级</el-tag></span
            >
            <span v-if="scope.row.level == 2"
              ><el-tag type="info">二级</el-tag></span
            >
            <span v-if="scope.row.level == 3">
              <el-tag type="danger">三级</el-tag></span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="岗位职责" prop="duty">
        <template slot-scope="scope">
          <div v-if="typeof scope.row.duty == 'string'">
            {{ scope.row.duty }}
          </div>
          <div v-else>不为学院暂不分配</div>
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
            @click="removeRoleById(scope.row._id)"
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

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改职位"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="FormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="职位名称" prop="role_name" label-width="85px">
          <el-input v-model="editForm.role_name"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department" label-width="85px">
          <el-select v-model="editForm.depar_id" placeholder="请选择部门">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位级别" label-width="85px" prop="level">
          <el-select v-model="editForm.level" placeholder="岗位级别">
            <el-option
              v-for="item in leveloptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="职位名称"
          prop="duty"
          label-width="85px"
          v-if="editdutyshow"
        >
          <el-radio v-model="editForm.duty" label="就业" border>就业</el-radio>
          <el-radio v-model="editForm.duty" label="教学" border>教学</el-radio>
          <el-radio v-model="editForm.duty" label="学管" border>学管</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDepartment">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加职位的对话框 -->
    <el-dialog
      title="添加职位"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogVisible = false"
    >
      <el-form
        :model="addForm"
        :rules="FormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="职位名称" prop="role_name" label-width="85px">
          <el-input v-model="addForm.role_name"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="depar_id" label-width="85px">
          <el-select v-model="addForm.depar_id" placeholder="请选择部门">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位级别" label-width="85px" prop="level">
          <el-select v-model="addForm.level" placeholder="岗位级别">
            <el-option
              v-for="item in leveloptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="职位名称"
          prop="duty"
          label-width="85px"
          v-if="dutyshow"
        >
          <el-radio v-model="addForm.duty" label="就业" border>就业</el-radio>
          <el-radio v-model="addForm.duty" label="教学" border>教学</el-radio>
          <el-radio v-model="addForm.duty" label="学管" border>学管</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRole,
  addRole,
  removeRole,
  getRoleItem,
  editRoleItem,
} from "network/nodeapi/role";
import { getallDepartment } from "network/nodeapi/department";
export default {
  data() {
    return {
      options: [{ value: "", label: "请选择部门" }],
      leveloptions: [
        { value: 1, label: "一级" },
        { value: 2, label: "二级" },
        { value: 3, label: "三级" },
      ],
      queryInfo: {
        query: {
          depar_id: "",
        },
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        pagesize: 5,
      },
      rolelist: [],
      total: 0,

      // 添加表单数据
      addForm: {},
      dutyshow: false,
      editdutyshow: false,
      // 添加、修改表单的验证规则对象
      FormRules: {
        role_name: [
          { required: true, message: "请输入职位名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "职位名称的长度在2~10个字符之间",
            trigger: "blur",
          },
        ],
        depar_id: [{ required: true, message: "请选择部门", trigger: "blur" }],
        level: [{ required: true, message: "请选择岗位级别", trigger: "blur" }],
        duty: [{ required: true, message: "请选择岗位职责", trigger: "blur" }],
      },
      // 控制修改部门对话框的显示与隐藏
      editDialogVisible: false,
      addDialogVisible: false,
      // 查询到的信息对象
      editid: null,
      editForm: { depar_id: "", role_name: "", level: null, duty: "" },
    };
  },
  created() {
    this.getDepartmentList();
    this.getRoleList();
  },
  watch: {
    "addForm.depar_id": function (val) {
      this.adddepartlabel(val);
    },
    "editForm.depar_id": function (val) {
      this.editdepartlabel(val);
    },
  },
  methods: {
    async getDepartmentList() {
      const departments = await getallDepartment();
      console.log(departments, "部门信息");
      if (departments.code == 200) {
        departments.data.forEach((item) => {
          // console.log(item)
          this.options.push({
            value: item._id,
            label: item.name,
            labe: item.label,
          });
        });
      }
    },

    async getRoleList() {
      const result = await getRole({
        search: this.queryInfo.query,
        page: this.queryInfo.page,
        pagesize: this.queryInfo.pagesize,
      });
      console.log(result, "角色");
      if (result.code == 200) {
        this.rolelist = result.data; //列表中展示的数据内容
        this.total = result.count; //数据总条数
      }
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getRoleList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getRoleList();
    },

    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        console.log(123465,this.addForm)
        const res = await addRole(this.addForm)
        if ((res.data = 200)) {
          this.getRoleList();
          this.$message.success("添加职位成功！");
          this.addForm = {
            role_name: "",
            department: "",
            level: "",
            label: null,
          };
          this.addDialogVisible = false;
        }
      });
    },
    //获取部门信息  （看其是学院还是其他）
    adddepartlabel(id) {
      let pid = null;
      this.options.forEach((item) => {
        if (item.value == id) {
          pid = item.labe;
        }
      });
      console.log(pid);
      if (pid == true) {
        this.addForm.label = true;
        this.dutyshow = true;
      } else {
        this.addForm.label = false;
        this.dutyshow = false;
      }
    },
    editdepartlabel(id) {
      let pid = null;
      console.log(id);
      this.options.forEach((item) => {
        if (item.value == id) {
          pid = item.labe;
        }
      });
      if (pid == true) {
        this.editForm.label = true;
        this.editdutyshow = true;
      } else {
         this.editForm.label = false;
        this.editdutyshow = false;
      }
    },

    // 展示编辑的对话框
    async showEditDialog(id) {
      this.editForm.depar_id = null;
      this.editid = id;
      const result = await getRoleItem(id);
      if (result) {
        // if (result.data[0].level == 1) {
        //   result.level = "一级";
        // }
        // if (result.data[0].level == 2) {
        //   result.level = "二级";
        // }
        // if (result.data[0].level == 3) {
        //   result.level = "三级";
        // }
        this.editForm = result.data[0];
        this.editdepartlabel(this.editForm.department);
        this.editDialogVisible = true;
      }
    },
    // 监听修改部门对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改部门信息并提交
    editDepartment() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        delete this.editForm._id;
        // 发起修改用户信息的数据请求
        const result = await editRoleItem(this.editid, this.editForm);
        if (result.code==200) {
          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getRoleList();
          // 提示修改成功
          this.$message.success("更新职位信息成功！");
        }
      });
    },
    // 根据Id删除对应的用户信息
    async removeRoleById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该职位, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      removeRole(id).then((value) => {
        this.$message.success("删除职位成功！");
        this.getRoleList();
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
