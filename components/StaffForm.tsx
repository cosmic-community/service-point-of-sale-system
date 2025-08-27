'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Staff, StaffStatus, CreateStaffData } from '@/types'
import { validateEmail, validatePhone } from '@/lib/utils'

interface StaffFormProps {
  staff?: Staff | null
  onSubmit: (data: CreateStaffData) => Promise<void>
  onClose: () => void
}

export default function StaffForm({ staff, onSubmit, onClose }: StaffFormProps) {
  const [formData, setFormData] = useState<CreateStaffData>({
    title: staff?.title || '',
    commission_percentage: staff?.metadata.commission_percentage || 0,
    phone: staff?.metadata.phone || '',
    email: staff?.metadata.email || '',
    status: staff?.metadata.status || 'Active',
    role: staff?.metadata.role || 'staff'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Name is required'
    }

    if (formData.commission_percentage < 0 || formData.commission_percentage > 100) {
      newErrors.commission_percentage = 'Commission must be between 0 and 100'
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof CreateStaffData, value: any) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {staff ? 'Edit Staff Member' : 'Add Staff Member'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`input ${errors.title ? 'border-danger-500' : ''}`}
              placeholder="Enter staff member name"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-danger-600">{errors.title}</p>
            )}
          </div>

          {/* Commission Percentage */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Commission Percentage *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.commission_percentage}
                onChange={(e) => handleChange('commission_percentage', Number(e.target.value))}
                className={`input pr-8 ${errors.commission_percentage ? 'border-danger-500' : ''}`}
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-slate-500 text-sm">%</span>
              </div>
            </div>
            {errors.commission_percentage && (
              <p className="mt-1 text-sm text-danger-600">{errors.commission_percentage}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`input ${errors.email ? 'border-danger-500' : ''}`}
              placeholder="staff@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-danger-600">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`input ${errors.phone ? 'border-danger-500' : ''}`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-danger-600">{errors.phone}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="input"
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as StaffStatus)}
              className="input"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (staff ? 'Update' : 'Create')} Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}