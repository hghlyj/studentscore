<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input
            placeholder="请输入性名关键字"
            v-model="queryInfo.query.name"
            clearable
            @clear="getUserList"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="queryInfo.query.depar_id"
            placeholder="请选择部门"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in departmentOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="queryInfo.query.role"
            placeholder="请选择角色"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in roleOptionss"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="queryInfo.query.is_active"
            placeholder="请选择状态"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in is_activeOptionss"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getUserList"
            >搜索</el-button
          >
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加管理员</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 用户列表区域 -->
    <el-table :data="userlist" border stripe @expand-change="handleExpand">
      <el-table-column type="index"></el-table-column>

      <el-table-column label="姓名" prop="name"> </el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="登录账号" prop="zhanghao"></el-table-column>
      <!-- <el-table-column label="最后登录时间" prop="last_login">
        <template slot-scope="scope">
          <div v-if="typeof scope.row.last_login == 'string'">
            {{ scope.row.last_login | showDate }}
          </div>
          <div v-else>该账号暂未登录</div>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" prop="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | showDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_active"
            @change="userStateChanged(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
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
            @click="removeUserById(scope.row._id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="elForm"
        :model="editForm"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-col :span="24">
          <el-form-item label="登录账号" prop="zhanghao">
            <el-input
              v-model="editForm.zhanghao"
              placeholder="请输入登录账号"
              :maxlength="20"
              show-word-limit
              clearable
              prefix-icon="el-icon-user"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="editForm.phone"
              placeholder="请输入手机号"
              :maxlength="11"
              show-word-limit
              clearable
              prefix-icon="el-icon-mobile"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="editForm.email"
              placeholder="请输入邮箱"
              :maxlength="30"
              show-word-limit
              clearable
              prefix-icon="el-icon-s-promotion"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12">
          <el-form-item label="姓" prop="first_name">
            <el-input
              v-model="editForm.first_name"
              placeholder="姓啥"
              :maxlength="2"
              show-word-limit
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名" prop="last_name">
            <el-input
              v-model="editForm.last_name"
              placeholder="啥名"
              :maxlength="3"
              show-word-limit
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="editForm.name"
              placeholder="请输入姓名"
              :maxlength="5"
              show-word-limit
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!-- <el-form-item label="部门" prop="depar_id">
            <el-select
              v-model="editForm.depar_id"
              multiple
              placeholder="请选择部门"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in departmentOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="部门" prop="depar_id">
            <el-select
              v-model="editForm.depar_id"
              placeholder="请选择部门"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in departmentOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="职位" prop="role_id">
            <el-checkbox-group v-model="editForm.role_id" size="medium">
              <el-checkbox
                v-for="(item, index) in roleOptions"
                :key="index"
                :label="item.value"
                :disabled="item.disabled"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="角色" prop="role">
            <!-- <el-checkbox-group v-model="editForm.role" size="medium">
              <el-checkbox
                v-for="(item, index) in roleOptionss"
                :key="index"
                :label="item.value"
                :disabled="item.disabled"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group> -->
            <el-radio-group v-model="editForm.role" size="medium">
              <el-radio
                v-for="(item, index) in roleOptionss"
                :key="index"
                :label="item.value"
                :disabled="item.disabled"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用" prop="is_active" required>
            <el-switch v-model="editForm.is_active"> </el-switch>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-col :span="24">
          <el-form-item label="登录账号" prop="zhanghao">
            <el-input
              v-model="addForm.zhanghao"
              placeholder="请输入登录账号"
              :maxlength="20"
              show-word-limit
              clearable
              prefix-icon="el-icon-user"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="登录密码" prop="pass">
            <el-input
              type="password"
              show-password
              v-model="addForm.pass"
              placeholder="请输入密码"
              :maxlength="20"
              show-word-limit
              clearable
              prefix-icon="el-icon-user"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="addForm.phone"
              placeholder="请输入手机号"
              :maxlength="11"
              show-word-limit
              clearable
              prefix-icon="el-icon-mobile"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="addForm.email"
              placeholder="请输入邮箱"
              :maxlength="30"
              show-word-limit
              clearable
              prefix-icon="el-icon-s-promotion"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12">
          <el-form-item label="姓" prop="first_name">
            <el-input
              v-model="addForm.first_name"
              placeholder="姓啥"
              :maxlength="2"
              show-word-limit
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名" prop="last_name">
            <el-input
              v-model="addForm.last_name"
              placeholder="啥名"
              :maxlength="3"
              show-word-limit
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="addForm.name"
              placeholder="请输入姓名"
              :maxlength="5"
              show-word-limit
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!-- <el-form-item label="部门" prop="depar_id">
            <el-select
              v-model="addForm.depar_id"
              multiple
              placeholder="请选择部门"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in departmentOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="部门" prop="depar_id">
            <el-select
              v-model="addForm.depar_id"
              placeholder="请选择部门"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in departmentOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="职位" prop="role_id">
            <el-checkbox-group v-model="addForm.role_id" size="medium">
              <el-checkbox
                v-for="(item, index) in roleOptions"
                :key="index"
                :label="item.value"
                :disabled="item.disabled"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="角色" prop="role">
            <!-- <el-checkbox-group v-model="addForm.role" size="medium">
              <el-checkbox
                v-for="(item, index) in roleOptionss"
                :key="index"
                :label="item.value"
                :disabled="item.disabled"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group> -->
            <el-radio-group v-model="addForm.role" size="medium">
              <el-radio
                v-for="(item, index) in roleOptionss"
                :key="index"
                :label="item.value"
                :disabled="item.disabled"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用" prop="is_active" required>
            <el-switch
              v-model="addForm.is_active"
              active-text="启用"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  removeAdminUser,
  getAdminUserItem,
  editAdminUserItem,
  editAdminUsersItem,
  GetAdminUser,
  addAdminUser,
} from "network/nodeapi/adminuser";
import { getDeparrole } from "network/nodeapi/role";
import { getallDepartment } from "network/nodeapi/department";
export default {
  name: "adminuser",
  data() {
    return {
      // 获取用户列表的参数对象  混入
      queryInfo: {
        query: {
          name: "",
          depar_id: "",
          role: "",
          is_active: null,
        },
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        page_size: 5,
      },
      total: null,
      // roleOptions: [
      //   {
      //     label: "请先选择部门",
      //     value: 0,
      //     disabled: true,
      //   },
      // ],
      roleOptionss: [
        { value: "讲师", label: "讲师" },
        { value: "导员", label: "导员" },
        { value: "督察", label: "督察" },
        { value: "院长", label: "院长" },
      ],
      is_activeOptionss:[
        {value:false,label:'不允许登录'},
        {value:true,label:'允许登录'},
      ],
      departmentOptions: [],
      userlist: [],
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      addForm: {
        zhanghao: "",
        pass: "",
        phone: "",
        email: "",
        // first_name: "",
        // last_name: "",
        name: "",
        is_active: 1,
        // role_id: [],
        // role:[],
        role: "",
        // depar_id: null,
        depar_id: "",
      },
      editid: null,
      editForm: {
        zhanghao: "",
        pass: "",
        phone: "",
        email: "",
        // first_name: "",
        // last_name: "",
        name: "",
        is_active: null,
        // role_id: [],
        // role:[],
        role: "",
        // depar_id: [],
        depar_id: "",
      },
      // 修改表单的验证规则对象
      rules: {
        zhanghao: [
          {
            required: true,
            message: "请输入登录账号",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9]{4,30}$/,
            message: "账号必须由4~30数字字母构成",
            trigger: "blur",
          },
        ],
        pass: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9]{4,30}$/,
            message: "密码必须由4~30数字字母构成",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: "手机号格式错误",
            trigger: "blur",
          },
        ],
        // email: [
        //   {
        //     required: true,
        //     message: "请输入邮箱",
        //     trigger: "blur",
        //   },
        //   {
        //     pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
        //     message: "邮箱格式错误",
        //     trigger: "blur",
        //   },
        // ],
        // first_name: [
        //   {
        //     required: true,
        //     message: "姓啥",
        //     trigger: "blur",
        //   },
        //   {
        //     pattern: /^[\u4e00-\u9fa5]{1,2}$/,
        //     message: "请输入1~2位中文",
        //     trigger: "blur",
        //   },
        // ],
        // last_name: [
        //   {
        //     required: true,
        //     message: "啥名",
        //     trigger: "blur",
        //   },
        //   {
        //     pattern: /^[\u4e00-\u9fa5]{1,3}$/,
        //     message: "请输入1~3位中文",
        //     trigger: "blur",
        //   },
        // ],
        name: [
          {
            required: true,
            message: "姓名",
            trigger: "blur",
          },
          {
            pattern: /^[\u4e00-\u9fa5]{1,3}$/,
            message: "请输入1~5位中文",
            trigger: "blur",
          },
        ],
        depar_id: [
          {
            required: true,
            message: "请选择部门",
            trigger: "change",
          },
        ],
        role: [
          {
            required: true,
            message: "请至少选择一个职位",
            trigger: "change",
          },
        ],
      },
    };
  },
  filter: {
    showDate: function (value) {
      var moment = require("moment");
      let date = moment(value);
      return date.format("YYYY-MM-DD  HH:mm:ss");
    },
  },
  // watch: {
  // "addForm.depar_id": function (val) {
  //   this.roleOptions = [];
  //   val.forEach(async (item) => {
  //     await this.getDeparrole(item);
  //   });
  // },
  //   "editForm.depar_id": function (val) {
  //     this.roleOptions = [];
  //     val.forEach(async (item) => {
  //       await this.getDeparrole(item);
  //     });
  //   },
  // },
  created() {
    this.getUserList();
    this.getallDepartment();
  },
  filters: {
    showDate: function (value) {
      var moment = require("moment");
      let date = moment(value);
      return date.format("YYYY年MM月DD日 h:mm:ss a");
    },
  },
  methods: {
    //获取教职工列表
    async getUserList() {
      
      const result = await GetAdminUser(this.queryInfo);
      console.log(result, "管理员信息");
      if (result.code == 200) {
        this.userlist = result.data;
        this.total = result.count; //数据总条数
        return this.$message.success("获取用户列表成功！");
      } else {
        return this.$message.error("获取用户列表失败！");
      }
    },

    //获取部门列表
    async getallDepartment() {
      const departments = await getallDepartment();
      console.log("部门", departments);
      if (departments.code == 200) {
        departments.data.forEach((item) => {
          this.departmentOptions.push({
            value: item._id,
            label: item.name,
          });
        });
      }
    },

    //获取部门下的班级名称列表
    async getDeparrole(id) {
      const res = await getDeparrole(id);
      const { data } = res;
      data.forEach((item) => {
        const obj = {};
        obj.value = item._id;
        obj.label = item.role_name;
        this.roleOptions.push(obj);
      });
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.page_size = newSize;
      this.getUserList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getUserList();
    },
    // 监听 switch 开关状态的改变
    async userStateChanged(row) {
      const result = await editAdminUserItem(row._id, {
        is_active: row.is_active,
      });
      if (result.code == 200) {
        this.$message.success("更新用户状态成功！");
        this.getUserList();
      } else {
        this.$message.error("更新用户状态失败！");
      }
    },

    //监听  展开项
    handleExpand(row) {},
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addForm.resetFields();
    },
    // 添加用户信息并提交
    async addUserInfo() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return;
        // 发起修改用户信息的数据请求
        if (this.addForm.first_name && this.addForm.last_name) {
          this.addForm.name = this.addForm.first_name + this.addForm.last_name;
        }
        console.log(this.addForm,1111)
        const res = await addAdminUser(this.addForm);
        console.log("添加用户", res);
        if (res.code == 200 &&res.status == "Yes") {
          // 关闭对话框
          this.addDialogVisible = false;
          // 刷新数据列表
          this.getUserList();
          // 提示修改成功
          this.$message.success("添加用户成功");
        } else {
          this.$message.error(res.data);
        }
      });
    },

    // 展示编辑用户的对话框
    async showEditDialog(id) {
      this.editid = id;
      const result = await getAdminUserItem(id);
      console.log(result, "修改单个用户");
      if (result.code == 200) {
        this.$message.success("查询用户信息成功！");
        this.editForm = result.data[0];
        console.log(this.editForm, 456456456);
        this.editDialogVisible = true;
      } else {
        this.$message.error("查询用户信息失败！");
      }
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.elForm.resetFields();
    },
    // 修改用户信息并提交
    async editUserInfo() {
      this.$refs.elForm.validate(async (valid) => {
        if (!valid) return;
        // 发起修改用户信息的数据请求
        if(this.editForm.first_name &&this.editForm.last_name){

        this.editForm.name = this.editForm.first_name + this.editForm.last_name;
        }
        delete this.editForm._id;
        const res = await editAdminUsersItem(this.editid, this.editForm);
        if (res) {
          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getUserList();
          // 提示修改成功
          this.$message.success("更新用户信息成功！");
        } else {
          this.$message.error("更新用户信息失败！");
        }
      });
    },

    // 根据Id删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      await removeAdminUser(id);
      this.getUserList();
      return this.$message.success("删除用户成功！");
    },
  },
};
</script>

<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
