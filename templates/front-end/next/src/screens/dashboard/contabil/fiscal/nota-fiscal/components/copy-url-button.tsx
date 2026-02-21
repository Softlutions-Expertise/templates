import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { IoCopyOutline } from 'react-icons/io5';
import { AnimatePresence, m } from 'framer-motion';
import { useSnackbar } from '@/components';

// ----------------------------------------------------------------------

interface Props {
  currentTab?: string;
}

export function CopyUrlButton({ currentTab }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  
  const [buttonText, setButtonText] = useState('Copiar URL');
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      const url = new URL(window.location.href);
      if (currentTab) {
        url.searchParams.set('tab', currentTab);
      }
      const urlToCopy = url.toString();
      
      await navigator.clipboard.writeText(urlToCopy);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 150);

      setCopied(true);
      setButtonText('URL copiada');
      
      enqueueSnackbar('URL copiada para a área de transferência!', { 
        variant: 'success'
      });
    } catch (error) {
      console.error('Erro ao copiar URL:', error);
      enqueueSnackbar('Erro ao copiar URL. Tente novamente.', { 
        variant: 'error' 
      });
    }
  };

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => {
      setCopied(false);
      setButtonText('Copiar URL');
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      type="button"
      variant="outlined"
      color="inherit"
      onClick={handleCopyUrl}
      sx={{
        borderStyle: 'dashed',
        color: 'text.secondary',
        borderColor: 'grey.400',
        '&:hover': {
          borderColor: 'primary.main',
          color: 'primary.main',
        },
        transition: 'transform 0.15s ease',
        transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={buttonText}
          initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <IoCopyOutline style={{ marginTop: 1 }} />
          {buttonText}
        </m.span>
      </AnimatePresence>
    </Button>
  );
}