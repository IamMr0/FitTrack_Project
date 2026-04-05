<template>
  <div class="container-fluid py-5 px-lg-5 fade-in">
    <!-- Hero Section -->
    <div class="row min-vh-50 align-items-center mb-5 pb-5 border-bottom">
      <div class="col-12 col-lg-6 mb-5 mb-lg-0">
        <span class="badge bg-primary-light text-primary px-3 py-2 rounded-pill fw-bold mb-3 tracking-widest text-uppercase" style="font-size: 0.75rem">Our Story</span>
        <h1 class="display-3 fw-bold mb-4 tracking-tighter">Fitness should be <span class="text-primary position-relative">accessible<span class="position-absolute bottom-0 start-0 w-100 bg-primary opacity-25" style="height: 30%; z-index: -1;"></span></span> to everyone.</h1>
        <p class="lead text-muted mb-4 pe-lg-5" style="line-height: 1.8;">
          Born out of a university project, FitTrack was built with one simple vision: to strip away the noise and overcomplication of the modern fitness industry. We provide straightforward, science-backed tools for tracking your progress, discovering new exercises, and engaging with a community of peers.
        </p>
        <div class="d-flex gap-4 mt-5">
          <div>
            <div class="display-5 fw-bold text-dark">1K+</div>
            <div class="small text-muted text-uppercase fw-bold tracking-wider mt-1">Active Users</div>
          </div>
          <div class="border-start"></div>
          <div>
            <div class="display-5 fw-bold text-primary">1500+</div>
            <div class="small text-muted text-uppercase fw-bold tracking-wider mt-1">Exercises</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="position-relative ps-lg-5">
          <img src="../assets/images/fitness.png" alt="FitTrack Team Working Out" class="img-fluid rounded-4 shadow-lg w-100" style="object-fit: cover; height: 500px;" @error="handleImageError">
          <div class="position-absolute bottom-0 start-0 translate-middle-x bg-white p-4 rounded-4 shadow-sm d-none d-md-block" style="margin-left: 15%; margin-bottom: -5%;">
            <div class="d-flex align-items-center gap-3">
              <div class="bg-primary-light text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; font-size: 1.5rem;">🌟</div>
              <div>
                <h5 class="fw-bold mb-0">Established</h5>
                <p class="text-muted small mb-0 fw-medium">2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form Section -->
    <div class="row align-items-center mt-5 pt-4">
      <div class="col-12 col-lg-5 mb-5 mb-lg-0">
        <h2 class="display-5 fw-bold mb-3 tracking-tighter">Get in Touch</h2>
        <p class="text-muted lead mb-5" style="line-height: 1.6;">
          Have questions, feedback, or want to collaborate? Drop us a message and our support team will get back to you within 24 hours.
        </p>
        
        <div class="d-flex flex-column gap-4">
          <div class="d-flex align-items-center gap-4">
            <div class="bg-light rounded-circle d-flex justify-content-center align-items-center transition-all hover-scale" style="width: 55px; height: 55px; font-size: 1.5rem;">📧</div>
            <div>
              <div class="fw-bold text-dark fs-5">Email Us</div>
              <a href="mailto:support@fittrack.com" class="text-muted text-decoration-none hover-primary transition-all">support@fittrack.com</a>
            </div>
          </div>
          <div class="d-flex align-items-center gap-4 mt-3">
            <div class="bg-light rounded-circle d-flex justify-content-center align-items-center transition-all hover-scale" style="width: 55px; height: 55px; font-size: 1.5rem;">📍</div>
            <div>
              <div class="fw-bold text-dark fs-5">Headquarters</div>
              <div class="text-muted">123 Fitness Ave, University District</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-12 col-lg-6 offset-lg-1">
        <div class="card border-0 shadow rounded-4 p-4 p-md-5 bg-white position-relative overflow-hidden">
          <div class="position-absolute top-0 end-0 bg-primary opacity-10" style="width: 150px; height: 150px; border-radius: 0 0 0 100%;"></div>
          <form @submit.prevent="submitForm" class="position-relative z-1">
            <h4 class="fw-bold mb-4 text-dark">Send a Message</h4>
            
            <div v-if="formSuccess" class="alert alert-success border-0 bg-primary-light text-primary fw-bold rounded-3 mb-4 slide-down" role="alert">
              🎉 Thank you for reaching out! We've received your message.
            </div>

            <div class="row g-4">
              <div class="col-12 col-md-6">
                <label for="contactName" class="form-label small fw-bold text-muted text-uppercase tracking-wider">Your Name</label>
                <input type="text" id="contactName" v-model="form.name" class="form-control form-control-lg py-3 rounded-3 fs-6" placeholder="John Doe" required>
              </div>
              <div class="col-12 col-md-6">
                <label for="contactEmail" class="form-label small fw-bold text-muted text-uppercase tracking-wider">Email Address</label>
                <input type="email" id="contactEmail" v-model="form.email" class="form-control form-control-lg py-3 rounded-3 fs-6" placeholder="john@example.com" required>
              </div>
              <div class="col-12">
                <label for="contactSubject" class="form-label small fw-bold text-muted text-uppercase tracking-wider">Subject</label>
                <select id="contactSubject" v-model="form.subject" class="form-select form-select-lg py-3 rounded-3 fs-6" required>
                  <option value="" disabled>Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">App Feedback</option>
                  <option value="business">Business Partnership</option>
                </select>
              </div>
              <div class="col-12">
                <label for="contactMessage" class="form-label small fw-bold text-muted text-uppercase tracking-wider">Message</label>
                <textarea id="contactMessage" v-model="form.message" class="form-control py-3 rounded-3 fs-6" rows="5" placeholder="How can we help you?" required></textarea>
              </div>
              <div class="col-12 mt-4 pt-2">
                <button type="submit" class="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm transition-all hover-lift" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      isSubmitting: false,
      formSuccess: false
    }
  },
  methods: {
    submitForm() {
      this.isSubmitting = true
      this.formSuccess = false
      setTimeout(() => {
        this.isSubmitting = false
        this.formSuccess = true
        this.form.name = ''
        this.form.email = ''
        this.form.subject = ''
        this.form.message = ''
        setTimeout(() => { this.formSuccess = false }, 5000)
      }, 1000)
    },
    handleImageError(e) {
      e.target.src = 'https://placehold.co/800x600?text=FitTrack+Team'
      e.target.classList.add('opacity-50')
    }
  }
}
</script>

<style scoped>
.tracking-widest {
  letter-spacing: 0.1em;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.tracking-tighter {
  letter-spacing: -0.05em;
}

.bg-primary-light {
  background-color: var(--primary-light);
}

.hover-primary:hover {
  color: var(--primary) !important;
}

.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.1);
  background-color: var(--primary-light) !important;
  color: var(--primary);
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(13, 110, 253, 0.2) !important;
}

.slide-down {
  animation: slideDown 0.3s ease forwards;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-control:focus, .form-select:focus {
  box-shadow: 0 0 0 0.25rem var(--primary-light);
}
</style>
