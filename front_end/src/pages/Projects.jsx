import React, { useState } from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Modal,
  Box,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ProjectCard = ({ project, onView, onContact }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://via.placeholder.com/150"
        title="تصویر پروژه"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          مساحت: {project.area}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          مکان: {project.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          سال: {project.year}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" startIcon={<VisibilityIcon />} onClick={() => onView(project)}>
            مشاهده
          </Button>
          <Button variant="outlined" color="secondary" startIcon={<PhoneIcon />} onClick={() => onContact(project)}>
            تماس
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('همه');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filterCategories = ['همه', 'مسکونی', 'تجاری', 'صنعتی', 'اداری', 'هتلداری'];

  const projects = [
    {
      id: 1,
      title: 'مجتمع مسکونی برج آسمان',
      category: 'مسکونی',
      description: 'پروژه مسکونی لوکس با 200 واحد در منطقه 1 تهران با امکانات کامل رفاهی و تفریحی',
      status: 'completed',
      statusText: 'تکمیل شده',
      area: '15000 متر مربع',
      units: '200 واحد',
      floors: '25 طبقه',
      year: '1402',
      client: 'شرکت سرمایه گذاری آسمان',
      location: 'تهران، منطقه 1',
      details: 'این پروژه شامل دو برج 25 طبقه با امکانات کامل شامل استخر، سالن ورزش، پارکینگ طبقاتی، و فضای سبز است.'
    },
    // ... other projects
  ];

  const stats = [
    { icon: <i className="fas fa-building"></i>, number: '150+', label: 'پروژه تکمیل شده' },
    { icon: <i className="fas fa-users"></i>, number: '500+', label: 'مشتری راضی' },
    { icon: <i className="fas fa-award"></i>, number: '25+', label: 'جایزه دریافتی' },
    { icon: <i className="fas fa-calendar"></i>, number: '15+', label: 'سال تجربه' }
  ];

  const featuredProject = projects[0];

  const filteredProjects = activeFilter === 'همه'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const handleFilterClick = (category) => {
    setActiveFilter(category);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  const handleContactProject = (project) => {
    alert(`درخواست اطلاعات بیشتر درباره پروژه: ${project.title}`);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProject(null);
  };

  return (
    <div>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h2" align="center" gutterBottom>
          پروژه‌های ما
        </Typography>
        <Typography variant="h5" align="center" paragraph>
          نمونه‌ای از پروژه‌های موفق و متنوع ما در زمینه‌های مختلف ساختمانی و عمرانی
        </Typography>

        <Grid container spacing={3} sx={{ my: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4">{stat.icon}</Typography>
                <Typography variant="h5">{stat.number}</Typography>
                <Typography variant="body1">{stat.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" align="center" gutterBottom>
          پروژه ویژه
        </Typography>
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 4 }}>
          <CardMedia
            component="img"
            sx={{ width: { md: 300 }, height: 200 }}
            image="https://via.placeholder.com/300"
            alt="تصویر پروژه"
          />
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h5" component="div">
              {featuredProject.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {featuredProject.details}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>مساحت:</strong> {featuredProject.area}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>تعداد واحد:</strong> {featuredProject.units}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>تعداد طبقات:</strong> {featuredProject.floors}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>سال تکمیل:</strong> {featuredProject.year}</Typography>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" startIcon={<VisibilityIcon />} onClick={() => handleViewProject(featuredProject)}>
                مشاهده جزئیات
              </Button>
              <Button variant="outlined" color="secondary" startIcon={<PhoneIcon />} onClick={() => handleContactProject(featuredProject)} sx={{ mr: 2 }}>
                تماس
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="h4" align="center" gutterBottom>
          دسته بندی پروژه ها
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          {filterCategories.map((category, index) => (
            <Button
              key={index}
              variant={activeFilter === category ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handleFilterClick(category)}
            >
              {category}
            </Button>
          ))}
        </Box>

        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard project={project} onView={handleViewProject} onContact={handleContactProject} />
            </Grid>
          ))}
        </Grid>

        <Modal
          open={modalVisible}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {selectedProject?.title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {selectedProject?.details}
            </Typography>
            <Typography sx={{ mt: 2 }}><strong>مساحت:</strong> {selectedProject?.area}</Typography>
            <Typography><strong>تعداد واحد:</strong> {selectedProject?.units}</Typography>
            <Typography><strong>تعداد طبقات:</strong> {selectedProject?.floors}</Typography>
            <Typography><strong>سال تکمیل:</strong> {selectedProject?.year}</Typography>
            <Typography><strong>کارفرما:</strong> {selectedProject?.client}</Typography>
            <Typography><strong>موقعیت:</strong> {selectedProject?.location}</Typography>
            <Typography><strong>وضعیت پروژه:</strong> {selectedProject?.statusText}</Typography>
          </Box>
        </Modal>
      </Container>
    </div>
  );
};

export default Projects;