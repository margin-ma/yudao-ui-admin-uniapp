<template>
  <view class="yd-page-container">
    <wd-navbar
      title="知识点详情"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />
    <view>
      <wd-cell-group border>
        <wd-cell title="知识点名称" :value="formData?.name || '-'" />
        <wd-cell title="学科" :value="formData?.subject || '-'" />
        <wd-cell title="年级" :value="formData?.grade || '-'" />
        <wd-cell title="章节" :value="formData?.chapter || '-'" />
        <wd-cell title="小节" :value="formData?.section || '-'" />
        <wd-cell title="权重" :value="formData?.weight != null ? String(formData.weight) : '-'" />
        <wd-cell title="本地考频">
          <text>{{ formData?.localFrequency ?? 0 }}次</text>
        </wd-cell>
        <wd-cell title="状态">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="formData?.status" />
        </wd-cell>
        <wd-cell title="创建时间" :value="formatDateTime(formData?.createTime) || '-'" />
      </wd-cell-group>
    </view>
    <view class="yd-detail-footer">
      <view class="yd-detail-footer-actions">
        <wd-button
          v-if="hasAccessByCodes(['learn:knowledge:update'])"
          class="flex-1" type="warning" @click="handleEdit"
        >编辑</wd-button>
        <wd-button
          v-if="hasAccessByCodes(['learn:knowledge:delete'])"
          class="flex-1" type="danger" :loading="deleting" @click="handleDelete"
        >删除</wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { KnowledgePoint } from '@/api/learn'
import { useDialog } from '@wot-ui/ui/components/wd-dialog'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import { onMounted, ref } from 'vue'
import { deleteKnowledgePoint, getKnowledgePoint } from '@/api/learn/knowledge-point'
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
const formData = ref<KnowledgePoint>()
const deleting = ref(false)

function handleBack() { navigateBackPlus('/pages-learn/knowledge-point/index') }

async function getDetail() {
  if (!props.id) return
  try {
    toast.loading('加载中...')
    formData.value = await getKnowledgePoint(props.id)
  } finally { toast.close() }
}

function handleEdit() {
  uni.navigateTo({ url: `/pages-learn/knowledge-point/form/index?id=${props.id}` })
}

async function handleDelete() {
  if (!props.id) return
  try { await dialog.confirm({ title: '提示', msg: '确定要删除该知识点吗？' }) } catch { return }
  deleting.value = true
  try {
    await deleteKnowledgePoint(Number(props.id))
    toast.success('删除成功')
    setTimeout(() => handleBack(), 500)
  } finally { deleting.value = false }
}

onMounted(() => { getDetail() })
</script>
