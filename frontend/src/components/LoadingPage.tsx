import { Box, Typography } from '@mui/material'

interface LoadingPageProps {
  label?: string
  fullScreen?: boolean
}

export default function LoadingPage({ label = 'Loading…', fullScreen = false }: LoadingPageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : 360,
        gap: 2.5,
        userSelect: 'none',
      }}
    >
      {/* Animated shield */}
      <Box sx={{ position: 'relative', width: 48, height: 48 }}>
        {/* Outer ring */}
        <Box
          sx={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#4338CA',
            borderRightColor: '#818CF8',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              to: { transform: 'rotate(360deg)' },
            },
          }}
        />
        {/* Inner ring */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: '#C7D2FE',
            animation: 'spinR 1.5s linear infinite',
            '@keyframes spinR': {
              to: { transform: 'rotate(-360deg)' },
            },
          }}
        />
        {/* Center mark */}
        <Box
          sx={{
            position: 'absolute',
            inset: 8,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #4338CA, #6D63E8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(67,56,202,0.35)',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#374151',
            letterSpacing: '-0.005em',
          }}
        >
          {label}
        </Typography>
        {/* Dot pulse */}
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mt: 1 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: '#4338CA',
                opacity: 0.5,
                animation: 'dotPulse 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
                '@keyframes dotPulse': {
                  '0%, 80%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
                  '40%':           { opacity: 1,   transform: 'scale(1)' },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
