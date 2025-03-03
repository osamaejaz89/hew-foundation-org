import { Dialog, IconButton, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useState, useRef, MouseEvent } from "react";

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal = ({ open, onClose, imageUrl }: ImageModalProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 4)); // Max zoom 4x
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5)); // Min zoom 0.5x
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth={false}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)'
        }
      }}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          boxShadow: 'none',
          position: 'relative',
          overflow: 'visible',
          width: '90vw',
          height: '90vh',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      {/* Control buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '8px',
          borderRadius: '8px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1
        }}
      >
        <IconButton
          onClick={handleZoomIn}
          size="small"
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            },
            width: 36,
            height: 36
          }}
        >
          <ZoomInIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handleZoomOut}
          size="small"
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            },
            width: 36,
            height: 36
          }}
        >
          <ZoomOutIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handleReset}
          size="small"
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            },
            width: 36,
            height: 36
          }}
        >
          <RestartAltIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            },
            width: 36,
            height: 36
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Image container with zoom and drag */}
      <Box
        ref={containerRef}
        sx={{
          overflow: 'hidden',
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: scale > 1 ? isDragging ? 'grabbing' : 'grab' : 'default',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(8px)',
            zIndex: 0
          }
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img 
          src={imageUrl} 
          alt="Receipt Full View" 
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            transformOrigin: 'center',
            maxWidth: '85%',
            maxHeight: '85%',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 1,
            position: 'relative'
          }}
        />
      </Box>
    </Dialog>
  );
};

export default ImageModal; 