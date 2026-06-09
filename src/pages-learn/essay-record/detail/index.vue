<template>
  <view class="yd-page-container">
    <wd-navbar
      title="作文批改详情"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />
    <view>
      <wd-cell-group border>
        <wd-cell title="学生ID" :value="String(formData?.studentId ?? '-')" />
        <wd-cell title="总评分">
          <text class="text-36rpx font-bold text-[#1890ff]">{{ formData?.totalScore ?? '-' }}</text>
        </wd-cell>
        <wd-cell title="写作内容">
          <view class="whitespace-pre-wrap text-26rpx text-[#333]">{{ formData?.essayContent || '-' }}</view>
        </wd-cell>
        <wd-cell v-if="formData?.dimensionScores" title="维度评分">
          <view class="text-26rpx text-[#666]">{{ formData.dimensionScores }}</view>
        </wd-cell>
        <wd-cell v-if="formData?.corrections" title="批改详情">
          <view class="text-26rpx text-[#f5222d]">{{ formData.corrections }}</view>
        </wd-cell>
        <wd-cell v-if="formData?.suggestions" title="改进建议">
          <view class="text-26rpx text-[#52c41a]">{{ formData.suggestions }}</view>
        </wd-cell>
        <wd-cell v-if="formData?.rewrittenVersion" title="改写范文">
          <view class="text-26rpx text-[#333]">{{ formData.rewrittenVersion }}</view>
        </wd-cell>
        <wd-cell title="创建时间" :value="formatDateTime(formData?.createTime) || '-'" />
      </wd-cell-group>
    </view>
    <view class="yd-detail-footer">
      <view class="yd-detail-footer-actions">
        <wd-button
          v-if="hasAccessByCodes(['learn:essay:delete'])"
          class="flex-1" type="danger" :loading="deleting" @click="handleDelete"
        >删除</wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { EssayRecord } from '@/api/learn'
import { useDialog } from '@wot-ui/ui/components/wd-dialog'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import { onMounted, ref } from 'vue'
import { deleteEssayRecord, getEssayRecord } from '@/api/learn/essay-record'
import { useAccess } from '@/hooks/useAccess'
import { navigateBackPlus } from '@/utils'
import { formatDateTime } from '@/utils/date'

const props = defineProps<{ id?: number | any }>()

definePage({
  style: { navigationBarTitleText: '', navigationStyle: 'custom' },
})

const { hasAccessByCodes } = useAccess()
const toast = useToast()
const dialog = useDialog()
const formData = ref<EssayRecord>()
const deleting = ref(false)

function handleBack() { navigateBackPlus('/pages-learn/essay-record/index') }

async function getDetail() {
  if (!props.id) return
  try {
    toast.loading('加载中...')
    formData.value = await getEssayRecord(props.id)
  } finally { toast.close() }
}

async function handleDelete() {
  if (!props.id) return
  try { await dialog.confirm({ title: '提示', msg: '确定要删除该作文记录吗？' }) } catch { return }
  deleting.value = true
  try {
    await deleteEssayRecord(Number(props.id))
    toast.success('删除成功')
    setTimeout(() => handleBack(), 500)
  } finally { deleting.value = false }
}

onMounted(() => { getDetail() })
</script>
