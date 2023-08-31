import { useContext, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AuthContext } from "../context/AuthProvider";
import SignIn from "./SignIn";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import FavoriteDialog from "./Dialog";


export default function SearchAppBar({
  setInputData,
  handleShowFavorites,
  setSelectedBreedId,
}) {
  const [breeds, setBreeds] = useState([]);
  const { currentUser, logout } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  const handleInputChange = (event, value) => {
    const selectedBreed = breeds.find((breed) => breed.name === value);
    if (selectedBreed) {
      setSelectedBreedId(selectedBreed.id);
    }
    setInputData(value);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      console.log("Failed to log out");
    }
  };

  const handleModalOpen = async () => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setFavorites(userDocSnap.data().favorites || []);
      }
    }
    setOpen(true);
  };


  const handleModalClose = () => {
    setOpen(false);
    setSelectedFavorite(null);
  };


  const handleExpandClick = (index) => {
    setExpanded(expanded === index ? -1 : index);
  };

  const handleFavoriteDelete = async (favorite) => {
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const favorites = userDocSnap.data().favorites || [];
      const updatedFavorites = favorites.filter((item) => item.url !== favorite.url);
      await updateDoc(userDocRef, { favorites: updatedFavorites });
      setFavorites(updatedFavorites);
    }
  };


  const getBreeds = async () => {
    const breedsRequest = await fetch("https://api.thecatapi.com/v1/breeds");
    const breedsResponse = await breedsRequest.json();
    setBreeds(breedsResponse);
  };

  useEffect(() => {
    getBreeds();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Random Cat Gallery
              </Typography>
            </Box>
            <Autocomplete
              disablePortal
              options={breeds.map((breed) => breed.name)}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField sx={{ color: "white" }} {...params} label="Search Breed" />
              )}
              onInputChange={handleInputChange}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {currentUser ? (
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                  <IconButton color="inherit">
                    <AccountCircle />
                  </IconButton>
                  <IconButton color="inherit" onClick={handleModalOpen}>
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton color="inherit" onClick={handleLogout}>
                    <ExitToAppIcon />
                  </IconButton>
                  <FavoriteDialog
                    open={open}
                    handleModalClose={handleModalClose}
                    handleExpandClick={handleExpandClick}
                    expanded={expanded}
                    handleFavoriteDelete={handleFavoriteDelete}
                    favorites={favorites}
                    selectedFavorite={selectedFavorite}
                    setSelectedFavorite={setSelectedFavorite}
                  />
                </div>
              ) : (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2rem" }}
                >
                  <SignIn />
                </div>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
