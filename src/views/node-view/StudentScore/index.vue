<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="加分管理" name="AwardedMarks">
              <AwardedMarks />
            </el-tab-pane>
            <el-tab-pane label="扣分管理" name="SubtractMarks">
              <SubtractMarks />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AwardedMarks from "./components/AwardedMarks";
import SubtractMarks from "./components/SubtractMarks";

export default {
  name: "Profile",
  components: { AwardedMarks,SubtractMarks},
  data() {
    return {
      activeTab: "SubtractMarks",
    };
  },
  computed: {},
  created() {},
  methods: {},
};
</script>
