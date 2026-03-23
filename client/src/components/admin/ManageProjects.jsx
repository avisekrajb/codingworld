import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageProjects({ dark, C }) {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    detailedDesc: '',
    tags: [],
    color: '#00e5ff',
    emoji: '🚀',
    liveUrl: '',
    githubUrl: '',
    features: [],
    technologies: [],
    client: '',
    duration: '',
    images: [],
    imagePreviews: [],
    thumbnailIndex: 0
  });
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);

  // Get admin key from localStorage
  const adminKey = localStorage.getItem('adminKey') || 'coding-world-admin-2025';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/admin/projects', {
        headers: {
          'admin-key': adminKey
        }
      });
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Validation function
  const validateForm = () => {
    if (!formData.title.trim()) {
      alert('Please enter a project title');
      return false;
    }
    if (!formData.desc.trim()) {
      alert('Please enter a short description');
      return false;
    }
    if (formData.imagePreviews.length === 0) {
      alert('Please upload at least one project image');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setUploading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('detailedDesc', formData.detailedDesc || '');
    formDataToSend.append('tags', JSON.stringify(formData.tags));
    formDataToSend.append('color', formData.color);
    formDataToSend.append('emoji', formData.emoji);
    formDataToSend.append('liveUrl', formData.liveUrl || '#');
    formDataToSend.append('githubUrl', formData.githubUrl || '');
    formDataToSend.append('features', JSON.stringify(formData.features));
    formDataToSend.append('technologies', JSON.stringify(formData.technologies));
    formDataToSend.append('client', formData.client || '');
    formDataToSend.append('duration', formData.duration || '');
    formDataToSend.append('thumbnailIndex', formData.thumbnailIndex);
    
    // Send existing images as JSON string (filter out blob URLs)
    const existingImages = formData.imagePreviews.filter(url => !url.startsWith('blob:'));
    formDataToSend.append('existingImages', JSON.stringify(existingImages));

    // Append new images
    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        formDataToSend.append('images', formData.images[i]);
      }
    }

    try {
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'admin-key': adminKey 
        }
      };

      console.log('📤 Sending project data...');
      console.log('Title:', formData.title);
      console.log('Images:', formData.images.length, 'new images');
      console.log('Existing images:', existingImages.length);

      let response;
      if (editingProject) {
        response = await axios.put(`/api/admin/projects/${editingProject._id}`, formDataToSend, config);
      } else {
        response = await axios.post('/api/admin/projects', formDataToSend, config);
      }
      
      console.log('📥 Response:', response.data);
      
      if (response.data.success) {
        fetchProjects();
        setShowForm(false);
        resetForm();
        alert('✅ ' + (response.data.message || 'Project saved successfully!'));
      }
    } catch (error) {
      console.error('❌ Error saving project:', error);
      
      let errorMessage = 'Failed to save project. ';
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        if (error.response.data && error.response.data.message) {
          errorMessage += error.response.data.message;
        } else if (error.response.data && error.response.data.errors) {
          errorMessage += error.response.data.errors.join(', ');
        } else {
          errorMessage += `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        errorMessage += error.message;
      }
      
      alert('❌ ' + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/admin/projects/${id}`, {
          headers: {
            'admin-key': adminKey
          }
        });
        fetchProjects();
        alert('✅ Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project.');
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      desc: project.desc || '',
      detailedDesc: project.detailedDesc || '',
      tags: project.tags || [],
      color: project.color || '#00e5ff',
      emoji: project.emoji || '🚀',
      liveUrl: project.liveUrl || '#',
      githubUrl: project.githubUrl || '',
      features: project.features || [],
      technologies: project.technologies || [],
      client: project.client || '',
      duration: project.duration || '',
      images: [],
      imagePreviews: project.images || [],
      thumbnailIndex: project.thumbnailIndex || 0
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      desc: '',
      detailedDesc: '',
      tags: [],
      color: '#00e5ff',
      emoji: '🚀',
      liveUrl: '#',
      githubUrl: '',
      features: [],
      technologies: [],
      client: '',
      duration: '',
      images: [],
      imagePreviews: [],
      thumbnailIndex: 0
    });
    setTagInput('');
    setFeatureInput('');
    setTechInput('');
  };

  // Handle multiple image upload
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Check file sizes
      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      if (validFiles.length !== files.length) {
        alert('Some files exceed 5MB limit and were skipped.');
      }

      const newImages = [...formData.images, ...validFiles];
      const newPreviews = [
        ...formData.imagePreviews,
        ...validFiles.map(file => URL.createObjectURL(file))
      ];
      
      setFormData({
        ...formData,
        images: newImages,
        imagePreviews: newPreviews
      });
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = formData.imagePreviews.filter((_, i) => i !== index);
    
    // Adjust thumbnail index if needed
    let newThumbnailIndex = formData.thumbnailIndex;
    if (index < formData.thumbnailIndex) {
      newThumbnailIndex--;
    } else if (index === formData.thumbnailIndex && newPreviews.length > 0) {
      newThumbnailIndex = 0;
    }

    setFormData({
      ...formData,
      images: newImages,
      imagePreviews: newPreviews,
      thumbnailIndex: newThumbnailIndex
    });
  };

  const setAsThumbnail = (index) => {
    setFormData({
      ...formData,
      thumbnailIndex: index
    });
  };

  // Tag management
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tagToRemove)
    });
  };

  // Feature management
  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  // Technology management
  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (index) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index)
    });
  };

  const colorOptions = ['#00e5ff', '#bf5fff', '#00ffb3', '#ff9d00', '#ff6b6b', '#ffd700'];
  const emojiOptions = ['🛍️', '🍔', '📚', '🏥', '🏠', '💰', '🚀', '💻', '📱', '🎨', '⚡', '🔧'];

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 15
      }}>
        <h3 style={{ color: C.text, fontSize: 18 }}>Manage Projects</h3>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          style={{
            background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            color: '#07071a',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          <span>+</span> Add New Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📁</div>
          <h4 style={{ color: C.text, marginBottom: 10 }}>No Projects Yet</h4>
          <p style={{ color: C.muted, marginBottom: 20 }}>Click the button above to add your first project.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 20
        }}>
          {projects.map(project => (
            <div
              key={project._id}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 12px 40px ${project.color}20`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image Gallery Preview */}
              <div style={{
                height: 180,
                background: `linear-gradient(135deg,${project.color}20,${project.color}10)`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {project.images && project.images.length > 0 ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      src={project.images[project.thumbnailIndex || 0]}
                      alt={project.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {project.images.length > 1 && (
                      <div style={{
                        position: 'absolute',
                        bottom: 5,
                        right: 5,
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 11
                      }}>
                        +{project.images.length} photos
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: 48
                  }}>
                    {project.emoji}
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: project.color,
                  color: '#07071a',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700
                }}>
                  {project.tags?.length || 0} tags
                </div>
              </div>

              <div style={{ padding: 15 }}>
                <h4 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 5 }}>
                  {project.title}
                </h4>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 10 }}>
                  {project.desc?.substring(0, 80)}...
                </p>
                
                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                    {project.technologies.slice(0, 3).map(tech => (
                      <span key={tech} style={{
                        background: project.color + '15',
                        border: `1px solid ${project.color}30`,
                        color: project.color,
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 10,
                        fontWeight: 600
                      }}>
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span style={{ color: C.muted, fontSize: 10 }}>+{project.technologies.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#00e5ff',
                        fontSize: 12,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}
                    >
                      <span>🌐</span> Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#bf5fff',
                        fontSize: 12,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}
                    >
                      <span>💻</span> GitHub
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <button
                    onClick={() => handleEdit(project)}
                    style={{
                      background: 'none',
                      border: `1px solid ${C.border}`,
                      borderRadius: 6,
                      padding: '4px 12px',
                      fontSize: 12,
                      color: '#00e5ff',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    style={{
                      background: 'none',
                      border: `1px solid #ff6b6b44`,
                      borderRadius: 6,
                      padding: '4px 12px',
                      fontSize: 12,
                      color: '#ff6b6b',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowForm(false)}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(10px)'
          }} />
          
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark ? '#0d0d28' : '#f8f8ff',
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: 30,
              maxWidth: 800,
              width: '95%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <h3 style={{ color: C.text, fontSize: 20, marginBottom: 20 }}>
              {editingProject ? '✏️ Edit Project' : '➕ Add New Project'}
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Multiple Image Upload */}
              <div style={{ marginBottom: 25 }}>
                <label style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 10
                }}>
                  Project Images (Upload up to 5 photos) *
                </label>
                
                {/* Image Previews */}
                {formData.imagePreviews.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: 10,
                    marginBottom: 15
                  }}>
                    {formData.imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: formData.thumbnailIndex === index ? `3px solid ${formData.color}` : `1px solid ${C.border}`,
                          aspectRatio: '1/1'
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        
                        {/* Thumbnail Badge */}
                        {formData.thumbnailIndex === index && (
                          <div style={{
                            position: 'absolute',
                            top: 2,
                            left: 2,
                            background: formData.color,
                            color: '#07071a',
                            fontSize: 10,
                            padding: '2px 4px',
                            borderRadius: 4,
                            fontWeight: 600
                          }}>
                            THUMBNAIL
                          </div>
                        )}

                        {/* Image Controls */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'rgba(0,0,0,0.7)',
                          padding: '4px',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 5
                        }}>
                          {formData.thumbnailIndex !== index && (
                            <button
                              type="button"
                              onClick={() => setAsThumbnail(index)}
                              style={{
                                background: 'none',
                                border: '1px solid #00e5ff',
                                color: '#00e5ff',
                                fontSize: 10,
                                padding: '2px 4px',
                                borderRadius: 3,
                                cursor: 'pointer'
                              }}
                            >
                              Set as Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              background: 'none',
                              border: '1px solid #ff6b6b',
                              color: '#ff6b6b',
                              fontSize: 10,
                              padding: '2px 4px',
                              borderRadius: 3,
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {formData.imagePreviews.length < 5 && (
                  <div
                    onClick={() => document.getElementById('project-images').click()}
                    style={{
                      border: `2px dashed ${C.border}`,
                      borderRadius: 10,
                      padding: 20,
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#00e5ff'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                  >
                    <input
                      id="project-images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: 32, marginBottom: 10 }}>📸</div>
                    <div style={{ color: C.text, fontSize: 14, marginBottom: 5 }}>
                      Click to upload images
                    </div>
                    <div style={{ color: C.muted, fontSize: 12 }}>
                      JPG, PNG, GIF • Max 5MB each • Up to 5 images
                    </div>
                  </div>
                )}
              </div>

              {/* Rest of the form remains the same... */}
              {/* Basic Info - 2 Column Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 15,
                marginBottom: 15
              }}>
                {/* Title */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 6
                  }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., E-Commerce Platform"
                    style={{
                      width: '100%',
                      background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: C.text
                    }}
                  />
                </div>

                {/* Client */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 6
                  }}>
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={e => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g., ABC Corp"
                    style={{
                      width: '100%',
                      background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: C.text
                    }}
                  />
                </div>
              </div>

              {/* Short Description */}
              <div style={{ marginBottom: 15 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 6
                }}>
                  Short Description *
                </label>
                <input
                  type="text"
                  value={formData.desc}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                  required
                  placeholder="Brief overview of the project"
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: C.text
                  }}
                />
              </div>

              {/* Detailed Description */}
              <div style={{ marginBottom: 15 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 6
                }}>
                  Detailed Description
                </label>
                <textarea
                  value={formData.detailedDesc}
                  onChange={e => setFormData({ ...formData, detailedDesc: e.target.value })}
                  rows={4}
                  placeholder="Detailed project description, challenges, solutions, etc."
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: C.text,
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Duration */}
              <div style={{ marginBottom: 15 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 6
                }}>
                  Project Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3 months"
                  style={{
                    width: '100%',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: C.text
                  }}
                />
              </div>

              {/* URLs - 2 Column Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 15,
                marginBottom: 15
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 6
                  }}>
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    style={{
                      width: '100%',
                      background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: C.text
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 6
                  }}>
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    style={{
                      width: '100%',
                      background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: C.text
                    }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: 15 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 6
                }}>
                  Tags
                </label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag (e.g., React)"
                    style={{
                      flex: 1,
                      background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: C.text
                    }}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    style={{
                      background: 'linear-gradient(135deg,#00e5ff,#0095ff)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      color: '#07071a',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: '#00e5ff20',
                        border: '1px solid #00e5ff44',
                        borderRadius: 4,
                        padding: '4px 8px',
                        fontSize: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff6b6b',
                          cursor: 'pointer',
                          fontSize: 14,
                          padding: '0 2px'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div style={{ marginBottom: 15 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 6
                }}>
                  Technologies Used
                </label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    placeholder="Add technology (e.g., MongoDB)"
                    style={{
                      flex: 1,
                      background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: C.text
                    }}
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    style={{
                      background: 'linear-gradient(135deg,#bf5fff,#7b2fff)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#bf5fff20',
                        border: '1px solid #bf5fff44',
                        borderRadius: 4,
                        padding: '4px 8px',
                        fontSize: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff6b6b',
                          cursor: 'pointer',
                          fontSize: 14,
                          padding: '0 2px'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div style={{ marginBottom: 15 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  marginBottom: 6
                }}>
                  Key Features
                </label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="Add a feature"
                    style={{
                      flex: 1,
                      background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: C.text
                    }}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    style={{
                      background: 'linear-gradient(135deg,#00ffb3,#00e5ff)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      color: '#07071a',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        borderRadius: 6,
                        padding: '6px 10px'
                      }}
                    >
                      <span style={{ color: C.text, fontSize: 13 }}>• {feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff6b6b',
                          cursor: 'pointer',
                          fontSize: 16
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color and Emoji Selection */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 15,
                marginBottom: 20
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 6
                  }}>
                    Accent Color
                  </label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: color,
                          border: formData.color === color ? '3px solid #fff' : 'none',
                          cursor: 'pointer',
                          boxShadow: formData.color === color ? `0 0 0 2px ${color}` : 'none'
                        }}
                      >
                        <span style={{ opacity: 0 }}>.</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.muted,
                    marginBottom: 6
                  }}>
                    Emoji / Icon
                  </label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {emojiOptions.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, emoji })}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: formData.emoji === emoji ? '#00e5ff20' : 'transparent',
                          border: `1px solid ${formData.emoji === emoji ? '#00e5ff' : C.border}`,
                          cursor: 'pointer',
                          fontSize: 20
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-end',
                marginTop: 20,
                paddingTop: 20,
                borderTop: `1px solid ${C.border}`
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: '10px 20px',
                    color: C.muted,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    background: uploading ? '#888' : 'linear-gradient(135deg,#00e5ff,#0095ff)',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 30px',
                    color: '#07071a',
                    fontWeight: 600,
                    cursor: uploading ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  {uploading ? (
                    <>
                      <span style={{
                        width: 16,
                        height: 16,
                        border: '2px solid #07071a',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Uploading...
                    </>
                  ) : (
                    `${editingProject ? 'Update' : 'Add'} Project`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}