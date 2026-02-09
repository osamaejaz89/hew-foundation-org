import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  getHomeUpdates,
  uploadHomeUpdate,
  deleteHomeUpdate,
  updateHomeUpdateMeta,
  HomeUpdateImage,
} from "../../services/adminService";
import { toast } from "react-toastify";

const HomeUpdates: React.FC = () => {
  const [images, setImages] = useState<HomeUpdateImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editImage, setEditImage] = useState<HomeUpdateImage | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await getHomeUpdates();
      setImages(res.images || []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image (JPEG, PNG, WebP)");
      return;
    }
    setSelectedFile(file);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    setUploading(true);
    try {
      await uploadHomeUpdate(selectedFile, uploadTitle, uploadDescription);
      toast.success("Image uploaded. It will show on the app home.");
      setSelectedFile(null);
      setUploadTitle("");
      setUploadDescription("");
      fetchImages();
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img: HomeUpdateImage) => {
    if (!window.confirm("Remove this image from the app home?")) return;
    setDeletingId(img.id);
    try {
      await deleteHomeUpdate(img.filename);
      toast.success("Image removed");
      setImages((prev) => prev.filter((i) => i.id !== img.id));
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (img: HomeUpdateImage) => {
    setEditImage(img);
    setEditTitle(img.title || "");
    setEditDescription(img.description || "");
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editImage) return;
    setSavingEdit(true);
    try {
      const updated = await updateHomeUpdateMeta(editImage.filename, editTitle, editDescription);
      setImages((prev) => prev.map((i) => (i.id === editImage.id ? { ...i, ...updated.image } : i)));
      toast.success("Title & description updated.");
      setEditOpen(false);
      setEditImage(null);
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Home carousel images
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        These images appear on the app home (Updates & Achievements). Add title and description so they show correctly on the app.
      </Alert>

      {/* Upload form: title, description, file, upload button */}
      <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Add new image
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Title"
              placeholder="e.g. Hew Foundation Library"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Description"
              placeholder="e.g. Supporting education."
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleSelectFile}
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{ mr: 1 }}
            >
              {selectedFile ? selectedFile.name : "Choose image"}
            </Button>
            <Button
              variant="contained"
              startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
            >
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : images.length === 0 ? (
        <Typography color="text.secondary">No images yet. Add title, description and upload an image above.</Typography>
      ) : (
        <Grid container spacing={2}>
          {images.map((img) => (
            <Grid item xs={12} sm={6} md={4} key={img.id}>
              <Card sx={{ position: "relative", overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={img.url}
                  alt={img.title || img.filename}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                  <Typography variant="subtitle2" fontWeight={600} noWrap>
                    {img.title || "—"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {img.description || "—"}
                  </Typography>
                </CardContent>
                <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => openEdit(img)}
                    sx={{ bgcolor: "rgba(0,0,0,0.6)", color: "white", "&:hover": { bgcolor: "primary.main" } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(img)}
                    disabled={deletingId === img.id}
                    sx={{ bgcolor: "rgba(0,0,0,0.6)", color: "white", "&:hover": { bgcolor: "error.main" } }}
                  >
                    {deletingId === img.id ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit title & description</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={savingEdit}>
            {savingEdit ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomeUpdates;
