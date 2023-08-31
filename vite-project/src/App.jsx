import { useState, useEffect, useContext } from "react";
import SearchAppBar from "./components/AppSearchBar";
import PictureCard from "./components/PictureCards";
import { Box, CircularProgress } from "@mui/material";
import { AuthContext } from "./context/AuthProvider";
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [data, setData] = useState([]);
  const [inputData, setInputData] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const db = getFirestore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const favoritesData = doc.data().favorites;
          if (Array.isArray(favoritesData)) {
            setFavorites(favoritesData);
          } else {
            console.log("Favorites data is not an array:", favoritesData);
            setFavorites([]);
          }
        } else {
          console.log("No such document!");
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser, db]);

  const handleFavoriteClick = async (picture) => {
    const isAlreadyFavorite = favorites.find((fav) => fav.url === picture.url);
    let newFavorites;
    if (isAlreadyFavorite) {
      newFavorites = favorites.filter((fav) => fav.url !== picture.url);
    } else {
      newFavorites = [
        ...favorites,
        {
          url: picture.url,
          name: picture.breeds[0].name,
          description: picture.breeds[0].description,
        },
      ];
    }
    setFavorites(newFavorites);
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        await updateDoc(docRef, {
          favorites: newFavorites,
        });
      } else {
        await setDoc(docRef, {
          favorites: newFavorites,
        });
      }
    }
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const [selectedBreedId, setSelectedBreedId] = useState("beng");

  async function getPictures() {
    setLoading(true);
    try {
      const request = await fetch(
        `https://api.thecatapi.com/v1/images/search?limit=9&breed_ids=${selectedBreedId}&api_key=live_fwmdi9OIpX5iuz3XgJWzqzTSKIMwhUJ2G0KgVClPwmtHlrNRDDOt2TSR0DrlBSAc`
      );
      const data = await request.json();
      setData(data);
    } catch (error) {
      console.error("Hiba a képek lekérése közben:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPictures();
  }, [inputData, selectedBreedId]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        <SearchAppBar
          setInputData={setInputData}
          handleShowFavorites={handleShowFavorites}
          setSelectedBreedId={setSelectedBreedId}
        />
        <Box
          sx={{
            padding: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <CircularProgress sx={{ marginTop: "50px" }} />
            ) : (
              data.map((item) => (
                <PictureCard
                  sx={{ margin: "10px" }}
                  key={item.id}
                  url={item.url}
                  name={item.breeds[0].name}
                  description={item.breeds[0].description}
                  handleFavoriteClick={() => handleFavoriteClick(item)}
                  isFavorite={favorites.some((fav) => fav.url === item.url)}
                />
              ))
            )}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
