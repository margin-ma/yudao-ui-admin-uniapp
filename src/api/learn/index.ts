import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'

// ==================== 通用类型 ====================

/** 知识点 */
export interface KnowledgePoint {
  id?: number
  name: string
  subject: string
  grade: string
  chapter?: string
  section?: string
  weight?: number
  localFrequency?: number
  status: number
  createTime?: string
}

/** 题库 */
export interface QuestionBank {
  id?: number
  province?: string
  city?: string
  district?: string
  school?: string
  textbookVersion?: string
  grade?: string
  subject?: string
  chapter?: string
  section?: string
  questionType: number
  difficulty: number
  stem: string
  options?: string
  answer: string
  analysis?: string
  sourceType?: string
  tags?: string
  status: number
  errorRate?: number
  knowledgePointId?: number
  createTime?: string
}

/** 学情报告 */
export interface DiagnosisReport {
  id?: number
  studentId: number
  reportType: string
  reportDate: string
  reportContent?: string
  status: number
  pushStatus?: number
  pushTime?: string
  createTime?: string
}

/** 作文批改记录 */
export interface EssayRecord {
  id?: number
  studentId: number
  essayContent: string
  totalScore?: number
  dimensionScores?: string
  corrections?: string
  suggestions?: string
  rewrittenVersion?: string
  status?: number
  createTime?: string
}

/** 作业上传记录 */
export interface HomeworkUpload {
  id?: number
  studentId: number
  fileId?: number
  fileUrl?: string
  fileName?: string
  fileSize?: number
  ocrRecordId?: number
  status: number
  totalCount?: number
  correctCount?: number
  errorMsg?: string
  createTime?: string
}

/** 内容生成记录 */
export interface ContentRecord {
  id?: number
  studentId?: number
  staffId?: number
  contentType: string
  title?: string
  content?: string
  sourceMaterial: string
  status?: number
  createTime?: string
}

/** 家长咨询记录 */
export interface ParentConsultRecord {
  id?: number
  studentId: number
  parentName?: string
  parentPhone?: string
  question: string
  answer?: string
  subject?: string
  grade?: string
  status?: number
  createTime?: string
}

/** 问答记录 */
export interface QaRecord {
  id?: number
  studentId: number
  questionText: string
  questionImage?: string
  referenceQuestionId?: number
  referenceQuestionStem?: string
  answerText?: string
  subject?: string
  grade?: string
  status?: number
  createTime?: string
}

/** 学习任务 */
export interface LearningTask {
  id?: number
  studentId: number
  planId?: number
  taskDate: string
  status: number
  questionIds?: string
  knowledgePoints?: string
  completedTime?: string
  createTime?: string
}

/** 学习计划 */
export interface StudyPlan {
  id?: number
  studentId: number
  planContent?: string
  isActive: number
  createTime?: string
}

/** 会员订单 */
export interface MemberOrder {
  id?: number
  studentId: number
  planType?: string
  amount: number
  status: number
  startTime?: string
  endTime?: string
  channel?: string
  createTime?: string
}

/** OCR记录 */
export interface OcrRecord {
  id?: number
  studentId: number
  imageUrl: string
  recognizedContent?: string
  status?: number
  reviewStatus?: number
  createTime?: string
}

/** 消息记录 */
export interface MessageRecord {
  id?: number
  studentId: number
  messageType: string
  title: string
  content: string
  pushStatus: number
  pushTime?: string
  createTime?: string
}

/** 学生知识点统计 */
export interface StudentKnowledgeStats {
  id?: number
  studentId: number
  knowledgePointId: number
  totalCount: number
  correctCount: number
  errorCount: number
  masteryLevel: number
  createTime?: string
}

/** 学生答题记录 */
export interface StudentQuestionRecord {
  id?: number
  studentId: number
  questionId: number
  taskId?: number
  answerContent?: string
  isCorrect: number
  errorReason?: string
  errorCategory?: string
  isRevised?: number
  firstErrorTime?: string
  errorCount?: number
  duration?: number
  knowledgePointId?: number
  createTime?: string
}

// ==================== 通用 API ====================

/** AI统一调用 */
export function aiUnifiedCall(params: { businessType: string; content: string; customPrompt?: string }) {
  return http.post<string>('/app/learn/ai/unified-call', params)
}
