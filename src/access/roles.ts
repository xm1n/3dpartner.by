import type { Access, FieldAccess } from 'payload'

export type Role = 'admin' | 'manager' | 'developer' | 'b2c_customer' | 'b2b_customer' | 'engineer'

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const isAdminOrManager: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'admin' || user.role === 'manager'
}

export const isDeveloper: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'admin' || user.role === 'developer'
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}

export const isEngineer: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'admin' || user.role === 'manager' || user.role === 'engineer'
}

export const isB2B: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'admin' || user.role === 'manager' || user.role === 'b2b_customer'
}

export const isLoggedIn: Access = ({ req: { user } }) => {
  return !!user
}

export const isAdminOrPublished: Access = ({ req: { user } }) => {
  if (user?.role === 'admin' || user?.role === 'manager') return true
  return { _status: { equals: 'published' } }
}

export const anyone: Access = () => true
