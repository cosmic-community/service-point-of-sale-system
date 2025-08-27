'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Users, DollarSign } from 'lucide-react'
import { Staff, StaffStatus } from '@/types'
import { getStaffMembers, createStaff, updateStaff } from '@/lib/cosmic'
import { formatCurrency } from '@/lib/utils'
import StaffForm from '@/components/StaffForm'

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = async () => {
    try {
      const staffData = await getStaffMembers()
      setStaff(staffData)
    } catch (error) {
      console.error('Error loading staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStaff = async (data: any) => {
    try {
      await createStaff(data)
      await loadStaff()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating staff:', error)
    }
  }

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember)
    setShowForm(true)
  }

  const handleUpdateStaff = async (data: any) => {
    if (!editingStaff) return

    try {
      await updateStaff(editingStaff.id, data)
      await loadStaff()
      setShowForm(false)
      setEditingStaff(null)
    } catch (error) {
      console.error('Error updating staff:', error)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingStaff(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-600 mt-1">Manage your staff members and commission rates</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Staff</p>
              <p className="text-2xl font-semibold text-slate-900">{staff.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <Users className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Active Staff</p>
              <p className="text-2xl font-semibold text-slate-900">
                {staff.filter(s => s.metadata.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Avg Commission</p>
              <p className="text-2xl font-semibold text-slate-900">
                {staff.length > 0 
                  ? `${(staff.reduce((sum, s) => sum + s.metadata.commission_percentage, 0) / staff.length).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Staff Members</h2>
          <span className="text-sm text-slate-500">{staff.length} members</span>
        </div>

        {staff.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No staff members yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add First Staff Member
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Commission</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {staff.map(member => (
                  <StaffRow
                    key={member.id}
                    staff={member}
                    onEdit={() => handleEditStaff(member)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Staff Form Modal */}
      {showForm && (
        <StaffForm
          staff={editingStaff}
          onSubmit={editingStaff ? handleUpdateStaff : handleCreateStaff}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}

function StaffRow({ 
  staff, 
  onEdit 
}: { 
  staff: Staff
  onEdit: () => void 
}) {
  const getStatusBadge = (status: StaffStatus) => {
    const statusClasses = {
      'Active': 'bg-success-100 text-success-800',
      'Inactive': 'bg-slate-100 text-slate-800',
      'Suspended': 'bg-danger-100 text-danger-800'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    )
  }

  return (
    <tr>
      <td>
        <div>
          <div className="font-medium text-slate-900">{staff.title}</div>
          <div className="text-sm text-slate-500">{staff.metadata.email}</div>
        </div>
      </td>
      <td className="text-slate-900">
        {staff.metadata.role || 'Staff'}
      </td>
      <td className="text-slate-900">
        <span className="font-semibold">{staff.metadata.commission_percentage}%</span>
      </td>
      <td className="text-slate-900">
        {staff.metadata.phone || 'No phone'}
      </td>
      <td>
        {getStatusBadge(staff.metadata.status)}
      </td>
      <td>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="text-slate-400 hover:text-primary-600"
            title="Edit Staff"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}