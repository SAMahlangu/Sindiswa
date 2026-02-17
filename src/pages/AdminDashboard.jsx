import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import AdminNav from '../components/AdminNav';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [revenue, setRevenue] = useState(0);

  // Form states
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: 0,
    duration_minutes: 30,
    image_url: ''
  });

  const [editingService, setEditingService] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchAppointments();
    fetchServices();
  }, [user, navigate]);

  useEffect(() => {
    calculateRevenue();
  }, [appointments]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services:service_id(name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenue = () => {
    const total = appointments
      .filter(apt => apt.status === 'paid')
      .reduce((sum, apt) => sum + (apt.deposit_amount || 0), 0);
    setRevenue(total);
  };

  const getFilteredAppointments = () => {
    if (!filterDate) return appointments;
    return appointments.filter(apt => apt.date === filterDate);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        name: serviceForm.name,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price),
        duration_minutes: parseInt(serviceForm.duration_minutes)
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        setEditingService(null);
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        
        if (error) throw error;
      }

      setServiceForm({ name: '', description: '', price: '', duration_minutes: 30 });
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', serviceId);

        if (error) throw error;
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', appointmentId);

        if (error) throw error;
        fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration_minutes: service.duration_minutes,
      image_url: service.image_url || ''
    });
    setImagePreview(service.image_url || null);
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setServiceForm({ ...serviceForm, image_url: url });
    if (url) {
      setImagePreview(url);
    }
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    try {
      setUploading(true);

      // Create a unique file name
      const timestamp = Date.now();
      const fileName = `service-${timestamp}-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
      const filePath = `services/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('service-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

      setServiceForm({ ...serviceForm, image_url: publicUrl });
      setImagePreview(publicUrl);

      console.log('Image uploaded successfully:', publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app-container">
      <AdminNav onLogout={handleLogout} />
      
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-value">{appointments.length}</p>
          </div>
          <div className="stat-card">
            <h3>Confirmed Bookings</h3>
            <p className="stat-value">{appointments.filter(a => a.status === 'paid').length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-value">R {revenue.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Active Services</h3>
            <p className="stat-value">{services.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button
            className={`tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Appointments</h2>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="filter-date"
              />
              {filterDate && (
                <button className="btn btn-secondary btn-sm" onClick={() => setFilterDate('')}>
                  Clear Filter
                </button>
              )}
            </div>

            {loading ? (
              <div className="loader"></div>
            ) : getFilteredAppointments().length === 0 ? (
              <p className="empty-state">No appointments found</p>
            ) : (
              <div className="appointments-table">
                <table>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Phone</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Deposit</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredAppointments().map(apt => (
                      <tr key={apt.id}>
                        <td>{apt.client_name}</td>
                        <td>{apt.client_phone}</td>
                        <td>{apt.services?.name || 'Unknown Service'}</td>
                        <td>{apt.date}</td>
                        <td>{apt.time}</td>
                        <td>R {(apt.deposit_amount || 0).toFixed(2)}</td>
                        <td>
                          <span className={`badge ${apt.status}`}>
                            {apt.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="actions">
                          {apt.status === 'paid' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                              >
                                Complete
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleCancelAppointment(apt.id)}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {apt.status === 'pending' && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleCancelAppointment(apt.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="admin-section">
            <h2>Manage Services</h2>

            <div className="service-form-wrapper">
              <form onSubmit={handleAddService} className="service-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Service Name</label>
                    <input
                      type="text"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      placeholder="e.g., Gel Manicure"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (R)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input
                      type="number"
                      min="15"
                      step="15"
                      value={serviceForm.duration_minutes || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    placeholder="Service description..."
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Service Image</label>
                  <div className="image-upload-section">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      disabled={uploading}
                      className="image-input"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="image-upload-label">
                      {uploading ? 'Uploading...' : 'Click to upload image from device'}
                    </label>
                    <p className="image-help-text">Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
                  </div>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Service preview" onError={() => setImagePreview(null)} />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setImagePreview(null);
                          setServiceForm({ ...serviceForm, image_url: '' });
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingService ? 'Update Service' : 'Add Service'}
                  </button>
                  {editingService && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingService(null);
                        setServiceForm({ name: '', description: '', price: '', duration_minutes: 30, image_url: '' });
                        setImagePreview(null);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="services-list">
              <h3>Available Services</h3>
              {services.length === 0 ? (
                <p className="empty-state">No services added yet</p>
              ) : (
                <div className="services-grid">
                  {services.map(service => (
                    <div key={service.id} className="service-item">
                      {service.image_url && (
                        <div className="service-image">
                          <img src={service.image_url} alt={service.name} onError={(e) => e.target.style.display = 'none'} />
                        </div>
                      )}
                      <h4>{service.name}</h4>
                      <p>{service.description}</p>
                      <div className="service-meta">
                        <span>R {service.price.toFixed(2)}</span>
                        <span>{service.duration_minutes} min</span>
                      </div>
                      <div className="service-actions">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEditService(service)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
