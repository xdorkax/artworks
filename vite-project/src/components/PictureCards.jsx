import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardMedia, CardContent, CardActions, Collapse, IconButton, Typography, Snackbar, Modal, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AuthContext } from '../context/AuthProvider';
import { getFirestore, doc, setDoc } from "firebase/firestore";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const modalStyle = {
  position: 'absolute',
  width: '50%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function PictureCard({ name, description, url, handleFavoriteClick, isFavorite }) {
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { currentUser } = React.useContext(AuthContext);
  const [favorite, setFavorite] = React.useState(isFavorite);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFavoriteClickWrapper = async () => {
    if (!currentUser) {
      setOpen(true);
    } else {
      handleFavoriteClick();
      setFavorite(!favorite);

      const db = getFirestore();

      try {
        await setDoc(doc(db, "favorites", currentUser.uid), {
          [name]: {
            description: description,
            url: url,
            isFavorite: !favorite,
          },
        }, { merge: true });
      } catch (e) {
        console.error("Dokumentum hozzáadási hiba: ", e);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Card sx={{ width: 345, margin: "10px" }}>
        <Typography sx={{ padding: "2px" }}>{name}</Typography>
      <CardMedia
        component="img"
        height="194"
        image={url}
        alt={url}
        onClick={handleModalOpen}
        style={{ cursor: 'pointer', maxHeight: '150px' }} // Kisebb képméret
      />
      <CardActions disableSpacing>
        <IconButton
          aria-label="Add to favorites"
          onClick={handleFavoriteClickWrapper}
          color={favorite ? "primary" : "default"}
        >
          <FavoriteIcon />
        </IconButton>
        <Typography sx={{ textAlign: "right", width: "100%" }}>More information</Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>Description: <br />{description}</Typography>
        </CardContent>
      </Collapse>
      <Snackbar color='inherit' open={open} autoHideDuration={6000} onClose={handleClose} message="You must log-in!" />
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle} style={{display:"flex", flexDirection:"column", gap:"20px", alingItems:"center"}}>
          <img src={url} alt={name} style={{ maxWidth: '100%', maxHeight: '50vh', objectFit:"contain"}} />
          <Typography>{description}</Typography>
          <IconButton
          aria-label="Add to favorites"
          onClick={handleFavoriteClickWrapper}
          color={favorite ? "primary" : "default"}
          sx={{width:"20px", height:"20px"}}
        >
          <FavoriteIcon />
        </IconButton>
        </Box>
      </Modal>
    </Card>
  );
}

export default PictureCard;
