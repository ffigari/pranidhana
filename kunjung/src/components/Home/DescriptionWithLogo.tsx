import { Box, Typography } from '@mui/material';

import { TopBar } from '../TopBar';

export const DescriptionWithLogo = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'hsla(210, 97.61904762%, 50.58823529%, 1)',
        position: 'relative',
        margin: 0,
        padding: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/pata-2500.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
          zIndex: 0,
        },
      }}
    >
      <TopBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <img
          src="/logo-2500.png"
          alt="Content"
          style={{ width: '60%', display: 'block' }}
        />
        <Box
          sx={{
            textAlign: 'center',
            marginTop: 2,
          }}
        >
          <Typography sx={{ color: 'var(--paragraphLargeColor)' }}>
            Kunjung (Tibetan: origin; the source of all) is an entity of PRR
            Foundation.
          </Typography>
          <Typography sx={{ color: 'var(--paragraphLargeColor)' }}>
            Kunjung is a charitable organisation committed to preserving and
            sharing traditional Himalayan Buddhist Arts, Philosophy, Culture
            and Tibetan Cosmic Science. It is the vision of Venerable Pong Re
            Rinpoche and has activities worldwide.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
