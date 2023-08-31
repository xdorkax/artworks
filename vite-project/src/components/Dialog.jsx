import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Favorite } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box } from "@mui/system";

export default function FavoriteDialog({
    open,
    handleModalClose,
    handleExpandClick,
    expanded,
    handleFavoriteDelete,
    favorites,
    selectedFavorite,
    setSelectedFavorite,
}) {
    return (
        <Dialog style={{ padding: "3rem" }} maxWidth="md" fullWidth={true} open={open} onClose={handleModalClose}>
            <DialogTitle textAlign="center">
                Your Favorites
            </DialogTitle>
            <DialogContent style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Autocomplete
                    style={{ width: "30%" }}
                    options={favorites}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                        setSelectedFavorite(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Search..." />}
                />
                {favorites.length === 0 ? (
                    <Typography margin="3rem 2rem" variant="h6" color="textSecondary" textAlign="center">
                        You don't have any favorite pictures. <br /> Click on the <Favorite color="secondary" /> icon of the pictures to add them!
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {favorites.map((favorite, index) => (
                            (!selectedFavorite || favorite === selectedFavorite) && (
                                <Card key={index} sx={{ width: 345, margin: "10px" }}>
                                    <CardHeader>
                                        <Typography>{favorite.name}</Typography>
                                    </CardHeader>
                                    <CardMedia
                                        component="img"
                                        height="194"
                                        image={favorite.url}
                                        alt={favorite.name}
                                    />
                                    <CardActions disableSpacing>
                                        <IconButton
                                            aria-label="remove from favorites"
                                            color="primary"
                                            onClick={() => handleFavoriteDelete(favorite)}
                                        >
                                            <FavoriteIcon />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => handleExpandClick(index)}
                                            aria-expanded={expanded === index}
                                            aria-label="show more"
                                        >
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    </CardActions>
                                    <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                                        <CardContent>
                                            <Typography>Description: <br />{favorite.description}</Typography>
                                        </CardContent>
                                    </Collapse>
                                </Card>
                            )
                        ))}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleModalClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
