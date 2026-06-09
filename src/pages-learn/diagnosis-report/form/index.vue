<template>
  <view class="yd-page-container">
    <wd-navbar
      :title="getTitle"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />
    <view>
      <wd-form ref="formRef" :model="formData" :schema="formSchema">
        <wd-cell-group border>
          <wd-form-item title="学生ID" title-width="180rpx" prop="studentId">
            <wd-input v-model="formData.studentId" type="number" clearable placeholder="请输入学生ID" />
          </wd-form-item>
          <wd-form-item title="报告类型" title-width="180rpx" center prop="reportType">
            <wd-radio-group v-model="formData.reportType" type="button">
              <wd-radio value="weekly">周报</wd-radio>
              <wd-radio value="monthly">月报</wd-radio>
            </wd-radio-group>
          </wd-form-item>
          <wd-form-item title="报告日期" title-width="180rpx" prop="reportDate">
            <wd-input v-model="formData.reportDate" clearable placeholder="请输入报告日期(YYYY-MM-DD)" />
          </wd-form-item>
          <wd-form-item title="报告内容" title-width="180rpx">
            <wd-textarea v-model="formData.reportContent" placeholder="请输入报告内容" :maxlength="10000" show-word-limit clearable />
          </wd-form-item>
        </wd-cell-group>
      </wd-form>
    </view>
    <view class="yd-detail-footer">
      <wd-button type="primary" block :loading="formLoading" @click="handleSubmit">保存</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'
import type { DiagnosisReport } from '@/api/learn'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import { computed, onMounted, ref } from 'vue'
import { createDiagnosisReport, getDiagnosisReport, updateDiagnosisReport } from '@/api/learn/diagnosis-report'
import { navigateBackPlus } from '@/utils'
import { createFormSchema } from '@/utils/wot'

const props = defineProps<{ id?: number | any }>()

definePage({
  style: { navigationBarTitleText: '', navigationStyle: 'custom' },
})

const toast = useToast()
const getTitle = computed(() => props.id ? '编辑学情报告' : '新增学情报告')
const formLoading = ref(false)
const formData = ref<DiagnosisReport>({
  id: undefined,
  studentId: undefined,
  reportType: 'weekly',
  reportDate: '',
  reportContent: '',
  status: 0,
})
const formSchema = createFormSchema({
  studentId: [{ required: true, message: '学生ID不能为空' }],
  reportType: [{ required: true, message: '报告类型不能为空' }],
  reportDate: [{ required: true, message: '报告日期不能为空' }],
})
const formRef = ref<FormInstance>()

function handleBack() { navigateBackPlus('/pages-learn/diagnosis-report/index') }

async function getDetail() {
  if (!props.id) return
  formData.value = await getDiagnosisReport(Number(props.id))
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
    if (props.id) {
      await updateDiagnosisReport(formData.value)
      toast.success('修改成功')
    } else {
      await createDiagnosisReport(formData.value)
      toast.success('新增成功')
    }
    setTimeout(() => handleBack(), 500)
  } finally { formLoading.value = false }
}

onMounted(() => { getDetail() })
</script>
