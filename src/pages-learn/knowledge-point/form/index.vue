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
          <wd-form-item title="知识点名称" title-width="180rpx" prop="name">
            <wd-input v-model="formData.name" clearable placeholder="请输入知识点名称" />
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
          <wd-form-item title="权重" title-width="180rpx">
            <wd-input v-model="formData.weight" type="number" clearable placeholder="请输入权重" />
          </wd-form-item>
          <wd-form-item title="状态" title-width="180rpx" center prop="status">
            <wd-switch
              v-model="formData.status"
              :active-value="0"
              :inactive-value="1"
            />
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
import type { KnowledgePoint } from '@/api/learn'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import { computed, onMounted, ref } from 'vue'
import { createKnowledgePoint, getKnowledgePoint, updateKnowledgePoint } from '@/api/learn/knowledge-point'
import { navigateBackPlus } from '@/utils'
import { createFormSchema } from '@/utils/wot'

const props = defineProps<{ id?: number | any }>()

definePage({
  style: { navigationBarTitleText: '', navigationStyle: 'custom' },
})

const toast = useToast()
const getTitle = computed(() => props.id ? '编辑知识点' : '新增知识点')
const formLoading = ref(false)
const formData = ref<KnowledgePoint>({
  id: undefined,
  name: '',
  subject: '',
  grade: '',
  chapter: '',
  section: '',
  weight: undefined,
  localFrequency: undefined,
  status: 0,
})
const formSchema = createFormSchema({
  name: [{ required: true, message: '知识点名称不能为空' }],
  subject: [{ required: true, message: '学科不能为空' }],
  grade: [{ required: true, message: '年级不能为空' }],
  status: [{ required: true, message: '状态不能为空' }],
})
const formRef = ref<FormInstance>()

function handleBack() { navigateBackPlus('/pages-learn/knowledge-point/index') }

async function getDetail() {
  if (!props.id) return
  formData.value = await getKnowledgePoint(Number(props.id))
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
    if (props.id) {
      await updateKnowledgePoint(formData.value)
      toast.success('修改成功')
    } else {
      await createKnowledgePoint(formData.value)
      toast.success('新增成功')
    }
    setTimeout(() => handleBack(), 500)
  } finally { formLoading.value = false }
}

onMounted(() => { getDetail() })
</script>
