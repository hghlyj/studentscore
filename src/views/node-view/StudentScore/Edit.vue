<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="3">
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
        </div></el-row
      >
    </el-card>
    <!-- 用户列表区域 -->
    <span v-if="studentlist.length != 0">
      <el-table
        ref="multipleTable"
        style="margin-top: 40px"
        :data="studentlist"
        border
        stripe
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="积分" prop="score"></el-table-column>
        <el-table-column label="性别" prop="sex">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 0">男</span>
            <span v-if="scope.row.sex == 1">女</span>
          </template>
        </el-table-column>
        <el-table-column label="重修次" prop="anewconunt"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column
          label="家长手机号"
          prop="family_phone"
        ></el-table-column>
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

        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <!-- 扣分按钮 -->
            <el-button
              type="primary"
              size="mini"
              @click="awaDialoghand(scope.row)"
              v-permission="['admin', 'fdy']"
              >加分</el-button
            >
            <!-- 加分按扭 -->
            <el-button
              type="success"
              size="mini"
              @click="subDialoghand(scope.row)"
              v-permission="['admin', 'dc']"
              >减分</el-button
            >
            <!-- 过往违纪 -->
            <el-button
              type="warning"
              size="mini"
              @click="hisDialoghand(scope.row)"
              v-permission="['admin', 'fdy', 'js']"
              >记录</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </span>
    <span v-else class="imag"> 请搜索 </span>
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
    <!--综合积分加分-->
    <el-dialog
      title="学生综合积分增减"
      :visible.sync="awaDialogVisible"
      width="60%"
      @close="awaDialogClosed"
    >
      <el-descriptions class="margin-top" title="学生信息" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ this.awaForm.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            身份证
          </template>
          {{ this.awaForm.idcardnumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            学院
          </template>
          {{ this.awaForm.depar }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            班级
          </template>
          {{ this.awaForm.cls }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            讲师
          </template>
          {{ this.awaForm.lecturer }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            导员
          </template>
          {{ this.awaForm.counsellor }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            宿舍号
          </template>
          {{ this.awaForm.dormnumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            家庭住址
          </template>
          {{ this.awaForm.address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            市场部
          </template>
          {{ this.awaForm.market }}
        </el-descriptions-item>
      </el-descriptions>
      <div style="display: inline-block; width: 500px; margin-top: 60px">
        <el-form
          :model="awaForm"
          :rules="awaFormRules"
          ref="awaFormRef"
          label-width="140px"
          class="awa-form"
        >
          <el-form-item label="加分项" prop="content">
            <el-autocomplete
              v-model="state"
              :fetch-suggestions="awaquerySearchAsync"
              placeholder="请输入加分项"
              @select="awahandleSelect"
              clearable
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="分数" prop="Marks">
            <el-tag type="success" effect="dark" style="width: 150px">
              <span v-if="awaForm.Marks"> {{ awaForm.Marks }}</span>
              <span v-else>请先选加分项</span>
            </el-tag>
          </el-form-item>
          <el-form-item label="日期" prop="data">
            <el-date-picker
              v-model="awaForm.data"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div :class="{ awaupload: awauploadbool, awaupload2: awauploadbool2 }">
        <el-upload
          class="upload-demo"
          :headers="header"
          ref="awaupload"
          action="http://127.0.0.1:3000/list-awafile"
          :limit="1"
          :before-upload="awabeforeAvatarUpload"
          :on-preview="awahandlePreview"
          :on-remove="awahandleRemove"
          :on-success="awahandsuccess"
          :on-exceed="awahandexceed"
          :on-change="awahandchange"
          accept="jpg"
          :auto-upload="false"
          :data="awaForm"
          list-type="picture-card"
          style="margin-bottom: 20px"
          name="awafile"
        >
          <i slot="default" class="el-icon-plus"></i>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer" style="padding-left: 150px">
        <el-button @click="awaDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="awascore">确 定</el-button>
      </span>
    </el-dialog>
    <!--综合积分扣分-->
    <el-dialog
      title="扣分"
      :visible.sync="subDialogVisible"
      width="50%"
      @close="subDialogClosed"
      ><el-descriptions class="margin-top" title="学生信息" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ this.subForm.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            身份证
          </template>
          {{ this.subForm.idcardnumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            学院
          </template>
          {{ this.subForm.depar }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            班级
          </template>
          {{ this.subForm.cls }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            讲师
          </template>
          {{ this.subForm.lecturer }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            导员
          </template>
          {{ this.subForm.counsellor }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            宿舍号
          </template>
          {{ this.subForm.dormnumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            家庭住址
          </template>
          {{ this.subForm.address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            市场部
          </template>
          {{ this.subForm.market }}
        </el-descriptions-item>
      </el-descriptions>
      <div style="display: inline-block; width: 500px; margin-top: 60px">
        <el-form
          :model="subForm"
          :rules="subFormRules"
          ref="subFormRef"
          label-width="140px"
          class="sub-form"
        >
          <el-form-item label="违纪类型" prop="disciplinetype">
            <el-select
              v-model="subForm.disciplinetype"
              placeholder="请选择违纪类型"
            >
              <el-option
                v-for="item in Disciplinetypeselect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="扣分项" prop="content">
            <el-autocomplete
              v-model="state"
              :fetch-suggestions="subquerySearchAsync"
              placeholder="请输入内容"
              @select="subhandleSelect"
              clearable
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="分数" prop="Marks">
            <el-tag type="success" effect="dark" style="width: 150px">
              <span v-if="subForm.Marks"> {{ subForm.Marks }}</span>
              <span v-else>请先选扣分项</span>
            </el-tag>
          </el-form-item>
          <el-form-item label="日期" prop="data">
            <el-date-picker
              v-model="subForm.data"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="课节" prop="course">
            <el-radio-group v-model="subForm.anp">
              <el-radio-button label="上午"></el-radio-button>
              <el-radio-button label="下午"></el-radio-button>
              <el-radio-button label="晚上"></el-radio-button>
            </el-radio-group>
            <el-select v-model="subForm.kejie" placeholder="请选择课节">
              <el-option
                v-for="item in courseoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div :class="{ subupload: subuploadbool, subupload2: subuploadbool2 }">
        <el-upload
          class="upload-demo"
          :headers="header"
          ref="subupload"
          action="http://127.0.0.1:3000/list-subfile"
          :limit="1"
          :before-upload="subbeforeAvatarUpload"
          :on-preview="subhandlePreview"
          :on-remove="subhandleRemove"
          :on-success="subhandsuccess"
          :on-exceed="subhandexceed"
          :on-change="subhandchange"
          accept="jpg"
          :file-list="subForm.avatar"
          :auto-upload="false"
          :data="subForm"
          list-type="picture-card"
          style="margin-bottom: 20px"
          name="subfile"
        >
          <i slot="default" class="el-icon-plus"></i>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="subDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subscore">确 定</el-button>
      </span>
    </el-dialog>

    <!--综合积分记录-->
    <el-dialog
      title="记录"
      :visible.sync="hisDialogVisible"
      width="50%"
      height="10%"
      @close="hisDialogClosed"
    >
      <el-tabs v-model="activeName">
        <!-- <el-tab-pane label="减分记录" name="subscore"> -->
          <div style="height: 300px; width: 100%; background-color: #ccc">
            <!-- 这里的标签名称要和main.js文件中定义的组件名称保持一致 -->
            <happy-scroll color="rgba(0,0,0,0.5)" size="5">
              <!-- 内层盒子——内容区 -->
              <div class="con1">
                <el-timeline style="margin-top:15px">
                  <el-timeline-item
                    v-for="(activity, index) in subactivities"
                    :key="index"
                    :icon="activity.icon"
                    :type="activity.type"
                    :color="activity.color"
                    :size="activity.size"
                    :timestamp="activity.timestamp"
                  >
                    {{ activity.content }}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </happy-scroll>
          </div>
        <!-- </el-tab-pane> -->
        <!-- <el-tab-pane label="加分记录" name="awascore"> -->
          <div style="height: 300px; width: 100%; background-color: #ccc;margin-top:40px">
            <!-- 这里的标签名称要和main.js文件中定义的组件名称保持一致 -->
            <happy-scroll color="rgba(0,0,0,0.5)" size="5">
              <!-- 内层盒子——内容区 -->
              <div class="con2">
                <el-timeline style="margin-top:15px">
                  <el-timeline-item
                    v-for="(activity, index) in awaactivities"
                    :key="index"
                    :icon="activity.icon"
                    :type="activity.type"
                    :color="activity.color"
                    :size="activity.size"
                    :timestamp="activity.timestamp"
                  >
                    {{ activity.content }}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </happy-scroll>
          </div>
        <!-- </el-tab-pane> -->
      </el-tabs>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleImg">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getStudents } from "network/nodeapi/students";
import { getDeparcls, getallClasses } from "network/nodeapi/classes";
import {
  getallDepartment,
  getdyalljs,
  getdyallbj,
} from "network/nodeapi/department";
import { getHeader } from "utils/login";
import {
  GetSubtractMarksall,
  GetAwardedMarksall,
  CreateMarksLists,
  GetScorelistOne,
} from "network/nodeapi/studentscore";
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  data() {
    return {
      activeName: "subscore",
      fdyjs: true,
      awauploadbool: true,
      awauploadbool2: true,
      subuploadbool: true,
      subuploadbool2: true,
      //学生综合积分管理
      awaDialogVisible: false,
      subDialogVisible: false,
      hisDialogVisible: false,
      allhisscorelist: [],
      awaactivities: [],
      subactivities: [],
      awaForm: {
        stu_id: "",
        name: "",
        sex: null,
        idcardnumber: "",
        depar: "",
        cls: "",
        lecturer: "",
        counsellor: "",
        dormnumber: "",
        address: "",
        market: "",
        state: null,
        content: "",
        Marks: null,
        js_id: null,
        fdy_id: null,
        depar_id: null,
        cls_id: null,
        bednumber: null,
        // avatar: [],
        // data: null,
        // create_data:'',
        // update_data:'',
      },
      subForm: {
        stu_id: "",
        name: "",
        sex: null,
        idcardnumber: "",
        depar: "",
        cls: "",
        lecturer: "",
        counsellor: "",
        dormnumber: null,
        bednumber: null,
        address: "",
        market: "",
        state: null,
        disciplinetype: "",
        content: "",
        Marks: null,
        js_id: null,
        fdy_id: null,
        depar_id: null,
        cls_id: null,
        // avatar: [],
        // data: null,
        anp: "",
        kejie: "",
        course: "",
        // create_data:'',
        // update_data:'',
      },
      awaFormRules: {},
      subFormRules: {},

      header: {},
      AwardedMarkslist: [],
      SubtractMarkslistall: [],
      SubtractMarkslist: [{ value: "" }],
      state: "",
      timeout: null,
      Disciplinetypeselect: [
        { value: "宿舍违纪", label: "宿舍违纪" },
        { value: "学院违纪", label: "学院违纪" },
      ],
      courseoptions: [
        {
          value: "第一节课",
          label: "第一节课",
        },
        {
          value: "第二节课",
          label: "第二节课",
        },
        {
          value: "第三节课",
          label: "第三节课",
        },
        {
          value: "第四节课",
          label: "第四节课",
        },
      ],

      dialogVisibleImg: false,
      dialogImageUrl: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "前天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      //
      clsoptionsall: [],
      deparoptions: [],
      sclsoptions: [],
      sjsoptions: [{ value: "", label: "请选择讲师" }],
      sfdyoptions: [{ value: "", label: "请选择导员" }],
      sexoptions: [
        {
          value: 0,
          label: "男",
        },
        {
          value: 1,
          label: "女",
        },
      ],
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
    };
  },
  async created() {
    const roles = this.$store.state.nodeuser.roles;
    const id = window.sessionStorage.getItem("userid");
    console.log(roles, 123456, roles.indexOf("fdy"));
    if (roles.indexOf("fdy") != -1) {
      this.queryInfo.query.fdy_id = id;
      this.fdyjs = false;
      this.getdyalljs(id);
      this.getdyallbj(id);
    } else if (roles.indexOf("js") != -1) {
      console.log(7777777);
      this.queryInfo.query.js_id = id;
    }
    this.header = getHeader();
    this.getallDepartment();
    this.getallClasses();
    this.GetAwardedMarksall();
    this.GetSubtractMarksall();
  },
  watch: {
    "subForm.disciplinetype": function (val) {
      
      let flag = false;
      this.SubtractMarkslist = [];
      this.SubtractMarkslistall.forEach((item) => {
        if (item.Disciplinetype == val) {
          flag = true;
          const obj = {};
          if (item.expel) {
            item.Marks = "开除";
          }
          obj.value = item.content;
          obj.Marks = item.Marks;
          obj._id = item._id;
          this.SubtractMarkslist.push(obj);
        }
      });
      if (!flag) {
        this.SubtractMarkslist = [{ value: "该违纪类型暂无" }];
      }
    },
    awaDialogVisible: function (val) {
      if (val == false) {
        this.$refs.awaupload.clearFiles();
        this.awauploadbool = true;
        this.state = "";
      }
    },
    subDialogVisible: function (val) {
      if (val == false) {
        this.$refs.subupload.clearFiles();
        this.subuploadbool = true;
        this.state = "";
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
        console.log('asd',111111)
        this.queryInfo.query.cls_id = "";
        this.queryInfo.query.js_id = "";
        this.queryInfo.query.fdy_id = "";
        this.fdyjs = true;
        this.jsoptions = [];
        this.fdyoptions = [];
      }
    },
    state: function (val) {
      if (!val) {
        this.awaForm.content = "";
        this.subForm.content = "";
      }
    },
  },
  directives: { permission },
  methods: {
    awabeforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      // const isPNG = file.type === "image/png"
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      } else {
      }
      return isJPG && isLt2M;
    },
    awahandleRemove(file) {
      console.log("删除文件回调");
      if (this.$refs.awaupload.uploadFiles.length == 0) {
        this.awauploadbool = true;
      } else {
        this.awauploadbool = false;
      }
      this.$refs.awaupload.clearFiles();
    },
    awahandlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    awahandsuccess(result) {
      if (result) {
        this.awaDialogVisible = false;
        this.$message.success("添加成功");
      } else {
        this.$message.error("添加失败");
      }
    },
    awahandchange() {
      if (this.$refs.awaupload.uploadFiles.length == 0) {
        this.awauploadbool = true;
      } else {
        this.awauploadbool = false;
      }
    },
    awahandexceed() {
      this.$message.error("上传文件超出限制(1个)");
    },
    subbeforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      // const isPNG = file.type === "image/png"
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      } else {
      }
      return isJPG && isLt2M;
    },
    subhandleRemove(file) {
      console.log("删除文件回调");
      if (this.$refs.subupload.uploadFiles.length == 0) {
        this.subuploadbool = true;
      } else {
        this.subuploadbool = false;
      }
      this.$refs.subupload.clearFiles();
    },
    subhandlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    subhandsuccess(result) {
      if (result) {
        this.subDialogVisible = false;
        this.$message.success("添加成功");
      } else {
        this.$message.error("添加失败");
      }
    },
    subhandchange() {
      if (this.$refs.subupload.uploadFiles.length == 0) {
        this.subuploadbool = true;
      } else {
        this.subuploadbool = false;
      }
    },
    subhandexceed() {
      this.$message.error("上传文件超出限制(1个)");
    },
    //获取部门下的班级名称列表

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
    // 加分
    async awaDialoghand(row) {
      console.log(row, 1111111111111);
      const {
        _id,
        name,
        sex,
        idcardnumber,
        depar_id,
        cls_id,
        // lecturer,
        // counsellor,
        dormnumber,
        bednumber,
        address,
        market,
      } = row;
      this.awaForm.name = name;
      this.awaForm.stu_id = _id;
      this.awaForm.bednumber = bednumber;
      this.awaForm.sex = sex;
      this.awaForm.idcardnumber = idcardnumber;
      if (depar_id) {
        this.awaForm.depar_id = depar_id._id;
        this.awaForm.depar = depar_id.name;
      } else {
        this.awaForm.depar_id = 1;
        this.awaForm.depar = "空空空";
      }
      if (cls_id) {
        this.awaForm.cls_id = cls_id._id;
        this.awaForm.cls = cls_id.name;
        if (cls_id.js_id) {
          this.awaForm.js_id = cls_id.js_id._id;
          this.awaForm.lecturer = cls_id.js_id.name;
        } else {
          this.awaForm.js_id = 1;
          this.awaForm.lecturer = "空空空";
        }
        if (cls_id.fdy_id) {
          this.awaForm.fdy_id = cls_id.fdy_id._id;
          this.awaForm.counsellor = cls_id.fdy_id.name;
        } else {
          this.awaForm.fdy_id = 1;
          this.awaForm.counsellor = "空空空";
        }
      } else {
        this.awaForm.cls_id = 1;
        this.awaForm.cls = "空空空";
      }

      this.awaForm.address = address;
      this.awaForm.market = market;
      this.awaForm.dormnumber = dormnumber;
      this.awaForm.state = true;
      this.awaDialogVisible = true;
    },
    awascore() {
      this.$refs.awaFormRef.validate(async (valid) => {
        if (!valid) return;

        this.awaForm.status = 0;
        if (this.$refs.awaupload.uploadFiles.length != 0) {
          console.log("有图片");
          this.$refs.awaupload.submit();
        } else {
          const res = await CreateMarksLists(this.awaForm);
          if (res.code == 200) {
            console.log("无图片添加成功");
          }
        }
      });
    },
    awaDialogClosed() {
      this.awaForm = {
        name: "",
        idcardnumber: "",
        depar: "",
        cls: "",
        lecturer: "",
        counsellor: "",
        dormnumber: "",
        address: "",
        market: "",
        state: null,
        content: "",
        Marks: null,
        depar_id: null,
        cls_id: null,
        js_id: null,
        fdy_id: null,
        // avatar: [],
        // data: null,
        // create_data:'',
        // update_data:'',
      };
      this.state = "";
      this.$refs.awaFormRef.resetFields();
    },
    // 扣分
    async subDialoghand(row) {
      const {
        _id,
        name,
        sex,
        idcardnumber,
        depar_id,
        cls_id,
        // lecturer,
        // counsellor,
        dormnumber,
        bednumber,
        address,
        market,
      } = row;
      this.subForm.stu_id = _id;
      this.subForm.name = name;
      this.subForm.bednumber = bednumber;
      this.subForm.sex = sex;
      this.subForm.idcardnumber = idcardnumber;
      if (depar_id) {
        this.subForm.depar_id = depar_id._id;
        this.subForm.depar = depar_id.name;
      } else {
        this.subForm.depar_id = 1;
        this.subForm.depar = "空空空";
      }
      if (cls_id) {
        this.subForm.cls_id = cls_id._id;
        this.subForm.cls = cls_id.name;
        if (cls_id.js_id) {
          this.subForm.js_id = cls_id.js_id._id;
          this.subForm.lecturer = cls_id.js_id.name;
        } else {
          this.subForm.js_id = 1;
          this.subForm.lecturer = "空空空";
        }
        if (cls_id.fdy_id) {
          this.subForm.fdy_id = cls_id.fdy_id._id;
          this.subForm.counsellor = cls_id.fdy_id.name;
        } else {
          this.subForm.fdy_id = 1;
          this.subForm.counsellor = "空空空";
        }
      } else {
        this.subForm.cls_id = 1;
        this.subForm.cls = "空空空";
      }
      this.subForm.address = address;
      this.subForm.market = market;
      this.subForm.dormnumber = dormnumber;
      this.subForm.state = false;
      this.subDialogVisible = true;
    },
    subscore() {
      this.$refs.subFormRef.validate(async (valid) => {
        if (!valid) return;
        this.subForm.course = this.subForm.anp + this.subForm.kejie;
        this.subForm.status = 0;
        if (this.$refs.subupload.uploadFiles.length != 0) {
          console.log("有图片");
          this.$refs.subupload.submit();
        } else {
          const res = await CreateMarksLists(this.subForm);
          if (res.code == 200) {
            console.log("无图片添加成功");
          }
        }
      });
    },
    subDialogClosed() {
      (this.subForm = {
        name: "",
        idcardnumber: "",
        depar: "",
        cls: "",
        lecturer: "",
        counsellor: "",
        dormnumber: "",
        address: "",
        market: "",
        state: null,
        disciplinetype: "",
        content: "",
        Marks: null,
        // avatar: [],
        // data: null,
        anp: "",
        kejie: "",
        course: "",
        // create_data:'',
        // update_data:'',
      }),
        this.$refs.subFormRef.resetFields();
    },
    // 记录
    async hisDialoghand(row) {
      var moment = require("moment");
      const res = await GetScorelistOne(row._id);
      this.allhisscorelist = [];
      this.awaactivities = [];
      this.subactivities = [];
      if (res.code == 200) {
        this.allhisscorelist = res.data;
        this.$message.success("获取单个学生信息成功");
        this.hisDialogVisible = true;
        res.data.forEach((item) => {
          if (item.state && item.status == 1) {
            let date = moment(item.data);
            const obj = {};
            obj.content = item.content + "加" + item.Marks + "分";
            obj.timestamp = date.format("YYYY-MM-DD");
            obj.size = "large";
            obj.type = "success";
            obj.icon = "el-icon-more";
            this.awaactivities.push(obj);
          } else if (!item.state && item.status == 1) {
            let date = moment(item.data);
            const obj = {};
            obj.content = item.content + "扣" + item.Marks + "分";
            obj.timestamp = date.format("YYYY-MM-DD") + item.course;
            obj.size = "large";
            obj.type = "primary";
            obj.icon = "el-icon-more";
            this.subactivities.push(obj);
          }
        });
      } else {
        this.$message.error("获取单个学生信息失败");
      }
    },
    hisDialogClosed() {
      this.allhisscorelist = [];
      this.awaactivities = [];
      this.subactivities = [];
      // this.$refs.hisFormRef.resetFields();
    },

    awaquerySearchAsync(queryString, cb) {
      let AwardedMarkslist = this.AwardedMarkslist;
      let results = queryString
        ? AwardedMarkslist.filter(this.awacreateStateFilter(queryString))
        : AwardedMarkslist;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 100 * Math.random());
    },
    awacreateStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    awahandleSelect(item) {
      this.awaForm.content = item.value;
      this.awaForm.Marks = item.Marks;
    },

    subquerySearchAsync(queryString, cb) {
      let SubtractMarkslist = this.SubtractMarkslist;
      let results = queryString
        ? SubtractMarkslist.filter(this.subcreateStateFilter(queryString))
        : SubtractMarkslist;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 100 * Math.random());
    },
    subcreateStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    subhandleSelect(item) {
      if (item.value == "请先选择违纪类型" || item.value == "该违纪类型暂无") {
        console.log("1");
      } else {
        this.subForm.content = item.value;
        this.subForm.Marks = item.Marks;
      }
    },

    async getStudents(
      $event,
      page = this.queryInfo.page,
      page_size = this.queryInfo.pagesize
    ) {
      console.log(111, this.queryInfo.query);
      const result = await getStudents({
        search: this.queryInfo.query,
        page,
        page_size,
      });
      if (result.code == 200) {
        console.log(result.data, 1234123);
        this.$message.success("获取用户列表成功！");
        this.studentlist = result.data; //列表中展示的数据内容
        this.total = result.count; //数据总条数
      } else {
        return this.$message.error("获取用户列表失败！");
      }
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
    //获取所有加分项
    async GetAwardedMarksall() {
      const res = await GetAwardedMarksall();
      if (res.code == 200) {
        res.data.forEach((item) => {
          const obj = {};
          obj.value = item.content;
          obj._id = item._id;
          obj.Marks = item.Marks;
          this.AwardedMarkslist.push(obj);
        });
        this.$message.success("获取加分项数据成功");
      }
    },
    //获取所有扣分项
    async GetSubtractMarksall() {
      const res = await GetSubtractMarksall();
      if (res.code == 200) {
        this.SubtractMarkslistall = res.data;
        this.$message.success("获取扣分项数据成功");
      }
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
  },
};
</script>

<style lang="less" scoped>
.awaupload {
  display: inline-block;
  position: relative;
  bottom: 150px;
}
.awaupload2 {
  display: inline-block;
  position: relative;
  left: 150px;
}
.subupload {
  display: inline-block;
  position: relative;
  bottom: 150px;
}
.subupload2 {
  display: inline-block;
  position: relative;
  left: 80px;
}

.imag {
  width: 100%;
  display: inline-block;
}
.imag img {
  width: 1000px;
  margin: 0 auto;
}
.awa-form,
.aub-form {
  margin-top: 50px;
}
</style>
