import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

function App() {
  // Initial sample data
  const [students, setStudents] = useState([
    { id: 1, name: 'Ajita Koirala', email: 'ajita.koirala@example.com', age: 20 },
    { id: 2, name: 'Indira Koirala', email: 'indira.koirala@example.com', age: 22 },
    { id: 3, name: 'Vishal', email: 'vishal@example.com', age: 19 },
  ])
  
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', age: '' })
  const [errors, setErrors] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  
  // Dialog states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.age.toString().includes(searchTerm)
  )

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required'
    } else {
      const age = parseInt(formData.age)
      if (isNaN(age) || age < 1 || age > 150) {
        newErrors.age = 'Please enter a valid age'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Simulate loading
  const simulateLoading = (action) => {
    setLoading(true)
    setTimeout(() => {
      action()
      setLoading(false)
    }, 800)
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (isEditing) {
      simulateLoading(() => {
        setStudents(students.map(s => 
          s.id === editId ? { ...formData, id: editId, age: parseInt(formData.age) } : s
        ))
        closeForm()
      })
    } else {
      simulateLoading(() => {
        const newStudent = {
          ...formData,
          id: Date.now(),
          age: parseInt(formData.age)
        }
        setStudents([...students, newStudent])
        closeForm()
      })
    }
  }

  // Close form
  const closeForm = () => {
    setFormData({ name: '', email: '', age: '' })
    setErrors({})
    setIsEditing(false)
    setEditId(null)
    setShowForm(false)
  }

  // Open form for add
  const openAddForm = () => {
    setFormData({ name: '', email: '', age: '' })
    setErrors({})
    setIsEditing(false)
    setEditId(null)
    setShowForm(true)
  }

  // Handle edit
  const handleEdit = (student) => {
    setFormData({ name: student.name, email: student.email, age: student.age.toString() })
    setIsEditing(true)
    setEditId(student.id)
    setErrors({})
    setShowForm(true)
  }

  // Handle delete click
  const handleDeleteClick = (student) => {
    setStudentToDelete(student)
    setShowDeleteConfirm(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    simulateLoading(() => {
      setStudents(students.filter(s => s.id !== studentToDelete.id))
      setShowDeleteConfirm(false)
      setShowDeleteSuccess(true)
      
      setTimeout(() => {
        setShowDeleteSuccess(false)
        setStudentToDelete(null)
      }, 2000)
    })
  }

  // Download Excel
  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(s => ({
      Name: s.name,
      Email: s.email,
      Age: s.age
    })))
    
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
    
    // Set column widths
    worksheet['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 10 }]
    
    XLSX.writeFile(workbook, 'students.xlsx')
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="container">
      <h1>Student Management System</h1>
      
      {/* Student List */}
      <div className="card">
        <div className="toolbar">
          <h3>Student List</h3>
          <div className="toolbar-controls">
            <input
              type="text"
              className="search-box"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary" onClick={openAddForm}>
              + Add Student
            </button>
            <button 
              className="btn btn-success" 
              onClick={() => downloadExcel(filteredStudents)}
              disabled={filteredStudents.length === 0}
            >
              Download Excel
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>{searchTerm ? 'No students found matching your search' : 'No students yet. Add one above!'}</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.age}</td>
                    <td className="action-btns">
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDeleteClick(student)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Form Dialog */}
      {showForm && (
        <div className="dialog-overlay" onClick={closeForm}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>{isEditing ? 'Edit Student' : 'Add New Student'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className={errors.name ? 'error' : ''}
                  autoFocus
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  className={errors.age ? 'error' : ''}
                />
                {errors.age && <span className="error-text">{errors.age}</span>}
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Update Student' : 'Add Student'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{studentToDelete?.name}</strong>? This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => {
                setShowDeleteConfirm(false)
                setStudentToDelete(null)
              }}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Dialog */}
      {showDeleteSuccess && (
        <div className="dialog-overlay">
          <div className="dialog success-dialog">
            <h3>✓ Success</h3>
            <p><strong>{studentToDelete?.name}</strong> has been deleted successfully.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
