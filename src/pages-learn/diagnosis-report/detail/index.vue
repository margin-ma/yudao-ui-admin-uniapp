<template>
  <view class="yd-page-container">
    <wd-navbar
      title="学情报告详情"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />
    <view>
      <wd-cell-group border>
        <wd-cell title="学生ID" :value="String(formData?.studentId ?? '-')" />
        <wd-cell title="报告类型">
          <wd-tag :type="formData?.reportType === 'weekly' ? 'primary' : 'warning'" size="small">
            {{ formData?.reportType === 'weekly' ? '周报' : '月报' }}
          </wd-tag>
        </wd-cell>
        <wd-cell title="报告日期" :value="formData?.reportDate || '-'" />
        <wd-cell title="状态">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="formData?.status" />
        </wd-cell>
        <wd-cell title="推送状态">
          <text>{{ formData?.pushStatus ? '已推送' : '未推送' }}</text>
        </wd-cell>
        <wd-cell v-if="formData?.pushTime" title="推送时间" :value="formatDateTime(formData.pushTime)" />
        <wd-cell title="报告内容">
          <view class="whitespace-pre-wrap text-26rpx text-[#333]">{{ formData?.reportContent || '-' }}</view>
        </wd-cell>
        <wd-cell title="创建时间" :value="formatDateTime(formData?.createTime) || '-'" />
      </wd-cell-group>
    </view>
    <view class="yd-detail-footer">
      <view class="yd-detail-footer-actions">
        <wd-button
          v-if="hasAccessByCodes(['learn:report:update'])"
          class="flex-1" type="warning" @click="handleEdit"
        >编辑</wd-button>
        <wd-button
          v-if="formData?.status === 0 && hasAccessByCodes(['learn:report:publish'])"
          class="flex-1" type="primary" @click="handlePublish"
        >发布</wd-button>
        <wd-button
          v-if="hasAccessByCodes(['learn:report:delete'])"
          class="flex-1" type="danger" :loading="deleting" @click="handleDelete"
        >删除</wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { DiagnosisReport } from '@/api/learn'
import { useDialog } from '@wot-ui/ui/components/wd-dialog'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import { onMounted, ref } from 'vue'
import { deleteDiagnosisReport, getDiagnosisReport, publishDiagnosisReport } from '@/api/learn/diagnosis-report'
import { useAccess } from '@/hooks/useAccess'
import { navigateBackPlus } from '@/utils'
import { DICT_TYPE } from '@/utils/constants'
import { formatDateTime } from '@/utils/date'

const props = defineProps<{ id?: number | any }>()

definePage({
  style: { navigationBarTitleText: '', navigationStyle: 'custom' },
})

const { hasAccessByCodes } = useAccess()
const toast = useToast()
const dialog = useDialog()
const formData = ref<DiagnosisReport>()
const deleting = ref(false)

function handleBack() { navigateBackPlus('/pages-learn/diagnosis-report/index') }

async function getDetail() {
  if (!props.id) return
  try {
    toast.loading('加载中...')
    formData.value = await getDiagnosisReport(props.id)
  } finally { toast.close() }
}

function handleEdit() { uni.navigateTo({ url: `/pages-learn/diagnosis-report/form/index?id=${props.id}` }) }

async function handlePublish() {
  try { await dialog.confirm({ title: '提示', msg: '确定要发布该报告吗？发布后学生将看到报告内容。' }) } catch { return }
  await publishDiagnosisReport(Number(props.id))
  toast.success('发布成功')
  await getDetail()
}

async function handleDelete() {
  if (!props.id) return
  try { await dialog.confirm({ title: '提示', msg: '确定要删除该学情报告吗？' }) } catch { return }
  deleting.value = true
  try {
    await deleteDiagnosisReport(Number(props.id))
    toast.success('删除成功')
    setTimeout(() => handleBack(), 500)
  } finally { deleting.value = false }
}

onMounted(() => { getDetail() })
</script>
