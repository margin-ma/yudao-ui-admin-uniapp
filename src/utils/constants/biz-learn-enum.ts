// ========== LEARN 模块业务枚举 ==========

// 知识点状态枚举
export const KnowledgeStatusEnum = {
  ENABLE: 0,
  DISABLE: 1,
}

// 题目状态枚举
export const QuestionStatusEnum = {
  DRAFT: 0,
  PUBLISHED: 1,
}

// 题目类型枚举
export const QuestionTypeEnum = {
  SINGLE_CHOICE: 1,
  MULTIPLE_CHOICE: 2,
  JUDGE: 3,
  FILL_BLANK: 4,
  SHORT_ANSWER: 5,
}

// 难度等级枚举
export const DifficultyLevelEnum = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
}

// 报告类型枚举
export const ReportTypeEnum = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
}

// 报告状态枚举
export const ReportStatusEnum = {
  DRAFT: 0,
  PUBLISHED: 1,
}

// 作业批改状态枚举
export const CorrectionStatusEnum = {
  PENDING: 0,
  PROCESSING: 1,
  COMPLETED: 2,
  FAILED: 3,
}

// 咨询状态枚举
export const ConsultStatusEnum = {
  PENDING: 0,
  ANSWERED: 1,
}

// 问答状态枚举
export const QaStatusEnum = {
  PENDING: 0,
  ANSWERED: 1,
}

// 学习任务状态枚举
export const TaskStatusEnum = {
  PENDING: 0,
  COMPLETED: 1,
}

// 会员订单状态枚举
export const OrderStatusEnum = {
  UNPAID: 0,
  PAID: 1,
  EXPIRED: 2,
}

// 内容类型枚举
export const ContentTypeEnum = {
  MOMENTS_COPY: 'moments_copy',
  PROMO_MATERIAL: 'promo_material',
  SOP_GENERATE: 'sop_generate',
  OPERATION_CONTENT: 'operation_content',
  CONTENT_CREATE: 'content_create',
}

// 内容状态枚举
export const ContentStatusEnum = {
  DRAFT: 0,
  PUBLISHED: 1,
}

// 消息推送状态枚举
export const MessagePushStatusEnum = {
  UNPUSHED: 0,
  PUSHED: 1,
}

// 掌握程度等级
export const MasteryLevelEnum = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
}

// 学习计划状态
export const StudyPlanStatusEnum = {
  INACTIVE: 0,
  ACTIVE: 1,
}
