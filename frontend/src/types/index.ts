export interface AgeGroupStat { age: string; encounters: number; share: number; readmitRate: number; avgStay: number; avgMeds: number; avgLab: number; avgProcs: number }
export interface RateRow { name: string; value: number; n?: number }
export interface BarDatum { label: string; value: number; lines: string[] }
export interface Kpi { label: string; value: string; hint?: string }
export interface FieldOption { value: string; label: string }
export interface FormField { key: string; label: string; type: 'number' | 'select' | 'boolean'; required?: boolean; min?: number; max?: number; options?: FieldOption[]; help?: string }
export interface FormSection { id: string; title: string; blurb: string; fields: FormField[] }
export interface AIResponse { id: string; question: string; keywords: string[]; answer: string; points: string[]; viz: { label: string; to: string } }
export interface SampleResult { value: number; category: string; explanation: string; factors: { label: string; effect: string }[] }
