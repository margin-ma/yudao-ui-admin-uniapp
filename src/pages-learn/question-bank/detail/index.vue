<template>
  <view class="yd-page-container">
    <wd-navbar
      title="题目详情"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />
    <view>
      <wd-cell-group border>
        <wd-cell title="题型">
          <wd-tag :type="questionTypeTagType(formData?.questionType)" size="small">
            {{ questionTypeLabel(formData?.questionType) }}
          </wd-tag>
        </wd-cell>
        <wd-cell title="难度">
          <wd-tag :type="difficultyTagType(formData?.difficulty)" size="small">
            {{ difficultyLabel(formData?.difficulty) }}
          </wd-tag>
        </wd-cell>
        <wd-cell title="状态">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="formData?.status" />
        </wd-cell>
        <wd-cell title="学科" :value="formData?.subject || '-'" />
        <wd-cell title="年级" :value="formData?.grade || '-'" />
        <wd-cell title="章节" :value="formData?.chapter ? `${formData.chapter} / ${formData.section}` : '-'" />
        <wd-cell title="题干">
          <view class="text-28rpx text-[#333]">{{ formData?.stem }}</view>
        </wd-cell>
        <wd-cell v-if="formData?.options" title="选项">
          <view class="text-26rpx whitespace-pre-wrap text-[#666]">{{ formData.options }}</view>
        </wd-cell>
        <wd-cell title="答案">
          <view class="text-28rpx font-semibold text-[#52c41a]">{{ formData?.answer }}</view>
        </wd-cell>
        <wd-cell v-if="formData?.analysis" title="解析">
          <view class="text-26rpx text-[#999]">{{ formData.analysis }}</view>
        </wd-cell>
        <wd-cell title="标签" :value="formData?.tags || '-'" />
        <wd-cell title="错误率">
          <text>{{ formData?.errorRate != null ? `${(formData.errorRate * 100).toFixed(1)}%` : '-' }}</text>
        </wd-cell>
        <wd-cell title="创建时间" :value="formatDateTime(formData?.createTime) || '-'" />
      </wd-cell-group>
    </view>
    <view class="yd-detail-footer">
      <view class="yd-detail-footer-actions">
        <wd-button
          v-if="hasAccessByCodes(['learn:question:update'])"
          class="flex-1" type="warning" @click="handleEdit"
        >编辑</wd-button>
        <wd-button
          v-if="hasAccessByCodes(['learn:question:delete'])"
          class="flex-1" type="danger" :loading="deleting" @click="handleDelete"
        >删除</wd-button>
        <wd-button
          v-if="hasMoreActions"
          class="flex-1" type="info" @click="moreActionVisible = true"
        >更多</wd-button>
      </view>
    </view>
    <wd-action-sheet v-model="moreActionVisible" :actions="moreActions" @select="handleMoreAction" />
  </view>
</template>

<script lang="ts" setup>
import type { QuestionBank } from '@/api/learn'
import { useDialog } from '@wot-ui/ui/components/wd-dialog'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import { computed, onMounted, ref } from 'vue'
import { aiTagQuestion, aiVerifyAnswer, deleteQuestionBank, getQuestionBank } from '@/api/learn/question-bank'
import { useAccess } from '@/hooks/useAccess'
import { navigateBackPlus } from '@/utils'
import { DICT_TYPE } from '@/utils/constants'
import { DifficultyLevelEnum, QuestionTypeEnum } from '@/utils/constants/biz-learn-enum'
import { formatDateTime } from '@/utils/date'

const props = defineProps<{ id?: number | any }>()

definePage({
  style: { navigationBarTitleText: '', navigationStyle: 'custom' },
})

const { hasAccessByCodes } = useAccess()
const toast = useToast()
const dialog = useDialog()
const formData = ref<QuestionBank>()
const deleting = ref(false)
const moreActionVisible = ref(false)
const moreActions = computed(() => {
  const actions: { name: string; value: string }[] = []
  if (hasAccessByCodes(['learn:question:update'])) {
    actions.push({ name: 'AI自动标注', value: 'ai-tag' })
    if (formData.value?.status === 0) {
      actions.push({ name: '发布题目', value: 'publish' })
    }
    actions.push({ name: 'AI验证答案', value: 'ai-verify' })
  }
  return actions
})
const hasMoreActions = computed(() => moreActions.value.length > 0)

const questionTypeLabel = (t?: number) => {
  const map: Record<number, string> = { [QuestionTypeEnum.SINGLE_CHOICE]: '单选', [QuestionTypeEnum.MULTIPLE_CHOICE]: '多选', [QuestionTypeEnum.JUDGE]: '判断', [QuestionTypeEnum.FILL_BLANK]: '填空', [QuestionTypeEnum.SHORT_ANSWER]: '简答' }
  return map[t ?? -1] || '未知'
}
const questionTypeTagType = (t?: number) => {
  const map: Record<number, string> = { [QuestionTypeEnum.SINGLE_CHOICE]: 'primary', [QuestionTypeEnum.MULTIPLE_CHOICE]: 'info', [QuestionTypeEnum.JUDGE]: 'warning', [QuestionTypeEnum.FILL_BLANK]: 'success', [QuestionTypeEnum.SHORT_ANSWER]: 'danger' }
  return map[t ?? -1] || ''
}
const difficultyLabel = (d?: number) => {
  const map: Record<number, string> = { [DifficultyLevelEnum.EASY]: '简单', [DifficultyLevelEnum.MEDIUM]: '中等', [DifficultyLevelEnum.HARD]: '困难' }
  return map[d ?? -1] || '未知'
}
const difficultyTagType = (d?: number) => {
  const map: Record<number, string> = { [DifficultyLevelEnum.EASY]: 'success', [DifficultyLevelEnum.MEDIUM]: 'warning', [DifficultyLevelEnum.HARD]: 'danger' }
  return map[d ?? -1] || ''
}

function handleBack() { navigateBackPlus('/pages-learn/question-bank/index') }

async function getDetail() {
  if (!props.id) return
  try {
    toast.loading('加载中...')
    formData.value = await getQuestionBank(props.id)
  } finally { toast.close() }
}

function handleEdit() { uni.navigateTo({ url: `/pages-learn/question-bank/form/index?id=${props.id}` }) }

async function handleDelete() {
  if (!props.id) return
  try { await dialog.confirm({ title: '提示', msg: '确定要删除该题目吗？' }) } catch { return }
  deleting.value = true
  try {
    await deleteQuestionBank(Number(props.id))
    toast.success('删除成功')
    setTimeout(() => handleBack(), 500)
  } finally { deleting.value = false }
}

async function handleMoreAction({ item }: { item: { value: string } }) {
  if (item.value === 'ai-tag') {
    await aiTagQuestion(Number(props.id))
    toast.success('AI标注完成')
    await getDetail()
  } else if (item.value === 'publish') {
    const { batchPublishQuestion } = await import('@/api/learn/question-bank')
    await batchPublishQuestion([Number(props.id)])
    toast.success('发布成功')
    await getDetail()
  } else if (item.value === 'ai-verify') {
    const result = await aiVerifyAnswer(Number(props.id))
    toast.info(result.isCorrect ? '答案正确' : `答案疑似有误: ${result.suggestion || ''}`)
  }
}

onMounted(() => { getDetail() })
</script>
