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
          <wd-form-item title="题型" title-width="180rpx" center prop="questionType">
            <wd-radio-group v-model="formData.questionType" type="button">
              <wd-radio :value="1">单选</wd-radio>
              <wd-radio :value="2">多选</wd-radio>
              <wd-radio :value="3">判断</wd-radio>
              <wd-radio :value="4">填空</wd-radio>
              <wd-radio :value="5">简答</wd-radio>
            </wd-radio-group>
          </wd-form-item>
          <wd-form-item title="难度" title-width="180rpx" center prop="difficulty">
            <wd-radio-group v-model="formData.difficulty" type="button">
              <wd-radio :value="1">简单</wd-radio>
              <wd-radio :value="2">中等</wd-radio>
              <wd-radio :value="3">困难</wd-radio>
            </wd-radio-group>
          </wd-form-item>
          <wd-form-item title="学科" title-width="180rpx" prop="subject">
            <wd-input v-model="formData.subject" clearable placeholder="请输入学科" />
          </wd-form-item>
          <wd-form-item title="年级" title-width="180rpx" prop="grade">
            <wd-input v-model="formData.grade" clearable placeholder="请输入年级" />
          </wd-form-item>
          <wd-form-item title="章节" title-width="180rpx">
            <wd-input v-model="formData.chapter" clearable placeholder="请输入章节" />
          </wd-form-item>
          <wd-form-item title="小节" title-width="180rpx">
            <wd-input v-model="formData.section" clearable placeholder="请输入小节" />
          </wd-form-item>
          <wd-form-item title="题干" title-width="180rpx" prop="stem">
            <wd-textarea v-model="formData.stem" placeholder="请输入题目题干" :maxlength="2000" show-word-limit clearable />
          </wd-form-item>
          <wd-form-item title="选项" title-width="180rpx">
            <wd-textarea v-model="formData.options" placeholder="请输入选项（JSON格式）" :maxlength="2000" show-word-limit clearable />
          </wd-form-item>
          <wd-form-item title="答案" title-width="180rpx" prop="answer">
            <wd-textarea v-model="formData.answer" placeholder="请输入正确答案" :maxlength="1000" show-word-limit clearable />
          </wd-form-item>
          <wd-form-item title="解析" title-width="180rpx">
            <wd-textarea v-model="formData.analysis" placeholder="请输入题目解析" :maxlength="2000" show-word-limit clearable />
          </wd-form-item>
          <wd-form-item title="标签" title-width="180rpx">
            <wd-input v-model="formData.tags" clearable placeholder="请输入标签（逗号分隔）" />
          </wd-form-item>
          <wd-form-item title="知识点ID" title-width="180rpx">
            <wd-input v-model="formData.knowledgePointId" type="number" clearable placeholder="关联知识点ID" />
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
import type { QuestionBank } from '@/api/learn'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import { computed, onMounted, ref } from 'vue'
import { createQuestionBank, getQuestionBank, updateQuestionBank } from '@/api/learn/question-bank'
import { navigateBackPlus } from '@/utils'
import { createFormSchema } from '@/utils/wot'

const props = defineProps<{ id?: number | any }>()

definePage({
  style: { navigationBarTitleText: '', navigationStyle: 'custom' },
})

const toast = useToast()
const getTitle = computed(() => props.id ? '编辑题目' : '新增题目')
const formLoading = ref(false)
const formData = ref<QuestionBank>({
  id: undefined,
  questionType: 1,
  difficulty: 2,
  subject: '',
  grade: '',
  chapter: '',
  section: '',
  stem: '',
  options: '',
  answer: '',
  analysis: '',
  tags: '',
  status: 0,
  knowledgePointId: undefined,
})
const formSchema = createFormSchema({
  questionType: [{ required: true, message: '题型不能为空' }],
  difficulty: [{ required: true, message: '难度不能为空' }],
  subject: [{ required: true, message: '学科不能为空' }],
  grade: [{ required: true, message: '年级不能为空' }],
  stem: [{ required: true, message: '题干不能为空' }],
  answer: [{ required: true, message: '答案不能为空' }],
})
const formRef = ref<FormInstance>()

function handleBack() { navigateBackPlus('/pages-learn/question-bank/index') }

async function getDetail() {
  if (!props.id) return
  formData.value = await getQuestionBank(Number(props.id))
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
    if (props.id) {
      await updateQuestionBank(formData.value)
      toast.success('修改成功')
    } else {
      await createQuestionBank(formData.value)
      toast.success('新增成功')
    }
    setTimeout(() => handleBack(), 500)
  } finally { formLoading.value = false }
}

onMounted(() => { getDetail() })
</script>
