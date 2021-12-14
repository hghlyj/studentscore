<template>
  <div class="studentedit">
    <el-tabs
      v-model="activeName"
      style="width: 95%; margin: 0 auto"
      @tab-click="handleClick"
    >
      <el-tab-pane label="加分处理" name="AwardedMarks">
        <el-tabs v-model="awaactiveName" @tab-click="awahandleClick">
          <el-tab-pane label="待审核" name="status0"
            ><awaStatus0></awaStatus0
          ></el-tab-pane>
          <el-tab-pane label="通过" name="status1"
            ><awaStatus1></awaStatus1
          ></el-tab-pane>
          <el-tab-pane label="督察再审" name="status2"
            ><awaStatus2></awaStatus2
          ></el-tab-pane>
          <el-tab-pane label="废弃" name="status3"
            ><awaStatus3></awaStatus3
          ></el-tab-pane>
          <el-tab-pane label="申诉无效" name="status4"
            ><awaStatus4></awaStatus4
          ></el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="减分反馈" name="SubtractMarks">
        <el-tabs v-model="subactiveName" @tab-click="subhandleClick">
          <!-- <el-tab-pane label="待审核" name="status0"
            ><subStatus0></subStatus0
          ></el-tab-pane>
          <el-tab-pane label="通过" name="status1"
            ><subStatus1></subStatus1
          ></el-tab-pane> -->
          <el-tab-pane label="申诉" name="status2"
            ><subStatus2></subStatus2
          ></el-tab-pane>
          <!-- <el-tab-pane label="废弃" name="status3"
            ><subStatus3></subStatus3
          ></el-tab-pane>
          <el-tab-pane label="申诉无效" name="status4"
            ><subStatus4></subStatus4
          ></el-tab-pane> -->
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import subStatus0 from "./subtab/subStatus0";
import subStatus1 from "./subtab/subStatus1";
import subStatus2 from "./subtab/subStatus2";
import subStatus3 from "./subtab/subStatus3";
import subStatus4 from "./subtab/subStatus4";
import awaStatus0 from "./awatab/awaStatus0";
import awaStatus1 from "./awatab/awaStatus1";
import awaStatus2 from "./awatab/awaStatus2";
import awaStatus3 from "./awatab/awaStatus3";
import awaStatus4 from "./awatab/awaStatus4";
import {mapGetters} from 'vuex'
export default {
  props: {},
  computed: {
    ...mapGetters(["rdedMarksLists"]),
    total() {
      return this.rdedMarksLists.length;
    },
  },
  components: {
    subStatus0,
    subStatus1,
    subStatus2,
    subStatus3,
    subStatus4,
    awaStatus0,
    awaStatus1,
    awaStatus2,
    awaStatus3,
    awaStatus4,
  },
  data() {
    return {
      activeName: "SubtractMarks",
      subactiveName: "status2",
      awaactiveName: "status0",
      tratqueryInfo: {
        query: {
          state: null,
          name: "",
          depar: "",
          cls: "",
          lecturer: "",
          counsellor: "",
          market: "",
          status: null,
        },
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        page_size: 5,
      },
    };
  },
  async created() {
    if (this.activeName == "AwardedMarks") {
      this.tratqueryInfo.query.state = 1;
    } else if (this.activeName == "SubtractMarks") {
      this.tratqueryInfo.query.state = 0;
    }

    this.tratqueryInfo.query.status = 0;
    await this.$store.dispatch(
      "scorelist/GettratMarksLists",
      this.tratqueryInfo
    );
  },
  filters: {},
  methods: {
     async handleClick(tab, event) {
      if (this.activeName == "AwardedMarks") {
        this.tratqueryInfo.query.state = 1;
        this.tratqueryInfo.query.status = 0;
        await this.$store.dispatch(
          "scorelist/GettratMarksLists",
          this.tratqueryInfo 
        );
      } else if (this.activeName == "SubtractMarks") {
        this.tratqueryInfo.query.state = 0;
        this.tratqueryInfo.query.status = 0;
        await this.$store.dispatch(
          "scorelist/GettratMarksLists",
          this.tratqueryInfo
        );
      }
    },
    async awahandleClick(tab, event) {
      console.log(123456)
      if (this.awaactiveName == "status0") {
        this.tratqueryInfo.query.status = 0;
      } else if (this.awaactiveName == "status1") {
        this.tratqueryInfo.query.status = 1;
      } else if (this.awaactiveName == "status2") {
        this.tratqueryInfo.query.status = 2;
      } else if (this.awaactiveName == "status3") {
        this.tratqueryInfo.query.status = 3;
      } else if (this.awaactiveName == "status4") {
        this.tratqueryInfo.query.status = 4;
      }
      await this.$store.dispatch(
        "scorelist/GettratMarksLists",
        this.tratqueryInfo
      );
    },
    async subhandleClick(tab, event) {
      if (this.subactiveName == "status0") {
        this.tratqueryInfo.query.status = 0;
      } else if (this.subactiveName == "status1") {
        console.log(123456);
        this.tratqueryInfo.query.status = 1;
      } else if (this.subactiveName == "status2") {
        console.log(222222222222222222)
        this.tratqueryInfo.query.status = 2;
      } else if (this.subactiveName == "status3") {
        this.tratqueryInfo.query.status = 3;
      } else if (this.subactiveName == "status4") {
        this.tratqueryInfo.query.status = 4;
      }
      await this.$store.dispatch(
        "scorelist/GettratMarksLists",
        this.tratqueryInfo
      );
    },

    async handleSizeChange(newSize) {
      this.tratqueryInfo.page_size = newSize;
      await this.$store.dispatch(
        "scorelist/GettratMarksLists",
        this.tratqueryInfo
      );
    },

    async handleCurrentChange(newPage) {
      this.tratqueryInfo.page = newPage;
      await this.$store.dispatch(
        "scorelist/GettratMarksLists",
        this.tratqueryInfo
      );
    },
  },
};
</script>

<style scoped lang="less"></style>
