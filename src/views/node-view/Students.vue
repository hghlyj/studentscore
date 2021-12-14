<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="24">
        <div>
          <el-col :span="4">
            <el-input
              placeholder="请输入姓名"
              v-model="queryInfo.query.name"
              clearable
              @clear="getStudents"
            ></el-input
          ></el-col>
          <el-col :span="3">
            <el-input
              placeholder="请输入市场部"
              v-model="queryInfo.query.market"
              clearable
              @clear="getStudents"
            ></el-input
          ></el-col>
          <el-col :span="3" v-permission="['admin']">
            <el-select
              v-model="queryInfo.query.depar_id"
              placeholder="请选择学院"
              clearable
            >
              <el-option
                v-for="item in deparoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option> </el-select
          ></el-col>
          <el-col :span="3" v-permission="['admin']">
            <el-select
              v-model="queryInfo.query.cls_id"
              placeholder="班级:请先选择学院"
              clearable
              :disabled="fdyjs"
            >
              <el-option
                v-for="item in sclsoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option> </el-select
          ></el-col>
          <el-col :span="3" v-permission="['admin']">
            <el-select
              v-model="queryInfo.query.fdy_id"
              clearable
              :disabled="fdyjs"
              placeholder="导员:请先选择学院"
            >
              <el-option
                v-for="item in sfdyoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-permission="['admin']">
            <el-select
              v-model="queryInfo.query.js_id"
              clearable
              :disabled="fdyjs"
              placeholder="讲师:请先选择学院"
            >
              <el-option
                v-for="item in sjsoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-permission="['fdy']">
            <el-select
              v-model="queryInfo.query.cls_id"
              placeholder="请先选择班级"
              clearable
              :disabled="fdyjs"
            >
              <el-option
                v-for="item in sclsoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option> </el-select
          ></el-col>
          <el-col :span="3" v-permission="['fdy']">
            <el-select
              v-model="queryInfo.query.js_id"
              clearable
              :disabled="fdyjs"
              placeholder="请先选择讲师"
            >
              <el-option
                v-for="item in sjsoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </div>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px"
        ><div>
          <el-col :span="3">
            <el-select
              v-model="queryInfo.query.sex"
              placeholder="选择性别"
              clearable
            >
              <el-option
                v-for="item in sexoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option> </el-select
          ></el-col>
          <el-col :span="3">
            <el-input
              placeholder="请输入宿舍号"
              v-model="queryInfo.query.dormnumber"
              clearable
              @clear="getStudents"
            ></el-input
          ></el-col>

          <el-col :span="1">
            <el-button
              type="primary"
              icon="el-icon-search"
              circle
              @click="getStudents"
            ></el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" @click="clearsearch">重置</el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="addDialogVisible = true"
              v-permission="['admin']"
              >添加学生</el-button
            >
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="addDialogVisible1 = true"
              v-permission="['admin']"
              >批量添加</el-button
            >
          </el-col>
        </div></el-row
      >
    </el-card>

    <!-- 用户列表区域 -->
    <el-table
      ref="multipleTable"
      style="margin: 40px 40px; margin-top: 40px"
      :data="studentlist"
      border
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="积分" prop="score"></el-table-column>
      <el-table-column label="性别" prop="sex">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 1">男</span>
          <span v-if="scope.row.sex == 0">女</span>
        </template>
      </el-table-column>
      <el-table-column label="重修次" prop="anewconunt"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="家长手机号" prop="family_phone"></el-table-column>
      <el-table-column label="关系" prop="relations"></el-table-column>
      <el-table-column label="学生地址" prop="address"></el-table-column>
      <el-table-column label="宿舍号-床位">
        <template slot-scope="scope">
          {{ scope.row.dormnumber }}-{{ scope.row.bednumber }}
        </template>
      </el-table-column>
      <el-table-column label="市场部" prop="market"></el-table-column>
      <el-table-column label="身份证" prop="idcardnumber"></el-table-column>
      <el-table-column label="部门" prop="depar_id">
        <template slot-scope="scope">
          <span v-if="scope.row.depar_id">
            {{ scope.row.depar_id.name }}
          </span>
          <span v-else>暂无部门</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" prop="cls_id">
        <template slot-scope="scope">
          <span v-if="scope.row.cls_id">
            {{ scope.row.cls_id.name }}
          </span>
          <span v-else>暂无分配班级</span>
        </template>
      </el-table-column>

      <el-table-column label="讲师" prop="js_id">
        <template slot-scope="scope">
          <span v-if="scope.row.cls_id">
            <span v-if="scope.row.cls_id.js_id">{{
              scope.row.cls_id.js_id.name
            }}</span>
            <span v-else>班级暂无讲师</span>
          </span>
          <span v-else>暂无班级</span>
        </template>
      </el-table-column>
      <el-table-column label="导员" prop="fdy_id">
        <template slot-scope="scope">
          <span v-if="scope.row.cls_id">
            <span v-if="scope.row.cls_id.fdy_id">{{
              scope.row.cls_id.fdy_id.name
            }}</span>
            <span v-else>班级暂无导员</span>
          </span>
          <span v-else>暂无班级</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            circle
            v-permission="['admin']"
            @click="showEditDialog(scope.row._id)"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            circle
            v-permission="['admin']"
            @click="removeDepartById(scope.row._id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.pagesize"
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
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="score">
          <el-input v-model="editForm.score"></el-input>
        </el-form-item>
        <el-form-item label="性别0,1" prop="sex">
          <el-input v-model="editForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="重修次" prop="anewconunt">
          <el-input v-model="editForm.anewconunt"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="家长手" prop="family_phone">
          <el-input v-model="editForm.family_phone"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="relations">
          <el-input v-model="editForm.relations"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="宿舍号" prop="dormnumber">
          <el-input v-model="editForm.dormnumber"></el-input>
        </el-form-item>
        <el-form-item label="床号" prop="bednumber">
          <el-input v-model="editForm.bednumber"></el-input>
        </el-form-item>
        <el-form-item label="市场部" prop="market">
          <el-input v-model="editForm.market"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idcardnumber">
          <el-input v-model="editForm.idcardnumber"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="depar_id">
          <el-select v-model="editForm.depar_id" placeholder="选择学院">
            <el-option
              v-for="item in deparoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="cls_id">
          <span v-if="editForm.depar_id != '' && clsoptions.length > 0">
            <el-radio-group v-model="editForm.cls_id">
              <el-radio
                :label="item._id"
                v-for="item in clsoptions"
                :key="item._id"
                >{{ item.name }}</el-radio
              >
            </el-radio-group></span
          ><span v-else>{{ message }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStudents">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加学生用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="score">
          <el-input v-model="addForm.score"></el-input>
        </el-form-item>
        <el-form-item label="性别0,1" prop="sex">
          <el-input v-model="addForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="重修次" prop="anewconunt">
          <el-input v-model="addForm.anewconunt"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="家长手" prop="family_phone">
          <el-input v-model="addForm.family_phone"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="relations">
          <el-input v-model="addForm.relations"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="宿舍号" prop="dormnumber">
          <el-input v-model="addForm.dormnumber"></el-input>
        </el-form-item>
        <el-form-item label="床号" prop="bednumber">
          <el-input v-model="addForm.bednumber"></el-input>
        </el-form-item>
        <el-form-item label="市场部" prop="market">
          <el-input v-model="addForm.market"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idcardnumber">
          <el-input v-model="addForm.idcardnumber"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="depar_id">
          <el-select v-model="addForm.depar_id" placeholder="选择学院">
            <el-option
              v-for="item in deparoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="cls_id">
          <span v-if="addForm.depar_id != '' && clsoptions.length > 0">
            <el-radio-group v-model="addForm.cls_id">
              <el-radio
                :label="item._id"
                v-for="item in clsoptions"
                :key="item._id"
                >{{ item.name }}</el-radio
              >
            </el-radio-group></span
          ><span v-else>{{ message }}</span>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量添加学生对话框 -->
    <el-dialog
      title="批量导入学生信息"
      :visible.sync="addDialogVisible1"
      width="50%"
      @close="addDialogClosed1"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm1"
        :rules="addFormRules1"
        ref="addFormRef1"
        label-width="80px"
      >
        <el-form-item label="学院" prop="depar_id">
          <el-select
            v-model="addForm1.depar_id"
            placeholder="请选择学院"
            clearable
          >
            <el-option
              v-for="item in deparoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="cls_id">
          <span v-if="addForm1.depar_id != '' && clsoptions.length > 0">
            <el-radio-group v-model="addForm1.cls_id">
              <el-radio
                :label="item._id"
                v-for="item in clsoptions"
                :key="item._id"
                >{{ item.name }}</el-radio
              >
            </el-radio-group></span
          ><span v-else>{{ message }}</span>
        </el-form-item>
        <el-form-item class="uploaditem" label="Excel文件" prop="excel">
          <el-upload
            class="upload-demo"
            name="stufile"
            drag
            :data="addForm1"
            :headers="header"
            action="http://127.0.0.1:3000/upload_excel_stu"
            :auto-upload="false"
            ref="uploadFile"
            :on-success="uploadSuccess"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
        <el-link
          target="_blank"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
          >下载excel模板</el-link
        >
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addUser1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getHeader } from "utils/login";
import {
  getStudents,
  addStudents,
  removeStudents,
  getStudentsItem,
  editStudentsItem,
} from "network/nodeapi/students";
import { getDeparcls, getallClasses } from "network/nodeapi/classes";
import {
  getallDepartment,
  getdyalljs,
  getdyallbj,
} from "network/nodeapi/department";
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  directives: { permission },
  data() {
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      header: {},
      fdyjs: true,
      //批量添加
      addForm1: {
        depar_id: "",
        cls_id: null,
      },
      addDialogVisible1: false,
      addFormRules1: {
        depar_id: [],
        cls_id: [{ required: true, message: "请选择班级", trigger: "blur" }],
      },
      //选择搜索的方式单搜索（只能根据一个条件搜索）
      clsoptions: [],
      clsoptionsall: [],
      sclsoptions: [],
      sjsoptions: [{ value: "", label: "请选择讲师" }],
      sfdyoptions: [{ value: "", label: "请选择导员" }],
      message: "请先选择学院",
      deparoptions: [],
      sexoptions: [
        {
          value: 1,
          label: "男",
        },
        {
          value: 0,
          label: "女",
        },
      ],
      //添加学生对话框
      addDialogVisible: false,
      // 获取用户列表的参数对象
      queryInfo: {
        query: {
          js_id: null,
          fdy_id: null,
          name: "",
          market: "",
          depar_id: "",
          cls_id: "",
          sex: "",
          dormnumber: "",
        },
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        pagesize: 5,
      },
      total: 0,
      studentlist: [],
      allstudents: [],
      downstudentlist:[
        {"name":"某某某", "sex":1, "idcardnumber":'13052120030718XXXX', "phone":13230978777, "family_phone":15227314555, "relations":"父子", "address":"河北省新都区", "anewconunt":2, "score":100, "dormnumber":9528, "bednumber":1,"market":"中原市场部"}
      ],

      // 添加部门的表单数据
      addForm: {
        name: "",
        score: "",
        sex: "",
        anewconunt: "",
        phone: "",
        family_phone: "",
        relations: "",
        address: "",
        dormnumber: "",
        bednumber: "",
        market: "",
        idcardnumber: "",
        depar_id: "",
        cls_id: null,
      },
      // 添加、修改表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 5,
            message: "姓名的长度在2~5个字符之间",
            trigger: "blur",
          },
        ],
        sex: [
          { required: true, message: "请输入性别", trigger: "blur" },
          {
            pattern: /^[0,1]{1}$/,
            message: "输入0/1数字",
            trigger: "blur",
          },
        ],
        anewconunt: [
          { required: true, message: "请输入重修次数", trigger: "blur" },
          {
            pattern: /^\d{1}$/,
            message: "你修超过十次吗？",
            trigger: "blur",
          },
        ],
        relations: [
          { required: true, message: "请输入亲自关系", trigger: "blur" },
          {
            min: 2,
            max: 5,
            message: "亲自关系的长度在2~5个字符之间",
            trigger: "blur",
          },
        ],
        address: [
          { required: true, message: "请输入家庭住址", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "亲自关系的长度在5~20个字符之间",
            trigger: "blur",
          },
        ],
        dormnumber: [
          { required: true, message: "请输入宿舍号", trigger: "blur" },
          {
            pattern: /^\d{4}$/,
            message: "输入4位数数字",
            trigger: "blur",
          },
        ],
        bednumber: [
          { required: true, message: "请输入床号", trigger: "blur" },
          {
            pattern: /^[1,2,3,4,5,6,7,8]{1}$/,
            message: "输入1~8,1位数数字",
            trigger: "blur",
          },
        ],
        market: [
          { required: true, message: "请输入市场部", trigger: "blur" },
          {
            min: 2,
            max: 6,
            message: "市场部的长度在2~6个字符之间",
            trigger: "blur",
          },
        ],
        idcardnumber: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
        ],
        cls_id: [
          { required: true, message: "请输入选择班级", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        family_phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制修改部门对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的部门信息对象
      editid: null,
      editForm: {
        name: "",
        score: "",
        sex: null,
        anewconunt: "",
        phone: "",
        family_phone: "",
        relations: "",
        address: "",
        dormnumber: "",
        bednumber: "",
        market: "",
        idcardnumber: "",
        depar_id: "",
        cls_id: null,
      },
    };
  },
  async created() {
    this.header = getHeader();
    const roles = this.$store.state.nodeuser.roles;
    const id = window.sessionStorage.getItem("userid");
    console.log(roles, 123456, roles.indexOf("fdy"));
    if (roles.indexOf("fdy") != -1) {
      this.queryInfo.query.fdy_id = id;
      this.fdyjs = false;
      this.getdyalljs(id);
      this.getdyallbj(id);
    } else if (roles.indexOf("js") != -1) {
      this.queryInfo.query.js_id = id;
    }
    await this.getStudents();
    this.allstudents = this.studentlist;
    this.getallDepartment();
    this.getallClasses();
  },
  watch: {
    "addForm1.depar_id": function (val) {
      if (val == "") {
        this.addForm.cls_id = null;
        this.message = "请先选择学院";
        this.clsoptions = [];
      } else {
        this.addForm.cls_id = null;
        this.getclassname(val);
      }
    },
    "addForm.depar_id": function (val) {
      if (val == "") {
        this.addForm.cls_id = null;
        this.message = "请先选择学院";
        this.clsoptions = [];
      } else {
        this.addForm.cls_id = null;
        this.getclassname(val);
      }
    },
    "editForm.depar_id": function (val) {
      if (val == "") {
        this.editForm.cls_id = null;
        this.message = "请先选择学院";
        this.clsoptions = [];
      } else {
        this.addForm.cls_id = null;
        this.getclassname(val);
      }
    },
    "queryInfo.query.depar_id": function (val) {
      console.log("id", val);
      if (val) {
        this.sjsoptions = [];
        this.sfdyoptions = [];
        this.sgetDepartmentjs(val);
        this.sgetDepartmentfdy(val);
        this.sgetclassname(val);
        this.fdyjs = false;
      } else {
        this.queryInfo.query.js_id = "";
        this.queryInfo.query.fdy_id = "";
        this.fdyjs = true;
        this.jsoptions = [];
        this.fdyoptions = [];
      }
    },
  },
  methods: {
    /* 
    page:当前页 默认为第一页
    page_size: 每页显示的记录数 默认为5条
    */
    async getStudents(
      $event,
      page = this.queryInfo.page,
      page_size = this.queryInfo.pagesize
    ) {
      const result = await getStudents({
        search: this.queryInfo.query,
        page,
        page_size,
      });
      console.log(result.data, "学生信息");
      if (result.code == 200) {
        this.$message.success("获取用户列表成功！");
        this.studentlist = result.data; //列表中展示的数据内容
        this.total = result.count; //数据总条数
      } else {
        return this.$message.error("获取用户列表失败！");
      }
    },
    //获取所有学院
    async getallDepartment() {
      const res = await getallDepartment();
      const content = res.data;
      this.deparoptions = [];
      content.forEach((item) => {
        if (item.label == 1) {
          let obj = {};
          obj.value = item._id;
          obj.label = item.name;
          this.deparoptions.push(obj);
        }
      });
    },
    //获取所有班级
    async getallClasses() {
      const res = await getallClasses();
      this.clsoptionsall = [];
      res.data.forEach((item) => {
        this.clsoptionsall.push(item);
      });
    },

    //获取部门下的班级名称列表
    async getclassname(id) {
      const res = await getDeparcls(id);
      const { data } = res;
      if (data.length == 0) {
        this.message = "该学院下暂无班级";
      }
      this.clsoptions = data;
      //  this.clsoptions = [];
      // data.forEach((item) => {
      //   const obj = {};
      //   obj.value = item._id;
      //   obj.label = item.name;
      //   this.clsoptions.push(obj);
      // });
    },
    async sgetclassname(id) {
      const res = await getDeparcls(id);
      const { data } = res;
      this.sclsoptions = [];
      data.forEach((item) => {
        const obj = {};
        obj.value = item._id;
        obj.label = item.name;
        this.sclsoptions.push(obj);
      });

      console.log("版恶疾", data, this.sclsoptions);
    },
    async sgetDepartmentjs(id) {
      const res = await getallDepartment({ depar_id: id, role: "讲师" });
      console.log(res, 78978979, "讲师");
      if (res.code == 200) {
        res.data.forEach((item) => {
          const obj = {};
          obj.value = item._id;
          obj.label = item.name;
          this.sjsoptions.push(obj);
        });
      }
    },
    async sgetDepartmentfdy(id) {
      const res = await getallDepartment({ depar_id: id, role: "导员" });
      console.log(res, 78978979, "导员");
      if (res.code == 200) {
        res.data.forEach((item) => {
          const obj = {};
          obj.value = item._id;
          obj.label = item.name;
          this.sfdyoptions.push(obj);
        });
      }
    },
    //获取导员所带的班级  与   讲师
    //获取导员带的班级的所有讲师
    async getdyalljs(id) {
      const res = await getdyalljs(id);
      this.sjsoptions = [];
      console.log(res, 1111);
      res.data.forEach((item) => {
        const obj = {};
        obj.value = item._id;
        obj.label = item.name;
        this.sjsoptions.push(obj);
      });
    },
    //获取导员带的所有班级
    async getdyallbj(id) {
      this.sclsoptions = [];
      const res = await getdyallbj(id);
      console.log(res, 1111);
      res.data.forEach((item) => {
        const obj = {};
        obj.value = item._id;
        obj.label = item.name;
        this.sclsoptions.push(obj);
      });
    },
    // 监听添加学生对话框的关闭事件
    addDialogClosed() {
      this.addForm.depar_id = "";
      this.clsoptions = [];
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新学生用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        if (this.addForm.phone == this.addForm.family_phone) {
          this.$message.error("家长手机号与学生手机号不能相同");
          return;
        }
        // 可以发起添加用户的网络请求
        const res = await addStudents(this.addForm);
        if (res.code == 200 && res.status == "Yes") {
          this.$message.success("添加学生成功！");
          // 重新获取学生列表数据
          this.getStudents();
          this.addDialogVisible = false;
        } else {
          this.$message.error(res.data);
        }
      });
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getStudents();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getStudents();
    },
    // 展示编辑学生信息的对话框
    async showEditDialog(id) {
      this.editForm.depar_id = "";
      this.editid = id;
      const result = await getStudentsItem(id);
      const { data } = result;
      if (result.code == 200) {
        this.editForm = data[0];
        if (this.editForm.sex == true) {
          this.editForm.sex = 1;
        } else {
          this.editForm.sex = 0;
        }
        this.editDialogVisible = true;
      }
    },
    // 监听修改学生对话框的关闭事件
    editDialogClosed() {
      this.editForm.depar_id = "";
      this.clsoptions = [];
      this.$refs.editFormRef.resetFields();
    },
    // 修改学生信息并提交
    editStudents() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const result = await editStudentsItem(this.editid, this.editForm);
        if (result) {
          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getStudents();
          // 提示修改成功
          this.$message.success("更新用户信息成功！");
        }
      });
    },
    // 根据Id删除对应的用户信息
    async removeDepartById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该部门, 是否继续?",
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
      removeStudents(id).then((value) => {
        this.$message.success("删除用户成功！");
        this.getStudents();
      });
    },
    //清空搜索的内容
    clearsearch() {
      const js_id = this.queryInfo.query.js_id;
      const fdy_id = this.queryInfo.query.fdy_id;
      this.queryInfo.query = {
        name: "",
        market: "",
        depar_id: "",
        cls_id: "",
        sex: "",
        dormnumber: "",
      };
      this.queryInfo.query.js_id = js_id;
      this.queryInfo.query.fdy_id = fdy_id;
    },

    addUser1() {
      this.$refs.addFormRef1.validate(async (valid) => {
        if (!valid) return;
        this.$refs.uploadFile.submit();
      });
    },
    // 批量监听添加学生对话框的关闭事件
    async addDialogClosed1() {
      this.addForm1.depar_id = "";
      this.clsoptions = [];
      this.$refs.addFormRef1.resetFields();
    },
    uploadSuccess(res, file, fileList) {
      console.log(res, file, fileList);
      if (res.code == 200 && res.status == "Yes") {
        this.$message.success("添加学生信息成功");
        //隐藏批量添加用户的对话框
        this.addDialogVisible1 = false;
        // 重新获取用户列表数据
        this.getStudents();
      } else {
        this.$message.error("学生信息有误");
      }
    },
    async handleDownload() {
      const confirmResult = await this.$confirm(
        "是否下载学生信息模板, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消下载");
      }
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        //字段
        const tHeader = ["姓名", "性别(0:女,1:男)", "身份证号", "手机号","家长手机号","关系","家庭住址","重修次数","综合积分","宿舍号","床位(1~8)","市场部"];
        const filterVal = ["name", "sex", "idcardnumber", "phone", "family_phone", "relations", "address", "anewconunt", "score", "dormnumber", "bednumber","market"];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "student-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.downstudentlist.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>

<style lang="less" scoped></style>
