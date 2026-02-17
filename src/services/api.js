import { supabase } from '../config/supabase';

export const appointmentService = {
  // Create appointment
  async createAppointment(appointmentData) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            ...appointmentData,
            created_at: new Date().toISOString(),
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;
      return data[0].id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Check appointment availability
  async checkAvailability(date, serviceId, time) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', date)
        .eq('service_id', serviceId)
        .eq('time', time)
        .in('status', ['pending', 'paid']);

      if (error) throw error;
      return data.length === 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  },

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Get appointments for date
  async getAppointmentsByDate(date) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', date)
        .order('time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  },

  // Get all appointments (admin)
  async getAllAppointments() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  },

  // Get single appointment
  async getAppointment(appointmentId) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw error;
    }
  }
};

export const serviceService = {
  // Get all services
  async getAllServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting services:', error);
      throw error;
    }
  },

  // Create service (admin)
  async createService(serviceData) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update service (admin)
  async updateService(serviceId, serviceData) {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', serviceId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Delete service (admin)
  async deleteService(serviceId) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
};

export const settingsService = {
  // Get settings
  async getSettings() {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || {
        business_name: 'Nail Tech Studio',
        working_hours: { start: 9, end: 17 },
        deposit_percentage: 0.3
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  },

  // Update settings (admin)
  async updateSettings(settingsData) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .upsert(settingsData)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};

export const paymentService = {
  // Record payment
  async recordPayment(appointmentId, paymentData) {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          payfast_reference: paymentData.payfast_reference
        })
        .eq('id', appointmentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  },

  // Get revenue
  async getRevenue(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('deposit_amount')
        .eq('status', 'paid')
        .gte('paid_at', startDate)
        .lte('paid_at', endDate);

      if (error) throw error;
      
      const total = data.reduce((sum, apt) => sum + apt.deposit_amount, 0);
      return {
        totalRevenue: total,
        totalBookings: data.length
      };
    } catch (error) {
      console.error('Error getting revenue:', error);
      throw error;
    }
  }
};
