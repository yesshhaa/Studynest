// lib/db.ts  — Firestore CRUD helpers
import {
  collection, doc, getDocs, addDoc, updateDoc,
  deleteDoc, query, orderBy, serverTimestamp,
  setDoc, where, Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const todayStr = () => new Date().toISOString().split('T')[0]

// ── Path helpers ─────────────────────────────────
const userCol  = (uid: string, col: string) => collection(db, 'users', uid, col)
const userDoc  = (uid: string, col: string, id: string) => doc(db, 'users', uid, col, id)

// ── Generic helpers ──────────────────────────────
export async function getAll<T>(uid: string, col: string): Promise<T[]> {
  const snap = await getDocs(userCol(uid, col))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as T))
}

export async function addItem(uid: string, col: string, data: object) {
  return addDoc(userCol(uid, col), { ...data, createdAt: serverTimestamp() })
}

export async function updateItem(uid: string, col: string, id: string, data: object) {
  return updateDoc(userDoc(uid, col, id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteItem(uid: string, col: string, id: string) {
  return deleteDoc(userDoc(uid, col, id))
}

// ── User profile ─────────────────────────────────
export async function saveUserProfile(uid: string, data: { name: string; email: string }) {
  return setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

// ── Tasks ─────────────────────────────────────────
export interface Task {
  id:   string
  text: string
  tag:  'study' | 'project' | 'urgent' | 'deadline'
  done: boolean
  date: string
}

export const getTasks        = (uid: string) => getAll<Task>(uid, 'tasks')
export const addTask         = (uid: string, data: Omit<Task,'id'>) => addItem(uid, 'tasks', data)
export const toggleTask      = (uid: string, id: string, done: boolean) => updateItem(uid, 'tasks', id, { done })
export const deleteTask      = (uid: string, id: string) => deleteItem(uid, 'tasks', id)

// ── Projects ──────────────────────────────────────
export interface Project {
  id:       string
  name:     string
  desc:     string
  deadline: string
  color:    'rose' | 'lavender' | 'mint' | 'peach'
  progress: number
  logs:     { date: string; text: string }[]
}

export const getProjects   = (uid: string) => getAll<Project>(uid, 'projects')
export const addProject    = (uid: string, data: Omit<Project,'id'>) => addItem(uid, 'projects', data)
export const updateProject = (uid: string, id: string, data: Partial<Project>) => updateItem(uid, 'projects', id, data)
export const deleteProject = (uid: string, id: string) => deleteItem(uid, 'projects', id)

// ── Journal ───────────────────────────────────────
export interface JournalEntry {
  id:   string
  text: string
  mood: string
  date: string
}

export const getJournals   = (uid: string) => getAll<JournalEntry>(uid, 'journals')
export const addJournal    = (uid: string, data: Omit<JournalEntry,'id'>) => addItem(uid, 'journals', data)
export const deleteJournal = (uid: string, id: string) => deleteItem(uid, 'journals', id)

// ── Study Topics ──────────────────────────────────
export interface Topic {
  id:    string
  name:  string
  sub:   string
  badge: 'new' | 'review' | 'due'
  icon:  string
}

export const getTopics   = (uid: string) => getAll<Topic>(uid, 'topics')
export const addTopic    = (uid: string, data: Omit<Topic,'id'>) => addItem(uid, 'topics', data)
export const deleteTopic = (uid: string, id: string) => deleteItem(uid, 'topics', id)
