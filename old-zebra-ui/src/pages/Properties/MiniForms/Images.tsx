import { useState, type ChangeEvent, useRef } from "react";
import { Button, Grid, Paper, FormLabel, Typography, FormControl } from "@mui/material";
import { Delete, PhotoCamera } from "@mui/icons-material";

interface Image {
  id: number;
  url: string;
}
interface Props {
  onNextTab: () => void;
  onPrevTab: () => void;
}

const ImageUpload: React.FC<Props> = (props) => {
  const [images, setImages] = useState<Image[]>([]);
  const [errors, setErrors] = useState({
    images: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    const uploadedImages: Image[] = [];

    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        // Check if the file type is allowed
        if (file.type === "image/jpeg" || file.type === "image/png") {
          const reader = new FileReader();

          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              uploadedImages.push({ id: Date.now() + i, url: reader.result });
              if (uploadedImages.length === fileList.length) {
                setImages((prevImages) => [...prevImages, ...uploadedImages]);
              }
            }
          };

          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleDelete = (id: number) => {
    const updatedImages = images.filter((_, index) => index !== id);
    setImages(updatedImages);
  };

  const handleAddPhotosClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const proceedNext = images.length > 0;
  const handleNextClick = () => {
    const newErrors = { ...errors };
    if (proceedNext) {
      props.onNextTab();
    } else {
      alert("Upload at least one image");
      newErrors.images = "Upload a image";
    }
    setErrors(newErrors);
  };

  return (
    <div>
      <label htmlFor="upload-input">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <input
            ref={fileInputRef}
            id="upload-input"
            type="file"
            accept="image/jpeg, image/png"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          {errors.images && <div style={{ color: "red" }}>Error: {errors.images}</div>}
          <Paper
            variant="outlined"
            style={{
              width: "70vw",
              maxWidth: "800%",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleAddPhotosClick}
          >
            <PhotoCamera style={{ fontSize: 30, paddingBottom: "7px" }} />
            <Typography>
              <b>Add photos to get 5X more responses.</b>
            </Typography>
            <Typography>90% tenants contact on properties with photos.</Typography>
            <Button variant="contained" color="primary" style={{ marginTop: "10px" }}>
              Add Photos
            </Button>
          </Paper>
        </div>
      </label>
      <FormLabel sx={{ m: 1 }} component="legend">
        Photos added by you
      </FormLabel>
      <Grid container spacing={2} alignItems="stretch">
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={image.id}>
            <Paper style={{ height: "100%", padding: "10px", textAlign: "center" }}>
              <img
                src={image.url}
                alt={`Uploaded ${image.id}`}
                style={{ maxWidth: "100%", maxHeight: "100%", marginBottom: "10px" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDelete(index)}
                startIcon={<Delete />}
              >
                Delete
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Grid container justifyContent="space-between">
        <FormControl sx={{ m: 1 }}>
          <Button sx={{ width: 160, height: 50 }} variant="contained" onClick={props.onPrevTab}>
            Previous
          </Button>
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <Button
            sx={{ width: 160, height: 50 }}
            variant="contained"
            onClick={handleNextClick}
            type="submit"
          >
            Next
          </Button>
        </FormControl>
      </Grid>
    </div>
  );
};

export default ImageUpload;
