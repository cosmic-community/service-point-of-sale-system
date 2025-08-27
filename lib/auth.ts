import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User, AuthResponse, Staff } from '@/types'
import { cosmic } from './cosmic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export async function authenticateUser(username: string, password: string): Promise<AuthResponse | null> {
  try {
    // Find user in Cosmic
    const response = await cosmic.objects
      .find({ 
        type: 'users',
        'metadata.username': username 
      })
      .props(['id', 'title', 'metadata'])
      .depth(1)
    
    if (!response.objects.length) {
      return null
    }
    
    const userObject = response.objects[0]
    const isValidPassword = await comparePassword(password, userObject.metadata.password_hash)
    
    if (!isValidPassword) {
      return null
    }
    
    const user: User = {
      id: userObject.id,
      username: userObject.metadata.username,
      role: userObject.metadata.role,
      staff_member: userObject.metadata.staff_member as Staff,
      business: userObject.metadata.business
    }
    
    const token = generateToken(user)
    
    return { user, token }
  } catch (error) {
    console.error('Authentication error:', error)
    throw new Error('Authentication failed')
  }
}

export async function createUser(
  username: string, 
  password: string, 
  role: 'admin' | 'staff' | 'manager' = 'staff',
  staffMemberId?: string
): Promise<User> {
  try {
    const passwordHash = await hashPassword(password)
    
    const response = await cosmic.objects.insertOne({
      type: 'users',
      title: username,
      metadata: {
        username,
        password_hash: passwordHash,
        role,
        staff_member: staffMemberId || '',
        status: 'Active',
        created_at: new Date().toISOString()
      }
    })
    
    return {
      id: response.object.id,
      username: response.object.metadata.username,
      role: response.object.metadata.role,
      staff_member: response.object.metadata.staff_member
    }
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }
}

export function requireAuth(req: Request): User {
  const authHeader = req.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided')
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded = verifyToken(token)
    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    }
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export function requireRole(user: User, allowedRoles: string[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }
}