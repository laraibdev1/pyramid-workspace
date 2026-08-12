import type { Accent, Priority, Task } from './types'

export const seedTasks: Task[] = [
  { id: 1, title: 'Write API Documentation', status: 'To Do', priority: 'High', member: 'Admin', date: '29 Jul', labels: ['Deployment', 'Deployment'] },
  { id: 2, title: 'Implement Search Function', status: 'To Do', priority: 'Medium', member: 'Admin', date: '29 Jul', labels: ['Deployment', 'Deployment'] },
  { id: 3, title: 'Deploy to Production', status: 'To Do', priority: 'Low', member: 'Admin', date: '29 Jul', labels: ['Deployment', 'Deployment'] },
  { id: 4, title: 'Code Review Completed', status: 'Doing', priority: 'High', member: 'Admin', date: '29 Jul', labels: ['Deployment', 'Deployment'] },
  { id: 5, title: 'Design Mockups Finalized', status: 'Doing', priority: 'Medium', member: 'Admin', date: '29 Jul', labels: ['Deployment', 'Deployment'] },
  { id: 6, title: 'Feature Testing Passed', status: 'Completed', priority: 'High', member: 'QA Team', date: '30 Jul', labels: ['Testing', 'Passed'] },
  { id: 7, title: 'UI Design Updated', status: 'Completed', priority: 'Medium', member: 'Designer', date: '31 Jul', labels: ['Design', 'Updated'] },
  { id: 8, title: 'Security Audit Scheduled', status: 'Completed', priority: 'Low', member: 'Security', date: '01 Aug', labels: ['Audit', 'Scheduled'] },
  { id: 9, title: 'UI Review', status: 'On Hold', priority: 'Medium', member: 'Designer', date: '02 Aug', labels: ['Review', 'Feedback'] },
  { id: 10, title: 'Backend Refactor', status: 'On Hold', priority: 'Low', member: 'Dev Team', date: '04 Aug', labels: ['Development', 'Code'] },
]

export const projects = [
  { title: 'Design Homepage', priority: 'High' as Priority, lead: 'Admin', date: '12 Sep 2026' },
  { title: 'Develop Login Feature', priority: 'Low' as Priority, lead: 'CN', date: '15 Sep 2026' },
  { title: 'Test Payment Gateway', priority: 'Medium' as Priority, lead: '+', date: '18 Sep 2026' },
]

export const statuses: Task['status'][] = ['To Do', 'Doing', 'Completed', 'On Hold']
export const priorities: Priority[] = ['Urgent', 'High', 'Medium', 'Low']

export const accents: { id: Accent; label: string; swatch: string }[] = [
  { id: 'amber', label: 'Amber', swatch: '#d97706' },
  { id: 'blue', label: 'Blue', swatch: '#2563eb' },
  { id: 'pink', label: 'Pink', swatch: '#db2777' },
  { id: 'rose', label: 'Rose', swatch: '#e11d48' },
  { id: 'emerald', label: 'Emerald', swatch: '#059669' },
  { id: 'black', label: 'Black', swatch: '#161616' },
]
