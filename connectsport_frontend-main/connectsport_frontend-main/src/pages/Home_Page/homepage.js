import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Paper, Card, CardMedia, CardContent, CardActions, Modal, Grid, Grow } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

const sportsData = [
  {
    name: 'Soccer',
    image: 'https://source.unsplash.com/featured/?soccer',
    facts: 'Soccer is played by 250 million players in over 200 countries, making it the world\'s most popular sport.',
    icon: <SportsSoccerIcon />
  },
  {
    name: 'Basketball',
    image: 'https://source.unsplash.com/featured/?basketball',
    facts: 'Basketball was invented by Dr. James Naismith in 1891 in Springfield, Massachusetts.',
    icon: <SportsBasketballIcon />
  },
  {
    name: 'Tennis',
    image: 'https://source.unsplash.com/featured/?tennis',
    facts: 'Tennis originated in Birmingham, England, in the late 19th century as lawn tennis.',
    icon: <SportsTennisIcon />
  }
];

// Modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  transition: 'transform 0.5s ease-out',
};

const MainPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleOpen = (facts) => {
    setModalContent(facts);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoginRedirect = () => {
    navigate(`/login`);
  };

  return (
    <Box sx={{
      height: '100vh',
      backgroundImage: 'url(https://source.unsplash.com/featured/?stadium)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Container component={Paper} elevation={12} sx={{ py: 5, px: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 3, maxWidth: '900px' }}>
        <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
          Connect with Fellow Athletes
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {sportsData.map((sport, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Grow in timeout={500 + index * 500}>
                <Card sx={{ maxWidth: 345, '&:hover': { boxShadow: 6, cursor: 'pointer' } }} onClick={() => handleOpen(sport.facts)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={sport.image}
                    alt={sport.name}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {sport.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" startIcon={sportsData[0].icon} onClick={handleLoginRedirect}>
            Join Now / Login
          </Button>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Interesting Facts
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {modalContent}
            </Typography>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default MainPage;
