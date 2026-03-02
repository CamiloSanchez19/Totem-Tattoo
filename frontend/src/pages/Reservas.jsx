import { useState } from 'react'
import Layout from '../components/Layout'
import PageTitle from '../components/ui/PageTitle'
import { useJQueryPlugins } from '../hooks/useJQueryPlugins'
import { useToastContext } from '../context/ToastContext'
import { createPublicReservation } from '../config/adminApi'
import '../styles/styles.css'

const MAX_REFERENCE_IMAGES = 3

function isPastDate(value) {
  if (!value) return false

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return false

  const selectedDate = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return selectedDate < today
}

function Reservas() {
  useJQueryPlugins()
  const { showToast } = useToastContext()
  const toastDuration = 3000
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    body_zone: '',
    size_cm: '',
    style: '',
    color: '',
    reference_images: [],
    preferred_dates: ['', '', '']
  })

  const [imagePreviews, setImagePreviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateChange = (index, value) => {
    if (value && isPastDate(value)) {
      showToast('No puedes seleccionar fechas pasadas. Elige una fecha de hoy en adelante.', 'error', toastDuration)
      return
    }

    const newDates = [...formData.preferred_dates]
    newDates[index] = value
    setFormData(prev => ({
      ...prev,
      preferred_dates: newDates
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const maxFiles = MAX_REFERENCE_IMAGES

    if (!files.length) return

    // Validar tamaño de archivos
    const maxSize = 2 * 1024 * 1024 // 2MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        showToast(`${file.name} excede el tamaño máximo de 2MB`, 'warning', toastDuration)
        return false
      }
      return true
    })

    const mergedFiles = [...formData.reference_images, ...validFiles].slice(0, maxFiles)

    if (formData.reference_images.length + validFiles.length > maxFiles) {
      showToast(`Solo se permiten ${maxFiles} imágenes en total`, 'warning', toastDuration)
    }

    setFormData(prev => ({
      ...prev,
      reference_images: mergedFiles
    }))

    // Crear previsualizaciones
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview))
    const previews = mergedFiles.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)

    e.target.value = ''
  }

  const removeImage = (index) => {
    const newImages = [...formData.reference_images]
    const newPreviews = [...imagePreviews]
    
    URL.revokeObjectURL(newPreviews[index])
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    
    setFormData(prev => ({
      ...prev,
      reference_images: newImages
    }))
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showToast('Por favor ingresa tu nombre completo', 'error', toastDuration)
      return
    }

    if (!formData.email.trim()) {
      showToast('Por favor ingresa tu correo electrónico', 'error', toastDuration)
      return
    }

    if (!formData.phone.trim()) {
      showToast('Por favor ingresa tu teléfono', 'error', toastDuration)
      return
    }

    if (!formData.size_cm.trim()) {
      showToast('Por favor ingresa el tamaño aproximado', 'error', toastDuration)
      return
    }
    
    // Validaciones
    if (!formData.body_zone) {
      showToast('Por favor selecciona la zona del cuerpo', 'error', toastDuration)
      return
    }
    
    if (!formData.style) {
      showToast('Por favor selecciona el estilo del tatuaje', 'error', toastDuration)
      return
    }
    
    if (!formData.color) {
      showToast('Por favor selecciona el tipo de color', 'error', toastDuration)
      return
    }

    // Filtrar fechas vacías
    const validDates = formData.preferred_dates.filter(date => date !== '')
    if (validDates.length === 0) {
      showToast('Por favor selecciona al menos una fecha preferida', 'error', toastDuration)
      return
    }

    if (validDates.some((date) => isPastDate(date))) {
      showToast('Hay fechas en pasado. Corrige las fechas preferidas antes de enviar.', 'error', toastDuration)
      return
    }

    const payload = new FormData()
    payload.append('name', formData.name)
    payload.append('email', formData.email)
    payload.append('phone', formData.phone)
    payload.append('body_zone', formData.body_zone)
    payload.append('size_cm', formData.size_cm)
    payload.append('style', formData.style)
    payload.append('color', formData.color)

    validDates.forEach((date, index) => {
      payload.append(`preferred_dates[${index}]`, date)
    })

    formData.reference_images.forEach((file) => {
      payload.append('reference_images[]', file)
    })

    try {
      setIsSubmitting(true)
      await createPublicReservation(payload)

      showToast('¡Reserva enviada exitosamente! Te contactaremos pronto.', 'success', toastDuration)

      setFormData({
        name: '',
        email: '',
        phone: '',
        body_zone: '',
        size_cm: '',
        style: '',
        color: '',
        reference_images: [],
        preferred_dates: ['', '', ''],
      })
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))
      setImagePreviews([])
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo registrar la reserva. Intenta de nuevo.'
      showToast(message, 'error', toastDuration)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout footerVariant="style-two">
      <div className="reservation-page-title">
        <PageTitle 
          title="Reserva tu Tatuaje" 
          breadcrumbs={[
          ]} 
        />
      </div>
      
      <section className="reservation-section">
        <div className="auto-container">
          <div className="sec-title centered">
            <div className="separator"><span></span></div>
            <h2>Reserva tu cita</h2>
            <div className="text">Cuéntanos sobre tu idea y encontraremos el mejor momento para hacerla realidad</div>
          </div>

          <div className="reservation-form-wrapper">
            <form onSubmit={handleSubmit} className="reservation-form" noValidate>
              
              {/* Información Personal */}
              <div className="form-section">
                <h3 className="section-title">Tus datos</h3>
                <div className="row clearfix">
                  <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                    <label htmlFor="name">Nombre completo *</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej. Juan Pérez" 
                      required 
                    />
                  </div>
                  
                  <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                    <label htmlFor="email">Email *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="correo@gmail.com" 
                      required 
                    />
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label htmlFor="phone">Teléfono *</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+57 300 345 6789" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Detalles del Tatuaje */}
              <div className="form-section">
                <h3 className="section-title">Sobre tu tatuaje</h3>
                <div className="row clearfix">
                  
                  <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                    <label htmlFor="body_zone">Zona del cuerpo *</label>
                    <select 
                      id="body_zone"
                      name="body_zone"
                      value={formData.body_zone}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona una zona</option>
                      <option value="brazo">Brazo</option>
                      <option value="antebrazo">Antebrazo</option>
                      <option value="espalda">Espalda</option>
                      <option value="pecho">Pecho</option>
                      <option value="pierna">Pierna</option>
                      <option value="pantorrilla">Pantorrilla</option>
                      <option value="costillas">Costillas</option>
                      <option value="mano">Mano</option>
                      <option value="cuello">Cuello</option>
                      <option value="otra">Otra</option>
                    </select>
                    <small className="form-hint">¿Dónde quieres el tatuaje?</small>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                    <label htmlFor="size_cm">Tamaño aproximado *</label>
                    <input 
                      type="text" 
                      id="size_cm"
                      name="size_cm"
                      value={formData.size_cm}
                      onChange={handleInputChange}
                      placeholder="10 x 15 cm" 
                      required 
                    />
                    <small className="form-hint">No tiene que ser exacto, sólo una idea</small>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                    <label htmlFor="style">Estilo del tatuaje *</label>
                    <select 
                      id="style"
                      name="style"
                      value={formData.style}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona un estilo</option>
                      <option value="realismo">Realismo</option>
                      <option value="blackwork">Blackwork</option>
                      <option value="fine_line">Fine line</option>
                      <option value="tradicional">Tradicional</option>
                      <option value="neotradicional">Neotradicional</option>
                      <option value="minimalista">Minimalista</option>
                      <option value="lettering">Lettering</option>
                      <option value="puntillismo">Puntillismo</option>
                      <option value="otro">Otro</option>
                    </select>
                    <small className="form-hint">Elige el que más te guste o el que tengas en mente</small>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 form-group">
                    <label>Color *</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="color" 
                          value="solo_negro"
                          checked={formData.color === 'solo_negro'}
                          onChange={handleInputChange}
                          required 
                        />
                        <span>Solo negro</span>
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="color" 
                          value="color"
                          checked={formData.color === 'color'}
                          onChange={handleInputChange}
                          required 
                        />
                        <span>Color</span>
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="color" 
                          value="negro_grises"
                          checked={formData.color === 'negro_grises'}
                          onChange={handleInputChange}
                          required 
                        />
                        <span>Negro y grises</span>
                      </label>
                    </div>
                    <small className="form-hint">¿Quieres que tenga color o prefieres negro?</small>
                  </div>
                </div>
              </div>

              {/* Referencias Visuales */}
              <div className="form-section">
                <h3 className="section-title">Referencias e inspiración</h3>
                <div className="row clearfix">
                  <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label htmlFor="reference_images">Sube algunas imágenes (opcional)</label>
                    <small className="form-hint" style={{ display: 'block', marginBottom: '8px' }}>
                      {formData.reference_images.length}/{MAX_REFERENCE_IMAGES} imágenes seleccionadas
                    </small>
                    <input 
                      type="file" 
                      id="reference_images"
                      name="reference_images"
                      accept="image/jpeg,image/png,image/jpg"
                      multiple
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <small className="form-hint">
                      Puedes subir hasta 3 imágenes. No tienen que ser exactas, solo para darnos una idea de lo que buscas. JPG o PNG, máximo 2MB cada una.
                    </small>
                    
                    {imagePreviews.length > 0 && (
                      <div className="image-previews">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="preview-item">
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <button 
                              type="button" 
                              className="remove-image"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Disponibilidad */}
              <div className="form-section">
                <h3 className="section-title">¿Cuándo te viene bien?</h3>
                <div className="row clearfix">
                  <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                    <label>Tus fechas preferidas *</label>
                    <small className="form-hint">Dinos cuándo te vendría bien la cita (mínimo 1 fecha, hasta 3)</small>
                    
                    <div className="dates-group">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="date-input-wrapper">
                          <label htmlFor={`date_${index}`}>Opción {index + 1} {index === 0 ? '*' : ''}</label>
                          <input 
                            type="date" 
                            id={`date_${index}`}
                            name={`preferred_date_${index}`}
                            value={formData.preferred_dates[index]}
                            onChange={(e) => handleDateChange(index, e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required={index === 0}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de envío */}
              <div className="form-group text-center">
                <button className="theme-btn btn-style-one" type="submit" disabled={isSubmitting}>
                  <span className="txt">{isSubmitting ? 'Enviando...' : 'Solicitar cita'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Reservas

